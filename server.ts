import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_BUSES, INITIAL_DRIVERS, generateSleeperSeats, generateSeaterSeats } from './src/data/initialData.ts';
import { Booking, Bus, DriverInfo, UserSession } from './src/types.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for live fullstack state
  let buses: Bus[] = JSON.parse(JSON.stringify(INITIAL_BUSES));
  let drivers: DriverInfo[] = JSON.parse(JSON.stringify(INITIAL_DRIVERS));
  let bookings: Booking[] = [
    {
      id: 'BK-SAMPLE-01',
      pnr: 'BG-849201',
      busId: 'BUS-KA-01',
      busNumber: 'KA-01-F-9412',
      operatorName: 'KSRTC Airavat Club Class Multi-Axle',
      operatorType: 'RTC',
      route: {
        from: 'Bengaluru',
        to: 'Hyderabad',
      },
      travelDate: '2026-09-22',
      departureTime: '21:30',
      arrivalTime: '06:00',
      boardingPoint: {
        time: '21:30',
        location: 'Majestic KBS Terminal 3',
        landmark: 'Platform 18',
      },
      droppingPoint: {
        time: '06:00',
        location: 'MGBS Bus Stand',
        landmark: 'Terminal 1 Hyderabad',
      },
      passengers: [
        {
          name: 'Shreehari G. S.',
          age: 28,
          gender: 'Male',
          seatNumber: 'L1',
          seatType: 'Sleeper (Lower)',
          fare: 1250,
        },
      ],
      contact: {
        email: 'shreeharigsofficial6@gmail.com',
        phone: '+91 98765 43210',
      },
      payment: {
        method: 'UPI',
        transactionId: 'UPI-9948210398',
        status: 'SUCCESS',
        paidAt: new Date(Date.now() - 86400000).toISOString(),
        upiId: 'shreehari@okhdfcbank',
      },
      fareBreakdown: {
        baseFareTotal: 1250,
        gst: 62.5,
        insurance: 15,
        discount: 50,
        totalAmount: 1277.5,
      },
      driver: {
        name: 'Rajeshwar Gowda',
        phone: '+91 98451 22891',
        license: 'KA04-20120008472',
        busNumber: 'KA-01-F-9412',
      },
      status: 'CONFIRMED',
      bookedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  // OTP Memory store: phone -> otp
  const otpStore = new Map<string, { otp: string; expiresAt: number }>();

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'BusGo All-India Booking Engine', timestamp: new Date().toISOString() });
  });

  // Get buses list with filtering
  app.get('/api/buses', (req, res) => {
    const { from, to, date, operatorType, busType, stateRTC, sort } = req.query;

    let result = [...buses];

    if (from && typeof from === 'string' && from.trim() !== '') {
      result = result.filter(b => b.route.from.toLowerCase().includes(from.toLowerCase().trim()));
    }

    if (to && typeof to === 'string' && to.trim() !== '') {
      result = result.filter(b => b.route.to.toLowerCase().includes(to.toLowerCase().trim()));
    }

    if (operatorType && typeof operatorType === 'string' && operatorType !== 'ALL') {
      result = result.filter(b => b.operatorType === operatorType);
    }

    if (stateRTC && typeof stateRTC === 'string' && stateRTC !== 'ALL') {
      result = result.filter(b => b.stateRTC === stateRTC);
    }

    if (busType && typeof busType === 'string' && busType !== 'ALL') {
      result = result.filter(b => b.busType.toLowerCase().includes(busType.toLowerCase()));
    }

    // Sort options
    if (sort === 'price_asc') {
      result.sort((a, b) => a.baseFare - b.baseFare);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.baseFare - a.baseFare);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'departure_early') {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    res.json({
      success: true,
      count: result.length,
      buses: result,
    });
  });

  // Get single bus details with live seat configuration
  app.get('/api/buses/:id', (req, res) => {
    const bus = buses.find(b => b.id === req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }
    res.json({ success: true, bus });
  });

  // Create booking
  app.post('/api/bookings', (req, res) => {
    const {
      busId,
      travelDate,
      boardingPoint,
      droppingPoint,
      passengers,
      contact,
      paymentMethod,
      upiId,
      cardLast4,
      walletProvider,
      insuranceOpted,
    } = req.body;

    const bus = buses.find(b => b.id === busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    // Verify seat availability
    const requestedSeatNumbers = passengers.map((p: any) => p.seatNumber);
    for (const seatNum of requestedSeatNumbers) {
      const seat = bus.seats.find(s => s.number === seatNum);
      if (!seat) {
        return res.status(400).json({ success: false, message: `Seat ${seatNum} does not exist` });
      }
      if (seat.status === 'booked') {
        return res.status(400).json({ success: false, message: `Seat ${seatNum} is already booked` });
      }
    }

    // Mark seats as booked on the bus
    bus.seats = bus.seats.map(s => {
      if (requestedSeatNumbers.includes(s.number)) {
        return { ...s, status: 'booked' as const };
      }
      return s;
    });

    // Compute fares
    const baseFareTotal = passengers.reduce((sum: number, p: any) => sum + (p.fare || bus.baseFare), 0);
    const gst = Math.round(baseFareTotal * 0.05 * 10) / 10;
    const insurance = insuranceOpted ? passengers.length * 15 : 0;
    const discount = baseFareTotal > 1500 ? 100 : 0;
    const totalAmount = baseFareTotal + gst + insurance - discount;

    const pnr = `BG-${Math.floor(100000 + Math.random() * 900000)}`;
    const txId = `${paymentMethod}-${Date.now().toString().slice(-8)}`;

    const newBooking: Booking = {
      id: `BK-${Date.now()}`,
      pnr,
      busId: bus.id,
      busNumber: bus.busNumber,
      operatorName: bus.operatorName,
      operatorType: bus.operatorType,
      route: {
        from: bus.route.from,
        to: bus.route.to,
      },
      travelDate: travelDate || new Date().toISOString().split('T')[0],
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      boardingPoint: boardingPoint || bus.boardingPoints[0],
      droppingPoint: droppingPoint || bus.droppingPoints[0],
      passengers,
      contact,
      payment: {
        method: paymentMethod,
        transactionId: txId,
        status: 'SUCCESS',
        paidAt: new Date().toISOString(),
        upiId,
        cardLast4,
        walletProvider,
      },
      fareBreakdown: {
        baseFareTotal,
        gst,
        insurance,
        discount,
        totalAmount,
      },
      driver: {
        name: bus.driver.name,
        phone: bus.driver.phone,
        license: bus.driver.license,
        busNumber: bus.busNumber,
      },
      status: 'CONFIRMED',
      bookedAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      booking: newBooking,
    });
  });

  // Get user bookings by phone or email or PNR
  app.get('/api/bookings', (req, res) => {
    const { phone, email, pnr } = req.query;

    let result = [...bookings];

    if (pnr && typeof pnr === 'string') {
      result = result.filter(b => b.pnr.toLowerCase() === pnr.toLowerCase().trim());
    } else {
      if (phone && typeof phone === 'string' && phone.trim() !== '') {
        const cleanQuery = phone.replace(/[^0-9]/g, '');
        result = result.filter(b => b.contact.phone.replace(/[^0-9]/g, '').includes(cleanQuery));
      } else if (email && typeof email === 'string' && email.trim() !== '') {
        result = result.filter(b => b.contact.email.toLowerCase() === email.toLowerCase().trim());
      }
    }

    res.json({
      success: true,
      count: result.length,
      bookings: result,
    });
  });

  // Get single booking by PNR
  app.get('/api/bookings/:pnr', (req, res) => {
    const booking = bookings.find(b => b.pnr.toLowerCase() === req.params.pnr.toLowerCase());
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, booking });
  });

  // Cancel booking
  app.post('/api/bookings/:pnr/cancel', (req, res) => {
    const booking = bookings.find(b => b.pnr.toLowerCase() === req.params.pnr.toLowerCase());
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'CANCELLED';

    // Release seats on the bus
    const bus = buses.find(b => b.id === booking.busId);
    if (bus) {
      const seatNumbersToFree = booking.passengers.map(p => p.seatNumber);
      bus.seats = bus.seats.map(s => {
        if (seatNumbersToFree.includes(s.number)) {
          return { ...s, status: 'available' as const };
        }
        return s;
      });
    }

    const refundAmount = Math.round(booking.fareBreakdown.totalAmount * 0.9);

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated.',
      refundAmount,
      refundReference: `REF-${Date.now().toString().slice(-6)}`,
      booking,
    });
  });

  // Admin: Analytics
  app.get('/api/admin/analytics', (req, res) => {
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.fareBreakdown.totalAmount, 0);
    const totalSeatsAllBuses = buses.reduce((sum, b) => sum + b.seats.length, 0);
    const bookedSeatsAllBuses = buses.reduce(
      (sum, b) => sum + b.seats.filter(s => s.status === 'booked').length,
      0
    );

    const occupancyRate = totalSeatsAllBuses > 0 ? Math.round((bookedSeatsAllBuses / totalSeatsAllBuses) * 100) : 0;

    const rtcBookings = confirmedBookings.filter(b => b.operatorType === 'RTC').length;
    const totalConfirmed = confirmedBookings.length || 1;
    const rtcShare = Math.round((rtcBookings / totalConfirmed) * 100);
    const privateShare = 100 - rtcShare;

    // Top routes
    const routeMap = new Map<string, { count: number; revenue: number }>();
    confirmedBookings.forEach(b => {
      const key = `${b.route.from} → ${b.route.to}`;
      const current = routeMap.get(key) || { count: 0, revenue: 0 };
      routeMap.set(key, {
        count: current.count + 1,
        revenue: current.revenue + b.fareBreakdown.totalAmount,
      });
    });

    const topRoutes = Array.from(routeMap.entries())
      .map(([route, data]) => ({ route, bookingsCount: data.count, revenue: data.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      success: true,
      analytics: {
        totalRevenue,
        totalBookings: confirmedBookings.length,
        activeBusesCount: buses.filter(b => b.status === 'ACTIVE').length,
        averageOccupancyPercentage: occupancyRate,
        rtcSharePercentage: rtcShare,
        privateSharePercentage: privateShare,
        topRoutes,
        recentBookings: bookings.slice(0, 8),
      },
    });
  });

  // Admin: Manage Buses & Routes
  app.get('/api/admin/buses', (req, res) => {
    res.json({ success: true, buses });
  });

  app.post('/api/admin/buses', (req, res) => {
    const {
      busNumber,
      operatorName,
      operatorType,
      stateRTC,
      from,
      to,
      distanceKm,
      departureTime,
      arrivalTime,
      duration,
      busType,
      baseFare,
      driverId,
    } = req.body;

    const assignedDriver = drivers.find(d => d.id === driverId) || drivers[0];

    const isSleeper = busType.includes('Sleeper');
    const seats = isSleeper ? generateSleeperSeats(Number(baseFare)) : generateSeaterSeats(Number(baseFare));

    const newBus: Bus = {
      id: `BUS-NEW-${Date.now().toString().slice(-4)}`,
      busNumber: busNumber || `IND-${Math.floor(10 + Math.random() * 90)}-Z-${Math.floor(1000 + Math.random() * 9000)}`,
      operatorName,
      operatorType: operatorType || 'PRIVATE',
      stateRTC: stateRTC || undefined,
      route: {
        from,
        to,
        distanceKm: Number(distanceKm) || 450,
      },
      departureTime,
      arrivalTime,
      duration,
      busType,
      baseFare: Number(baseFare),
      rating: 4.8,
      reviewsCount: 1,
      amenities: ['Air Conditioning', 'Charging Port', 'Live GPS Tracking', 'Sanitized Interior'],
      boardingPoints: [
        { time: departureTime, location: `${from} Central Terminal`, landmark: 'Bay 1' },
      ],
      droppingPoints: [
        { time: arrivalTime, location: `${to} Main Station`, landmark: 'Arrival Platform' },
      ],
      seats,
      driver: assignedDriver,
      status: 'ACTIVE',
    };

    buses.unshift(newBus);
    res.status(201).json({ success: true, message: 'Bus route created successfully', bus: newBus });
  });

  app.patch('/api/admin/buses/:id', (req, res) => {
    const index = buses.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    const { status, baseFare, departureTime, arrivalTime, driverId } = req.body;
    if (status) buses[index].status = status;
    if (baseFare) buses[index].baseFare = Number(baseFare);
    if (departureTime) buses[index].departureTime = departureTime;
    if (arrivalTime) buses[index].arrivalTime = arrivalTime;
    if (driverId) {
      const driver = drivers.find(d => d.id === driverId);
      if (driver) buses[index].driver = driver;
    }

    res.json({ success: true, message: 'Bus updated successfully', bus: buses[index] });
  });

  // Admin: Manage Drivers & Rosters
  app.get('/api/admin/drivers', (req, res) => {
    res.json({ success: true, drivers });
  });

  app.post('/api/admin/drivers', (req, res) => {
    const { name, phone, license, shift, status } = req.body;
    const newDriver: DriverInfo = {
      id: `DRV-${Math.floor(200 + Math.random() * 800)}`,
      name,
      phone,
      license,
      shift: shift || 'Night Express',
      status: status || 'On Duty',
      rating: 4.8,
    };
    drivers.push(newDriver);
    res.status(201).json({ success: true, message: 'Driver registered', driver: newDriver });
  });

  app.patch('/api/admin/drivers/:id', (req, res) => {
    const driver = drivers.find(d => d.id === req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    const { status, shift, phone } = req.body;
    if (status) driver.status = status;
    if (shift) driver.shift = shift;
    if (phone) driver.phone = phone;

    res.json({ success: true, message: 'Driver status updated', driver });
  });

  // Auth: Send OTP
  app.post('/api/auth/otp/send', (req, res) => {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Generate 6-digit OTP
    const cleanPhone = phone.trim();
    const otp = '482910'; // Deterministic test OTP for quick user access
    otpStore.set(cleanPhone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    res.json({
      success: true,
      message: `OTP sent to ${phone}`,
      demoOtp: otp, // Provided for user convenience in preview
    });
  });

  // Auth: Verify OTP
  app.post('/api/auth/otp/verify', (req, res) => {
    const { phone, otp, name } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP required' });
    }

    const record = otpStore.get(phone.trim());
    // Allow either the generated OTP or the standard test OTP '482910' or '123456'
    if (otp === '482910' || otp === '123456' || (record && record.otp === otp)) {
      const id = `USR-${Date.now().toString().slice(-6)}`;
      const user: UserSession = {
        id,
        uid: id,
        name: name || 'Indian Traveler',
        phone,
        authMethod: 'phone_otp',
        loggedInAt: new Date().toISOString(),
      };
      return res.json({
        success: true,
        message: 'Phone verified successfully',
        user,
      });
    }

    res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please use 482910.' });
  });

  // Auth: Google Login
  app.post('/api/auth/google', (req, res) => {
    const { email, name, avatar } = req.body;
    const id = `USR-GGL-${Date.now().toString().slice(-6)}`;
    const user: UserSession = {
      id,
      uid: id,
      name: name || 'Google Traveler',
      email: email || 'traveler@gmail.com',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      authMethod: 'google',
      loggedInAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Logged in with Google account',
      user,
    });
  });

  // --- VITE MIDDLEWARE / PRODUCTION SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BusGo Fullstack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
