export type PropertyType = 'apartment' | 'villa' | 'studio' | 'student' | 'duplex';

export type UserRole = 'tenant' | 'owner' | 'agency';

export type ListingStatus = 'active' | 'rented' | 'paused';

export type InquiryStatus = 'pending' | 'replied' | 'visit_scheduled' | 'closed';

export type Language = 'fr' | 'ar' | 'en';

export interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  city: string;
  wilayaCode: string; // e.g. '16' for Alger, '09' for Blida, '31' for Oran, '02' for Chlef
  wilayaName: string;
  neighborhood: string;
  address?: string;
  pricePerMonthDZD: number;
  depositDZD?: number;
  paymentFrequency?: 'monthly' | 'quarterly' | 'semiannual' | 'annual';
  surfaceM2: number;
  rooms: number; // e.g. F1, F2, F3, F4, F5
  bathrooms: number;
  floor?: number | null; // null if ground floor or villa
  isFurnished: boolean;
  isStudentFriendly: boolean;
  isFeatured?: boolean;
  isAvailable: boolean;
  status: ListingStatus;
  availabilityDate: string;
  amenities: string[];
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp?: string;
  ownerType: 'individual' | 'agency';
  ownerVerified: boolean;
  agencyName?: string;
  viewsCount: number;
  inquiriesCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  agencyName?: string;
  agencyLogo?: string;
  agencyRegisterNumber?: string;
  preferredCity?: string;
  budgetMinDZD?: number;
  budgetMaxDZD?: number;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPriceDZD: number;
  propertyCity: string;
  propertyImage: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  ownerId: string;
  ownerName: string;
  message: string;
  moveInDate?: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  wilaya: string;
  city: string;
  propertyType: string; // 'all' or PropertyType
  minPrice: number;
  maxPrice: number;
  rooms: string; // 'all', '1', '2', '3', '4', '5+'
  isFurnished: boolean | null; // null = any
  isStudentFriendly: boolean | null;
  isAvailableNow: boolean | null;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'surface_desc';
}

export interface AlgerianWilaya {
  code: string;
  name: string;
  arName: string;
  popularCities: string[];
  image: string;
}
