import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, User, Inquiry, FilterState, Language, UserRole, ListingStatus, InquiryStatus } from '../types';
import { INITIAL_PROPERTIES } from '../data/mockProperties';
import { DEMO_USERS, INITIAL_INQUIRIES } from '../data/mockUsers';

export type PageType = 
  | 'home' 
  | 'browse' 
  | 'property-details' 
  | 'auth' 
  | 'tenant-dashboard' 
  | 'owner-dashboard'
  | 'about';

interface AppContextType {
  user: User | null;
  currentPage: PageType;
  selectedPropertyId: string | null;
  properties: Property[];
  favorites: string[];
  inquiries: Inquiry[];
  language: Language;
  filters: FilterState;
  authMode: 'signin' | 'signup';
  authRoleIntent: UserRole;
  activeTenantTab: string;
  activeOwnerTab: string;
  
  // Navigation & Actions
  navigateTo: (page: PageType, propertyId?: string | null, filterOverrides?: Partial<FilterState>) => void;
  setAuthMode: (mode: 'signin' | 'signup', roleIntent?: UserRole) => void;
  setActiveTenantTab: (tab: string) => void;
  setActiveOwnerTab: (tab: string) => void;
  
  // Favorites
  toggleFavorite: (propertyId: string) => void;
  isFavorited: (propertyId: string) => boolean;
  
  // Property management (Owner / Agency)
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'viewsCount' | 'inquiriesCount'>) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  togglePropertyStatus: (id: string, newStatus: ListingStatus) => void;
  
  // Inquiries
  submitInquiry: (data: { propertyId: string; message: string; moveInDate?: string; name: string; phone: string; email: string }) => boolean;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  
  // Auth
  login: (user: User) => void;
  loginAsDemo: (role: 'tenant' | 'owner' | 'agency') => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  // Filters & Lang
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  setLanguage: (lang: Language) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  wilaya: 'all',
  city: 'all',
  propertyType: 'all',
  minPrice: 0,
  maxPrice: 200000,
  rooms: 'all',
  isFurnished: null,
  isStudentFriendly: null,
  isAvailableNow: null,
  sortBy: 'newest'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Page state: Starts strictly on 'home'
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>('kri-001');
  const [authMode, setAuthModeState] = useState<'signin' | 'signup'>('signin');
  const [authRoleIntent, setAuthRoleIntent] = useState<UserRole>('tenant');
  const [activeTenantTab, setActiveTenantTab] = useState<string>('overview');
  const [activeOwnerTab, setActiveOwnerTab] = useState<string>('overview');
  const [language, setLanguageState] = useState<Language>('fr');

  // Filter state
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // User state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('kridz_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Properties state
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('kridz_properties');
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kridz_favorites');
      return saved ? JSON.parse(saved) : ['kri-002', 'kri-003'];
    } catch {
      return ['kri-002', 'kri-003'];
    }
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem('kridz_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('kridz_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('kridz_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('kridz_properties', JSON.stringify(properties));
    } catch (e) {
      console.error(e);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem('kridz_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('kridz_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries]);

  // Handle RTL for Arabic
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const navigateTo = (page: PageType, propertyId: string | null = null, filterOverrides?: Partial<FilterState>) => {
    if (propertyId) {
      setSelectedPropertyId(propertyId);
      // Increment views count on property
      setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, viewsCount: p.viewsCount + 1 } : p));
    }
    if (filterOverrides) {
      setFilters(prev => ({ ...prev, ...filterOverrides }));
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setAuthMode = (mode: 'signin' | 'signup', roleIntent: UserRole = 'tenant') => {
    setAuthModeState(mode);
    setAuthRoleIntent(roleIntent);
    setCurrentPage('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const isFavorited = (propertyId: string) => favorites.includes(propertyId);

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'viewsCount' | 'inquiriesCount'>): Property => {
    const newProperty: Property = {
      ...propertyData,
      id: `kri-${Date.now()}`,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      inquiriesCount: 0
    };
    setProperties(prev => [newProperty, ...prev]);
    return newProperty;
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  const togglePropertyStatus = (id: string, newStatus: ListingStatus) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const submitInquiry = (data: { propertyId: string; message: string; moveInDate?: string; name: string; phone: string; email: string }) => {
    const targetProp = properties.find(p => p.id === data.propertyId);
    if (!targetProp) return false;

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      propertyId: targetProp.id,
      propertyTitle: targetProp.title,
      propertyPriceDZD: targetProp.pricePerMonthDZD,
      propertyCity: `${targetProp.city} (${targetProp.wilayaName})`,
      propertyImage: targetProp.images[0] || '',
      tenantId: user?.id || 'guest-user',
      tenantName: data.name,
      tenantEmail: data.email,
      tenantPhone: data.phone,
      ownerId: targetProp.ownerId,
      ownerName: targetProp.ownerName,
      message: data.message,
      moveInDate: data.moveInDate,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setInquiries(prev => [newInquiry, ...prev]);

    // increment inquiriesCount on property
    setProperties(prev => prev.map(p => p.id === targetProp.id ? { ...p, inquiriesCount: p.inquiriesCount + 1 } : p));
    return true;
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const login = (userData: User) => {
    setUser(userData);
    if (userData.role === 'tenant') {
      setCurrentPage('tenant-dashboard');
    } else {
      setCurrentPage('owner-dashboard');
    }
  };

  const loginAsDemo = (role: 'tenant' | 'owner' | 'agency') => {
    const demoUser = DEMO_USERS[role];
    if (demoUser) {
      setUser(demoUser);
      if (role === 'tenant') {
        setCurrentPage('tenant-dashboard');
      } else {
        setCurrentPage('owner-dashboard');
      }
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentPage,
        selectedPropertyId,
        properties,
        favorites,
        inquiries,
        language,
        filters,
        authMode,
        authRoleIntent,
        activeTenantTab,
        activeOwnerTab,
        navigateTo,
        setAuthMode,
        setActiveTenantTab,
        setActiveOwnerTab,
        toggleFavorite,
        isFavorited,
        addProperty,
        updateProperty,
        deleteProperty,
        togglePropertyStatus,
        submitInquiry,
        updateInquiryStatus,
        login,
        loginAsDemo,
        logout,
        updateUserProfile,
        setFilters,
        updateFilter,
        resetFilters,
        setLanguage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
