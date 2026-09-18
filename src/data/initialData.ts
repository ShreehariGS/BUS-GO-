import { Bus, DriverInfo, Seat } from '../types';

export function generateSleeperSeats(basePrice: number): Seat[] {
  const seats: Seat[] = [];
  // Lower Deck: 18 berths (6 rows of single window + double berth, matching blueprint)
  const lowerConfigs = [
    { num: 'L1', pos: 'single-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2199 : basePrice + 100 },
    { num: 'L2', pos: 'double-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2199 : basePrice },
    { num: 'L3', pos: 'double-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2199 : basePrice },

    { num: 'L4', pos: 'single-berth' as const, status: 'female_reserved' as const, price: basePrice > 1500 ? 2199 : basePrice + 100 },
    { num: 'L5', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 2199 : basePrice },
    { num: 'L6', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 2199 : basePrice },

    { num: 'L7', pos: 'single-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2199 : basePrice + 100 },
    { num: 'L8', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 2199 : basePrice },
    { num: 'L9', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 2199 : basePrice },

    { num: 'L10', pos: 'single-berth' as const, status: 'female_reserved' as const, price: basePrice > 1500 ? 2199 : basePrice + 100 },
    { num: 'L11', pos: 'double-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2199 : basePrice },
    { num: 'L12', pos: 'double-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2199 : basePrice },

    { num: 'L13', pos: 'single-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2199 : basePrice + 100 },
    { num: 'L14', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 2199 : basePrice },
    { num: 'L15', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 2199 : basePrice },

    { num: 'L16', pos: 'single-berth' as const, status: 'female_reserved' as const, price: basePrice > 1500 ? 2199 : basePrice + 100 },
    { num: 'L17', pos: 'double-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2199 : basePrice },
    { num: 'L18', pos: 'double-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2199 : basePrice },
  ];

  lowerConfigs.forEach(item => {
    seats.push({
      id: item.num,
      number: item.num,
      deck: 'lower',
      type: 'sleeper',
      berthPosition: item.pos,
      status: item.status,
      price: item.price,
    });
  });

  // Upper Deck: 18 berths (6 rows of single window + double berth, matching blueprint)
  const upperConfigs = [
    { num: 'U1', pos: 'single-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2599 : basePrice + 50 },
    { num: 'U2', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },
    { num: 'U3', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },

    { num: 'U4', pos: 'single-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2599 : basePrice + 50 },
    { num: 'U5', pos: 'double-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },
    { num: 'U6', pos: 'double-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },

    { num: 'U7', pos: 'single-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2599 : basePrice + 50 },
    { num: 'U8', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },
    { num: 'U9', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },

    { num: 'U10', pos: 'single-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2599 : basePrice + 50 },
    { num: 'U11', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },
    { num: 'U12', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },

    { num: 'U13', pos: 'single-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 2599 : basePrice + 50 },
    { num: 'U14', pos: 'double-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },
    { num: 'U15', pos: 'double-berth' as const, status: 'booked' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },

    { num: 'U16', pos: 'single-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 2599 : basePrice + 50 },
    { num: 'U17', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },
    { num: 'U18', pos: 'double-berth' as const, status: 'available' as const, price: basePrice > 1500 ? 1999 : basePrice - 50 },
  ];

  upperConfigs.forEach(item => {
    seats.push({
      id: item.num,
      number: item.num,
      deck: 'upper',
      type: 'sleeper',
      berthPosition: item.pos,
      status: item.status,
      price: item.price,
    });
  });

  return seats;
}

export function generateSeaterSeats(basePrice: number): Seat[] {
  const seats: Seat[] = [];
  const rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const cols = ['A', 'B', 'C', 'D'];

  rows.forEach((r, rIdx) => {
    cols.forEach((c) => {
      const seatNum = `${r}${c}`;
      let status: Seat['status'] = 'available';
      if ((rIdx === 0 && (c === 'A' || c === 'B')) || (rIdx === 3 && c === 'D') || (rIdx === 7 && c === 'C')) {
        status = 'booked';
      } else if (rIdx === 1 && (c === 'A' || c === 'B')) {
        status = 'female_reserved';
      }

      seats.push({
        id: seatNum,
        number: seatNum,
        deck: 'single',
        type: 'seater',
        berthPosition: (c === 'A' || c === 'D') ? 'window' : 'aisle',
        status,
        price: (c === 'A' || c === 'D') ? basePrice + 50 : basePrice,
      });
    });
  });

  return seats;
}

export const INITIAL_DRIVERS: DriverInfo[] = [
  {
    id: 'DRV-101',
    name: 'Rajeshwar Gowda',
    phone: '+91 98451 22891',
    license: 'KA04-20120008472',
    shift: 'Night Express',
    status: 'On Duty',
    rating: 4.8,
  },
  {
    id: 'DRV-102',
    name: 'Mohd. Khaleel Pasha',
    phone: '+91 99882 33419',
    license: 'TS09-20150019284',
    shift: 'Night Express',
    status: 'On Duty',
    rating: 4.9,
  },
  {
    id: 'DRV-103',
    name: 'Srinivasa Rao',
    phone: '+91 97034 55102',
    license: 'AP16-20140023419',
    shift: 'Evening',
    status: 'En Route',
    rating: 4.7,
  },
  {
    id: 'DRV-104',
    name: 'Ganesh Shinde',
    phone: '+91 98231 44589',
    license: 'MH12-20130098214',
    shift: 'Night Express',
    status: 'On Duty',
    rating: 4.85,
  },
  {
    id: 'DRV-105',
    name: 'Vikramjit Singh',
    phone: '+91 98140 77192',
    license: 'DL01-20160041289',
    shift: 'Night Express',
    status: 'On Duty',
    rating: 4.92,
  },
  {
    id: 'DRV-106',
    name: 'Senthil Murugan',
    phone: '+91 94432 11983',
    license: 'TN07-20110034182',
    shift: 'Evening',
    status: 'Resting',
    rating: 4.75,
  },
  {
    id: 'DRV-107',
    name: 'Pradeep Nair',
    phone: '+91 94471 88204',
    license: 'KL01-20170065190',
    shift: 'Morning',
    status: 'On Duty',
    rating: 4.88,
  },
];

export const INITIAL_BUSES: Bus[] = [
  {
    id: 'BUS-KA-01',
    busNumber: 'KA-01-F-9412',
    operatorName: 'KSRTC Airavat Club Class Multi-Axle',
    operatorType: 'RTC',
    stateRTC: 'KSRTC',
    route: {
      from: 'Bengaluru',
      to: 'Hyderabad',
      distanceKm: 570,
    },
    departureTime: '21:30',
    arrivalTime: '06:00',
    duration: '8h 30m',
    busType: 'AC Sleeper 2+1',
    baseFare: 1150,
    rating: 4.8,
    reviewsCount: 1420,
    amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Live GPS Tracking', 'Emergency SOS'],
    boardingPoints: [
      { time: '21:30', location: 'Majestic KBS Terminal 3', landmark: 'Platform 18' },
      { time: '22:00', location: 'Hebbal Flyover', landmark: 'Near Esteem Mall' },
      { time: '22:30', location: 'Kempegowda Int. Airport Toll', landmark: 'Airport Trumpet' },
    ],
    droppingPoints: [
      { time: '05:30', location: 'Shamshabad Bus Stop', landmark: 'Near Rajiv Gandhi Airport Exit' },
      { time: '05:45', location: 'Aramghar Junction', landmark: 'Flyover Pillar 140' },
      { time: '06:00', location: 'MGBS Bus Stand', landmark: 'Terminal 1 Hyderabad' },
    ],
    seats: generateSleeperSeats(1150),
    driver: INITIAL_DRIVERS[0],
    status: 'ACTIVE',
  },
  {
    id: 'BUS-TS-02',
    busNumber: 'TS-09-Z-4821',
    operatorName: 'TSRTC Garuda Plus AC Luxury',
    operatorType: 'RTC',
    stateRTC: 'TSRTC',
    route: {
      from: 'Hyderabad',
      to: 'Bengaluru',
      distanceKm: 570,
    },
    departureTime: '22:00',
    arrivalTime: '06:30',
    duration: '8h 30m',
    busType: 'Volvo Multi-Axle Semi-Sleeper',
    baseFare: 980,
    rating: 4.7,
    reviewsCount: 980,
    amenities: ['Air Suspension', 'Charging Point', 'Water Bottle', 'Reading Lamp', 'Live GPS Tracking'],
    boardingPoints: [
      { time: '22:00', location: 'MGBS Terminal', landmark: 'Bay 24' },
      { time: '22:30', location: 'Gachibowli Outer Ring Road', landmark: 'Near ORR Entrance' },
    ],
    droppingPoints: [
      { time: '06:00', location: 'Hebbal Esteem Mall', landmark: 'Main Gate' },
      { time: '06:30', location: 'Majestic KBS', landmark: 'Platform 1' },
    ],
    seats: generateSeaterSeats(980),
    driver: INITIAL_DRIVERS[1],
    status: 'ACTIVE',
  },
  {
    id: 'BUS-AP-03',
    busNumber: 'AP-16-TX-3310',
    operatorName: 'APSRTC Amaravathi Multi-Axle Scania',
    operatorType: 'RTC',
    stateRTC: 'APSRTC',
    route: {
      from: 'Vijayawada',
      to: 'Hyderabad',
      distanceKm: 275,
    },
    departureTime: '17:30',
    arrivalTime: '22:15',
    duration: '4h 45m',
    busType: 'Volvo Multi-Axle Semi-Sleeper',
    baseFare: 650,
    rating: 4.65,
    reviewsCount: 1120,
    amenities: ['Snacks Box', 'Water Bottle', 'Charging Point', 'CCTV Surveillance'],
    boardingPoints: [
      { time: '17:30', location: 'PNBS Vijayawada Bus Stand', landmark: 'Terminal A' },
      { time: '17:50', location: 'Benz Circle', landmark: 'Near Joyalukkas' },
    ],
    droppingPoints: [
      { time: '21:45', location: 'LB Nagar Ring Road', landmark: 'Metro Pillar 42' },
      { time: '22:15', location: 'MGBS Hyderabad', landmark: 'Arrival Bay 6' },
    ],
    seats: generateSeaterSeats(650),
    driver: INITIAL_DRIVERS[2],
    status: 'ACTIVE',
  },
  {
    id: 'BUS-PV-04',
    busNumber: 'DL-01-EQ-7789',
    operatorName: 'Zingbus Electric Max AC Sleeper',
    operatorType: 'PRIVATE',
    route: {
      from: 'Delhi',
      to: 'Jaipur',
      distanceKm: 280,
    },
    departureTime: '07:30',
    arrivalTime: '12:30',
    duration: '5h 00m',
    busType: 'Electric AC Sleeper',
    baseFare: 749,
    rating: 4.9,
    reviewsCount: 2310,
    amenities: ['Zero Emission EV', 'Free WiFi 5G', 'Pre-Cleaned Blankets', 'Snacks & Water', 'Live Lounge Access'],
    boardingPoints: [
      { time: '07:30', location: 'Kashmiri Gate Zingbus Lounge', landmark: 'Gate 2' },
      { time: '08:15', location: 'Dhaula Kuan Metro Station', landmark: 'Bus Stop' },
      { time: '08:50', location: 'IFFCO Chowk Gurugram', landmark: 'Flyover Service Lane' },
    ],
    droppingPoints: [
      { time: '12:00', location: 'Sindhi Camp Jaipur', landmark: 'Platform 4' },
      { time: '12:30', location: 'Narayan Singh Circle', landmark: 'Zingbus Station' },
    ],
    seats: generateSleeperSeats(749),
    driver: INITIAL_DRIVERS[4],
    status: 'ACTIVE',
  },
  {
    id: 'BUS-MH-05',
    busNumber: 'MH-12-RN-8822',
    operatorName: 'MSRTC Shivneri AC Volvo',
    operatorType: 'RTC',
    stateRTC: 'MSRTC',
    route: {
      from: 'Pune',
      to: 'Mumbai',
      distanceKm: 150,
    },
    departureTime: '14:00',
    arrivalTime: '17:30',
    duration: '3h 30m',
    busType: 'Volvo Multi-Axle Semi-Sleeper',
    baseFare: 520,
    rating: 4.75,
    reviewsCount: 3410,
    amenities: ['Express Toll Access', 'Air Conditioning', 'Newspaper & Water', 'Reclining Seats'],
    boardingPoints: [
      { time: '14:00', location: 'Swargate MSRTC Bus Station', landmark: 'Platform 3' },
      { time: '14:30', location: 'Wakad Express Highway', landmark: 'Ginger Hotel Junction' },
    ],
    droppingPoints: [
      { time: '17:00', location: 'Vashi Plaza Navi Mumbai', landmark: 'Highway Bridge' },
      { time: '17:30', location: 'Dadar Asiad Bus Stand', landmark: 'Near Railway Station' },
    ],
    seats: generateSeaterSeats(520),
    driver: INITIAL_DRIVERS[3],
    status: 'ACTIVE',
  },
  {
    id: 'BUS-PV-06',
    busNumber: 'KA-51-AB-1904',
    operatorName: 'IntrCity SmartBus Premium Suite',
    operatorType: 'PRIVATE',
    route: {
      from: 'Bengaluru',
      to: 'Chennai',
      distanceKm: 345,
    },
    departureTime: '23:00',
    arrivalTime: '05:30',
    duration: '6h 30m',
    busType: 'AC Sleeper 2+1',
    baseFare: 999,
    rating: 4.88,
    reviewsCount: 1890,
    amenities: ['SmartBus Captain Onboard', 'Private Cabins', 'Sanitized Linen', 'Mineral Water', 'SOS Button'],
    boardingPoints: [
      { time: '23:00', location: 'Madiwala IntrCity Lounge', landmark: 'Near Total Mall' },
      { time: '23:30', location: 'Electronic City Toll Gate', landmark: 'Phase 1 Elevated Expressway' },
    ],
    droppingPoints: [
      { time: '05:00', location: 'Koyambedu CMBT', landmark: 'Omni Bus Stand Gate 3' },
      { time: '05:30', location: 'Guindy Race Course', landmark: 'Metro Station' },
    ],
    seats: generateSleeperSeats(999),
    driver: INITIAL_DRIVERS[5],
    status: 'ACTIVE',
  },
  {
    id: 'BUS-KL-07',
    busNumber: 'KL-15-A-5612',
    operatorName: 'Kerala RTC SWIFT Gajaraj Hybrid Sleeper',
    operatorType: 'RTC',
    stateRTC: 'Kerala RTC',
    route: {
      from: 'Bengaluru',
      to: 'Kochi',
      distanceKm: 540,
    },
    departureTime: '20:15',
    arrivalTime: '06:15',
    duration: '10h 00m',
    busType: 'AC Sleeper 2+1',
    baseFare: 1280,
    rating: 4.82,
    reviewsCount: 1650,
    amenities: ['SWIFT GPS', 'Air Suspended Sleeper', 'USB Port', 'Blankets', 'Emergency First Aid'],
    boardingPoints: [
      { time: '20:15', location: 'Shanthinagar KSRTC TTMC', landmark: 'Bay 5' },
      { time: '21:00', location: 'Bommasandra K-SWIFT Stop', landmark: 'Near Narayana Hrudayalaya' },
    ],
    droppingPoints: [
      { time: '05:45', location: 'Aluva Flyover Metro Station', landmark: 'Bridge End' },
      { time: '06:15', location: 'Vyttila Mobility Hub', landmark: 'KSRTC SWIFT Bay' },
    ],
    seats: generateSleeperSeats(1280),
    driver: INITIAL_DRIVERS[6],
    status: 'ACTIVE',
  },
  {
    id: 'BUS-PV-08',
    busNumber: 'KA-25-D-7210',
    operatorName: 'VRL Travels I-Shift Volvo Multi-Axle',
    operatorType: 'PRIVATE',
    route: {
      from: 'Bengaluru',
      to: 'Goa',
      distanceKm: 560,
    },
    departureTime: '19:45',
    arrivalTime: '06:45',
    duration: '11h 00m',
    busType: 'AC Sleeper 2+1',
    baseFare: 1450,
    rating: 4.78,
    reviewsCount: 2840,
    amenities: ['Individual TV Screen', 'Reading Light', 'Charging Plug', 'Pillow & Fleece Blanket', 'Live Tracking'],
    boardingPoints: [
      { time: '19:45', location: 'Anand Rao Circle VRL Terminal', landmark: 'Near Race Course' },
      { time: '20:30', location: 'Yeshwantpur Govardhan Theatre', landmark: 'VRL Branch Office' },
    ],
    droppingPoints: [
      { time: '06:00', location: 'Madgaon KTC Bus Stand', landmark: 'Main Gate' },
      { time: '06:45', location: 'Panaji Kadamba Bus Terminal', landmark: 'Bay 4' },
    ],
    seats: generateSleeperSeats(1450),
    driver: INITIAL_DRIVERS[0],
    status: 'ACTIVE',
  },
  {
    id: 'BUS-SST-09',
    busNumber: 'TN-38-BZ-4401',
    operatorName: 'SST Limoliner Luxury Sleeper',
    operatorType: 'PRIVATE',
    route: {
      from: 'Bengaluru',
      to: 'Coimbatore',
      distanceKm: 360,
    },
    departureTime: '23:00',
    arrivalTime: '05:15',
    duration: '6h 15m',
    busType: 'AC Sleeper 2+1',
    baseFare: 1999,
    rating: 4.7,
    reviewsCount: 585,
    amenities: ['Private Capsule Berth', 'Charging Socket', 'WiFi 5G', 'Mineral Water Bottle', 'Sanitized Duvet & Pillow', 'Live GPS Tracking'],
    boardingPoints: [
      { time: '23:00', location: 'Madiwala SST Lounge', landmark: 'Near Police Station & Petrol Bunk' },
      { time: '23:30', location: 'Electronic City Toll Plaza', landmark: 'Elevated Highway Pillar 45' },
      { time: '23:55', location: 'Attibele Toll Gate', landmark: 'Border Checkpost' },
    ],
    droppingPoints: [
      { time: '04:45', location: 'Gandhipuram Omni Bus Stand', landmark: 'Platform 3' },
      { time: '05:15', location: 'KMCH / Hope College', landmark: 'Avinashi Road' },
    ],
    seats: generateSleeperSeats(1999),
    driver: INITIAL_DRIVERS[5],
    status: 'ACTIVE',
  }
];

export const POPULAR_INDIAN_CITIES = [
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Mumbai',
  'Pune',
  'Delhi',
  'Jaipur',
  'Vijayawada',
  'Kochi',
  'Goa',
  'Ahmedabad',
  'Tirupati',
  'Visakhapatnam',
  'Coimbatore',
  'Madurai',
  'Nagpur',
  'Mysuru',
  'Chandigarh',
  'Lucknow',
];
