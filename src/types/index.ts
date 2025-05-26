
export type Department = "Marketing" | "Sales" | "Engineering" | "HR" | "Finance" | "Operations" | "Customer Service" | "Product" | "Legal" | "Design";

export const departments: Department[] = ["Marketing", "Sales", "Engineering", "HR", "Finance", "Operations", "Customer Service", "Product", "Legal", "Design"];

export interface PastPerformance {
  id: string;
  date: string;
  rating: number; // 1-5
  comments: string;
}

export interface Project {
  id: string;
  name: string;
  status: "Completed" | "In Progress" | "On Hold" | "Cancelled";
  description: string;
  startDate: string;
  endDate?: string;
}

export interface Feedback {
  id: string;
  date: string;
  from: string; // Can be another employee's name or "Manager"
  comment: string;
  type: "Positive" | "Constructive" | "Neutral";
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  image: string; // URL to avatar
  username: string; // from dummyjson
  company: {
    department: Department;
    title: string;
    name: string; // Company name
  };
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  // Custom fields
  performanceRating: number; // 1-5
  bio?: string;
  yearsOfExperience?: number;
  skills?: string[];
  pastPerformance?: PastPerformance[];
  projects?: Project[];
  feedback?: Feedback[];
}

export interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  domain: string;
  ip: string;
  address: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    postalCode: string;
    state: string;
    country: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    address: {
      address: string;
      city: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      postalCode: string;
      state: string;
      country: string;
    };
    department: string;
    name: string;
    title: string;
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
}

// For chart data
export interface DepartmentAverageRating {
  department: Department;
  averageRating: number;
}

export interface BookmarkTrend {
  month: string;
  bookmarks: number;
}
