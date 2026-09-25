import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, User, Inquiry, FilterState, Language, UserRole, ListingStatus, InquiryStatus, RecentSearch } from '../types';
import { INITIAL_PROPERTIES } from '../data/mockProperties';
import { DEMO_USERS, INITIAL_INQUIRIES } from '../data/mockUsers';
import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from '../lib/firebase';

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
  isCloudConnected: boolean;
  
  // Navigation & Actions
  navigateTo: (page: PageType, propertyId?: string | null, filterOverrides?: Partial<FilterState>) => void;
  setAuthMode: (mode: 'signin' | 'signup', roleIntent?: UserRole) => void;
  setActiveTenantTab: (tab: string) => void;
  setActiveOwnerTab: (tab: string) => void;
  
  // Favorites
  toggleFavorite: (propertyId: string) => Promise<void>;
  isFavorited: (propertyId: string) => boolean;
  
  // Toast notifications
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: () => void;
  
  // Property management (Owner / Agency)
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'viewsCount' | 'inquiriesCount'>) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  togglePropertyStatus: (id: string, newStatus: ListingStatus) => Promise<void>;
  
  // Inquiries
  submitInquiry: (data: { propertyId: string; message: string; moveInDate?: string; name: string; phone: string; email: string }) => Promise<boolean>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => Promise<void>;
  
  // Auth
  login: (user: User) => void;
  signUpWithFirebase: (data: { name: string; email: string; password: string; phone?: string; role: UserRole; agencyName?: string }) => Promise<{ success: boolean; error?: string }>;
  signInWithFirebase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: 'tenant' | 'owner' | 'agency') => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  
  // Filters & Lang
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  setLanguage: (lang: Language) => void;

  // Recent Searches
  recentSearches: RecentSearch[];
  addRecentSearch: (search: { label?: string; details?: string; filters: Partial<FilterState> }) => void;
  removeRecentSearch: (id: string) => void;
  clearRecentSearches: () => void;
}

export const formatSearchDescription = (filters: Partial<FilterState>): { label: string; details?: string } => {
  if (filters.searchQuery && filters.searchQuery.trim()) {
    return {
      label: `"${filters.searchQuery.trim()}"`,
      details: filters.wilaya && filters.wilaya !== 'all' ? `Wilaya de ${filters.wilaya}` : 'Recherche par mot-clé'
    };
  }

  let typeLabel = 'Biens immobiliers';
  if (filters.propertyType === 'apartment') typeLabel = 'Appartements';
  else if (filters.propertyType === 'villa') typeLabel = 'Villas & Maisons';
  else if (filters.propertyType === 'studio') typeLabel = 'Studios';
  else if (filters.propertyType === 'duplex') typeLabel = 'Duplex';
  else if (filters.propertyType === 'student') typeLabel = 'Logements Étudiants';

  let location = '';
  if (filters.city && filters.city !== 'all') {
    location = `${filters.city}${filters.wilaya && filters.wilaya !== 'all' ? ` (${filters.wilaya})` : ''}`;
  } else if (filters.wilaya && filters.wilaya !== 'all') {
    location = filters.wilaya;
  }

  const label = location ? `${typeLabel} à ${location}` : typeLabel;

  const detailParts: string[] = [];
  if (filters.rooms && filters.rooms !== 'all') {
    detailParts.push(filters.rooms === '5+' ? '5 pièces ou +' : `F${filters.rooms}`);
  }
  if (filters.minPrice && filters.minPrice > 0 && filters.maxPrice && filters.maxPrice < 300000) {
    detailParts.push(`${Math.round(filters.minPrice / 1000)}k - ${Math.round(filters.maxPrice / 1000)}k DA`);
  } else if (filters.maxPrice && filters.maxPrice < 300000) {
    detailParts.push(`< ${filters.maxPrice.toLocaleString('fr-DZ')} DA`);
  } else if (filters.minPrice && filters.minPrice > 0) {
    detailParts.push(`> ${filters.minPrice.toLocaleString('fr-DZ')} DA`);
  }
  if (filters.isFurnished === true) {
    detailParts.push('Meublé');
  }
  if (filters.isStudentFriendly === true) {
    detailParts.push('Étudiant');
  }

  return {
    label,
    details: detailParts.length > 0 ? detailParts.join(' · ') : undefined
  };
};

