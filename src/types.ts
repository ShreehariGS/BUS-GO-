export type OperatorType = 'RTC' | 'PRIVATE';

export type StateRTC = 
  | 'KSRTC' 
  | 'TSRTC' 
  | 'APSRTC' 
  | 'MSRTC' 
  | 'Kerala RTC' 
  | 'UPSRTC' 
  | 'RSRTC' 
  | 'HRTC';

export type BusLayoutType = 
  | 'AC Sleeper 2+1' 
  | 'Volvo Multi-Axle Semi-Sleeper' 
  | 'Electric AC Sleeper' 
  | 'Non-AC Seater' 
  | 'Super Luxury RTC Airavat';

export type SeatStatus = 'available' | 'booked' | 'female_reserved' | 'selected';

export type DeckType = 'lower' | 'upper' | 'single';

export type SeatType = 'sleeper' | 'seater' | 'semi-sleeper';

export interface Seat {
  id: string;
  number: string;
  deck: DeckType;
  type: SeatType;
  berthPosition: 'window' | 'aisle' | 'single-berth' | 'double-berth';
  status: SeatStatus;
  price: number;
}

export interface BoardingPoint {
  time: string;
  location: string;
  landmark: string;
}

export interface DroppingPoint {
  time: string;
  location: string;
  landmark: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  license: string;
  shift: 'Morning' | 'Evening' | 'Night Express';
  status: 'On Duty' | 'Resting' | 'En Route';
  rating: number;
}

export interface Bus {
  id: string;
  busNumber: string;
  operatorName: string;
  operatorType: OperatorType;
  stateRTC?: StateRTC;
  route: {
    from: string;
    to: string;
    distanceKm: number;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  busType: BusLayoutType;
  baseFare: number;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  boardingPoints: BoardingPoint[];
  droppingPoints: DroppingPoint[];
  seats: Seat[];
  driver: DriverInfo;
  status: 'ACTIVE' | 'DELAYED' | 'MAINTENANCE' | 'COMPLETED';
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seatNumber: string;
  seatType: string;
  fare: number;
}

export interface FareBreakdown {
  baseFareTotal: number;
  gst: number;
  insurance: number;
  discount: number;
  totalAmount: number;
}

export type PaymentMethod = 'UPI' | 'CARD' | 'WALLET' | 'NETBANKING';

export interface PaymentDetails {
  method: PaymentMethod;
  transactionId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  paidAt: string;
  upiId?: string;
  cardLast4?: string;
  walletProvider?: string;
}

export interface Booking {
  id: string;
  userId?: string;
  pnr: string;
  busId: string;
  busNumber: string;
  operatorName: string;
  operatorType: OperatorType;
  route: {
    from: string;
    to: string;
  };
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  boardingPoint: BoardingPoint;
  droppingPoint: DroppingPoint;
  passengers: Passenger[];
  contact: {
    email: string;
    phone: string;
  };
  payment: PaymentDetails;
  fareBreakdown: FareBreakdown;
  driver: {
    name: string;
    phone: string;
    license: string;
    busNumber: string;
  };
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  bookedAt: string;
  createdAt?: string;
}

export interface UserSession {
  id?: string;
  uid: string;
  name: string;
  phone?: string;
  email?: string;
  role?: 'passenger' | 'admin';
  authMethod?: 'phone_otp' | 'google' | 'email';
  avatar?: string;
  loggedInAt?: string;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalBookings: number;
  activeBusesCount: number;
  averageOccupancyPercentage: number;
  rtcSharePercentage: number;
  privateSharePercentage: number;
  topRoutes: {
    route: string;
    bookingsCount: number;
    revenue: number;
  }[];
  recentBookings: Booking[];
}