const DEFAULT_RECENT_SEARCHES: RecentSearch[] = [
  {
    id: 'search-seed-1',
    label: 'Appartements à Alger',
    details: 'Hydra & Alger-Centre · F3',
    filters: {
      wilaya: 'Alger',
      city: 'Hydra',
      propertyType: 'apartment',
      rooms: '3'
    },
    timestamp: Date.now() - 1000 * 60 * 35
  },
  {
    id: 'search-seed-2',
    label: 'Studios étudiants · Bab Ezzouar',
    details: 'Proche USTHB · < 35 000 DA',
    filters: {
      wilaya: 'Alger',
      city: 'Bab Ezzouar',
      propertyType: 'studio',
      maxPrice: 35000,
      isStudentFriendly: true
    },
    timestamp: Date.now() - 1000 * 60 * 180
  },
  {
    id: 'search-seed-3',
    label: 'Villas & Maisons à Oran',
    details: 'Canastel & Akid Lotfi',
    filters: {
      wilaya: 'Oran',
      city: 'Canastel',
      propertyType: 'villa'
    },
    timestamp: Date.now() - 1000 * 60 * 720
  }
];

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  wilaya: 'all',
  city: 'all',
  propertyType: 'all',
  minPrice: 0,
  maxPrice: 300000,
  rooms: 'all',
  isFurnished: null,
  isStudentFriendly: null,
  isAvailableNow: null,
  sortBy: 'newest'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Page state: Starts on 'home'
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>('kri-001');
  const [authMode, setAuthModeState] = useState<'signin' | 'signup'>('signin');
  const [authRoleIntent, setAuthRoleIntent] = useState<UserRole>('tenant');
  const [activeTenantTab, setActiveTenantTab] = useState<string>('overview');
  const [activeOwnerTab, setActiveOwnerTab] = useState<string>('overview');
  const [language, setLanguageState] = useState<Language>('fr');
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

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

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  const dismissToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 1. Firebase Auth listener & Firestore User Profile fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setIsCloudConnected(true);
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data() as User;
            setUser(data);
            if (data.favorites && Array.isArray(data.favorites)) {
              setFavorites(prev => Array.from(new Set([...prev, ...data.favorites!])));
            }
          } else {
            // New user doc template
            const newUser: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Utilisateur KriDZ',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '+213 550 00 00 00',
              role: 'tenant',
              preferredCity: 'Alger',
              favorites: favorites.length > 0 ? favorites : ['kri-002', 'kri-003'],
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          }
        } catch (err) {
          console.error('Error fetching Firestore user profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 1b. Real-time Firestore Favorites sync for current user
  useEffect(() => {
    const activeUserId = user?.id;
    if (!activeUserId) return;

    const userDocRef = doc(db, 'users', activeUserId);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
          try {
            localStorage.setItem('kridz_favorites', JSON.stringify(data.favorites));
          } catch (e) {
            console.error(e);
          }
        }
      }
    }, (err) => {
      console.warn('Firestore favorites sync note:', err);
    });

    return () => unsubscribe();
  }, [user?.id]);

  // 2. Firestore Properties Real-time Listener & Auto-Seed
  useEffect(() => {
    const propsCol = collection(db, 'properties');
    const unsubscribe = onSnapshot(propsCol, async (snapshot) => {
      setIsCloudConnected(true);
      if (snapshot.empty) {
        // Auto-seed initial Algerian properties so cloud database is pre-populated
        try {
          const batch = writeBatch(db);
          INITIAL_PROPERTIES.forEach(p => {
            const docRef = doc(db, 'properties', p.id);
            batch.set(docRef, p);
          });
          await batch.commit();
        } catch (seedErr) {
          console.warn('Auto-seed properties note (fallback to local data):', seedErr);
        }
      } else {
        const loadedProps: Property[] = [];
        snapshot.forEach(docSnap => {
          loadedProps.push({ ...docSnap.data(), id: docSnap.id } as Property);
        });
        // Sort newest first
        loadedProps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProperties(loadedProps);
      }
    }, (error) => {
      console.warn('Firestore properties snapshot note (using local cache):', error);
    });

    return () => unsubscribe();
  }, []);

  // 3. Firestore Inquiries Real-time Listener
  useEffect(() => {
    const inqCol = collection(db, 'inquiries');
    const unsubscribe = onSnapshot(inqCol, (snapshot) => {
      if (!snapshot.empty) {
        const loadedInquiries: Inquiry[] = [];
        snapshot.forEach(docSnap => {
          loadedInquiries.push({ ...docSnap.data(), id: docSnap.id } as Inquiry);
        });
        loadedInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInquiries(loadedInquiries);
      }
    }, (err) => {
      console.warn('Firestore inquiries note:', err);
    });

    return () => unsubscribe();
  }, []);

  // Local storage caching for offline resilience
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

  // Recent Searches state with local storage persistence
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    try {
      const saved = localStorage.getItem('kridz_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_RECENT_SEARCHES;
    } catch {
      return DEFAULT_RECENT_SEARCHES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kridz_recent_searches', JSON.stringify(recentSearches));
    } catch (e) {
      console.error(e);
    }
  }, [recentSearches]);

  const addRecentSearch = (searchData: { label?: string; details?: string; filters: Partial<FilterState> }) => {
    const desc = !searchData.label ? formatSearchDescription(searchData.filters) : { label: searchData.label, details: searchData.details };
    const label = searchData.label || desc.label;
    const details = searchData.details !== undefined ? searchData.details : desc.details;

    if (!label || label === 'Biens immobiliers') return;

    setRecentSearches(prev => {
      const remaining = prev.filter(item => item.label.toLowerCase() !== label.toLowerCase());
      const newItem: RecentSearch = {
        id: `search-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        label,
        details,
        filters: searchData.filters,
        timestamp: Date.now()
      };
      return [newItem, ...remaining].slice(0, 8);
    });
  };

  const removeRecentSearch = (id: string) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

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
      setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p));
      try {
        const propRef = doc(db, 'properties', propertyId);
        const currentProp = properties.find(p => p.id === propertyId);
        if (currentProp) {
          updateDoc(propRef, { viewsCount: (currentProp.viewsCount || 0) + 1 }).catch(() => {});
        }
      } catch (err) {
        console.warn('View count update error:', err);
      }
    }
    if (filterOverrides) {
      setFilters(prev => ({ ...prev, ...filterOverrides }));

      // Automatically register to recent searches if navigating to browse with meaningful filters
      if (page === 'browse') {
        const hasQuery = Boolean(filterOverrides.searchQuery?.trim());
        const hasWilaya = Boolean(filterOverrides.wilaya && filterOverrides.wilaya !== 'all');
        const hasCity = Boolean(filterOverrides.city && filterOverrides.city !== 'all');
        const hasType = Boolean(filterOverrides.propertyType && filterOverrides.propertyType !== 'all');
        const hasMinPrice = Boolean(filterOverrides.minPrice && filterOverrides.minPrice > 0);
        const hasMaxPrice = Boolean(filterOverrides.maxPrice && filterOverrides.maxPrice < 300000);

        if (hasQuery || hasWilaya || hasCity || hasType || hasMinPrice || hasMaxPrice) {
          addRecentSearch({ filters: filterOverrides });
        }
      }
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

  const toggleFavorite = async (propertyId: string) => {
    const isCurrentlyFav = favorites.includes(propertyId);
    const updated = isCurrentlyFav
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    // Optimistic UI state update
    setFavorites(updated);
    try {
      localStorage.setItem('kridz_favorites', JSON.stringify(updated));
    } catch (e) {
      console.warn('Local storage favorites save note:', e);
    }

    const prop = properties.find(p => p.id === propertyId);
    const propTitle = prop ? (prop.title.length > 28 ? prop.title.substring(0, 28) + '...' : prop.title) : 'Cette annonce';

    showToast(
      isCurrentlyFav
        ? `${propTitle} retirée de vos favoris.`
        : `${propTitle} ajoutée à vos favoris !`,
      'success'
    );

    // Save to Firestore: logged-in user or demo tenant
    const targetUserId = user?.id || 'user-tenant-demo';

    try {
      // 1. Update user profile document in Firestore (merge: true)
      const userRef = doc(db, 'users', targetUserId);
      await setDoc(userRef, { 
        favorites: updated,
        lastFavoriteAt: new Date().toISOString()
      }, { merge: true });

      // 2. Also record in favorites collection for individual listing queries
      const favDocRef = doc(db, 'favorites', `${targetUserId}_${propertyId}`);
      if (isCurrentlyFav) {
        await deleteDoc(favDocRef);
      } else {
        await setDoc(favDocRef, {
          userId: targetUserId,
          propertyId,
          propertyTitle: prop?.title || '',
          propertyPriceDZD: prop?.pricePerMonthDZD || 0,
          propertyCity: prop?.city || '',
          propertyImage: prop?.images?.[0] || '',
          createdAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Error syncing favorite to Firestore:', err);
    }
  };

  const isFavorited = (propertyId: string) => favorites.includes(propertyId);

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'viewsCount' | 'inquiriesCount'>): Promise<Property> => {
    const newId = `kri-${Date.now()}`;
    const newProperty: Property = {
      ...propertyData,
      id: newId,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      inquiriesCount: 0
    };

    setProperties(prev => [newProperty, ...prev]);

    try {
      const docRef = doc(db, 'properties', newId);
      await setDoc(docRef, newProperty);
    } catch (err) {
      console.error('Error saving property to Firestore:', err);
    }

    return newProperty;
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.error('Error updating property in Firestore:', err);
    }
  };

  const deleteProperty = async (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
    try {
      const docRef = doc(db, 'properties', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Error deleting property from Firestore:', err);
    }
  };

  const togglePropertyStatus = async (id: string, newStatus: ListingStatus) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, { status: newStatus });
    } catch (err) {
      console.error('Error updating status in Firestore:', err);
    }
  };

  const submitInquiry = async (data: { propertyId: string; message: string; moveInDate?: string; name: string; phone: string; email: string }) => {
    const targetProp = properties.find(p => p.id === data.propertyId);
    if (!targetProp) return false;

    const inqId = `inq-${Date.now()}`;
    const newInquiry: Inquiry = {
      id: inqId,
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
    setProperties(prev => prev.map(p => p.id === targetProp.id ? { ...p, inquiriesCount: (p.inquiriesCount || 0) + 1 } : p));

    try {
      const docRef = doc(db, 'inquiries', inqId);
      await setDoc(docRef, newInquiry);
      
      const propRef = doc(db, 'properties', targetProp.id);
      await updateDoc(propRef, { inquiriesCount: (targetProp.inquiriesCount || 0) + 1 });
    } catch (err) {
      console.error('Error writing inquiry to Firestore:', err);
    }

    return true;
  };

  const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    try {
      const docRef = doc(db, 'inquiries', id);
      await updateDoc(docRef, { status });
    } catch (err) {
      console.error('Error updating inquiry status in Firestore:', err);
    }
  };

  // Firebase Authentication: Sign Up
  const signUpWithFirebase = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    agencyName?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: data.name });

        const newUser: User = {
          id: cred.user.uid,
          name: data.name,
          email: data.email,
          phone: data.phone || '+213 550 00 00 00',
          role: data.role,
          agencyName: data.role === 'agency' ? (data.agencyName || 'Agence Immobilière') : undefined,
          createdAt: new Date().toISOString()
        };

        const userDocRef = doc(db, 'users', cred.user.uid);
        await setDoc(userDocRef, newUser);
        setUser(newUser);

        if (newUser.role === 'tenant') {
          setCurrentPage('tenant-dashboard');
        } else {
          setCurrentPage('owner-dashboard');
        }
        return { success: true };
      }
      return { success: false, error: 'Échec de la création de compte.' };
    } catch (err: any) {
      let message = 'Une erreur est survenue lors de l\'inscription.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'Cette adresse email est déjà enregistrée.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Le mot de passe doit comporter au moins 6 caractères.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Adresse email invalide.';
      }
      return { success: false, error: message };
    }
  };

  // Firebase Authentication: Sign In
  const signInWithFirebase = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (cred.user) {
        const userDocRef = doc(db, 'users', cred.user.uid);
        const userSnap = await getDoc(userDocRef);
        let userData: User;
        if (userSnap.exists()) {
          userData = userSnap.data() as User;
          if (userData.favorites && Array.isArray(userData.favorites)) {
            setFavorites(userData.favorites);
          }
        } else {
          userData = {
            id: cred.user.uid,
            name: cred.user.displayName || email.split('@')[0],
            email: cred.user.email || email,
            phone: '+213 550 00 00 00',
            role: 'tenant',
            favorites: favorites,
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, userData);
        }
        setUser(userData);
        if (userData.role === 'tenant') {
          setCurrentPage('tenant-dashboard');
        } else {
          setCurrentPage('owner-dashboard');
        }
        return { success: true };
      }
      return { success: false, error: 'Identifiants incorrects.' };
    } catch (err: any) {
      let message = 'Email ou mot de passe incorrect.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Identifiants invalides. Veuillez vérifier votre email et mot de passe.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Format d\'adresse email invalide.';
      }
      return { success: false, error: message };
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    if (userData.favorites && Array.isArray(userData.favorites)) {
      setFavorites(userData.favorites);
    }
    if (userData.role === 'tenant') {
      setCurrentPage('tenant-dashboard');
    } else {
      setCurrentPage('owner-dashboard');
    }
  };

  const loginAsDemo = async (role: 'tenant' | 'owner' | 'agency') => {
    const demoUser = DEMO_USERS[role];
    if (demoUser) {
      setUser(demoUser);
      // Fetch or sync demo user's favorites from Firestore
      try {
        const userRef = doc(db, 'users', demoUser.id);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data()?.favorites) {
          setFavorites(snap.data().favorites);
        } else {
          const initialFavs = role === 'tenant' ? ['kri-002', 'kri-003'] : [];
          await setDoc(userRef, {
            ...demoUser,
            favorites: initialFavs
          }, { merge: true });
          if (initialFavs.length > 0) {
            setFavorites(initialFavs);
          }
        }
      } catch (err) {
        console.warn('Demo user firestore init note:', err);
      }

      if (role === 'tenant') {
        setCurrentPage('tenant-dashboard');
      } else {
        setCurrentPage('owner-dashboard');
      }
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setUser(null);
    setCurrentPage('home');
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      try {
        const userDocRef = doc(db, 'users', user.id);
        await updateDoc(userDocRef, updates);
      } catch (err) {
        console.warn('Error updating profile in Firestore:', err);
      }
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
        isCloudConnected,
        navigateTo,
        setAuthMode,
        setActiveTenantTab,
        setActiveOwnerTab,
        toggleFavorite,
        isFavorited,
        toast,
        showToast,
        dismissToast,
        addProperty,
        updateProperty,
        deleteProperty,
        togglePropertyStatus,
        submitInquiry,
        updateInquiryStatus,
        login,
        signUpWithFirebase,
        signInWithFirebase,
        loginAsDemo,
        logout,
        updateUserProfile,
        setFilters,
        updateFilter,
        resetFilters,
        setLanguage,
        recentSearches,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches
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
