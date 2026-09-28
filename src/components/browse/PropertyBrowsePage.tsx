import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  X, 
  RotateCcw, 
  GraduationCap, 
  Building2, 
  Home, 
  Layers, 
  Sparkles, 
  MapPin, 
  BedDouble, 
  Coins, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp,
  Check,
  Calendar,
  Sofa,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from '../common/PropertyCard';
import { ALGERIAN_WILAYAS } from '../../data/algerianCities';
import { formatPriceOnly, formatDZD } from '../../utils/format';

// Budget presets commonly used in Algeria (in DZD/month)
const BUDGET_PRESETS = [
  { label: 'Tous', min: 0, max: 300000 },
  { label: '≤ 35 000 DA', min: 0, max: 35000 },
  { label: '35k - 70k DA', min: 35000, max: 70000 },
  { label: '70k - 120k DA', min: 70000, max: 120000 },
  { label: '> 120 000 DA', min: 120000, max: 300000 },
];

export const PropertyBrowsePage: React.FC = () => {
  const { properties, filters, updateFilter, resetFilters, setFilters, addRecentSearch } = useApp();

  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [isDetailedFiltersOpen, setIsDetailedFiltersOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Automatically save meaningful searches to recent searches history (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasQuery = Boolean(filters.searchQuery?.trim());
      const hasWilaya = filters.wilaya !== 'all';
      const hasCity = filters.city !== 'all' && Boolean(filters.city);
      const hasType = filters.propertyType !== 'all';
      const hasMinPrice = filters.minPrice > 0;
      const hasMaxPrice = filters.maxPrice < 300000 && filters.maxPrice > 0;
      const hasRooms = filters.rooms !== 'all';

      if (hasQuery || hasWilaya || hasCity || hasType || hasMinPrice || hasMaxPrice || hasRooms) {
        addRecentSearch({ filters });
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [filters, addRecentSearch]);

  // Dynamic available cities list based on selected Wilaya and properties in catalog
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();

    if (filters.wilaya !== 'all') {
      const matchedWilaya = ALGERIAN_WILAYAS.find(
        w => w.name.toLowerCase() === filters.wilaya.toLowerCase() || w.code === filters.wilaya
      );
      if (matchedWilaya) {
        matchedWilaya.popularCities.forEach(c => citySet.add(c));
      }
      properties.forEach(p => {
        if (p.wilayaName.toLowerCase().includes(filters.wilaya.toLowerCase()) && p.city) {
          citySet.add(p.city);
        }
      });
    } else {
      ALGERIAN_WILAYAS.forEach(w => {
        w.popularCities.forEach(c => citySet.add(c));
      });
      properties.forEach(p => {
        if (p.city) citySet.add(p.city);
      });
    }

    return Array.from(citySet).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [filters.wilaya, properties]);

  // Popular Algerian communes / cities for quick pill filters
  const popularCityChips = useMemo(() => {
    if (filters.wilaya !== 'all') {
      const matchedWilaya = ALGERIAN_WILAYAS.find(
        w => w.name.toLowerCase() === filters.wilaya.toLowerCase() || w.code === filters.wilaya
      );
      return matchedWilaya ? matchedWilaya.popularCities.slice(0, 6) : availableCities.slice(0, 6);
    }
    return ['Hydra', 'Bab Ezzouar', 'Dely Ibrahim', 'Akid Lotfi', 'Canastel', 'Kouba', 'Cheraga'];
  }, [filters.wilaya, availableCities]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Must be active
      if (prop.status !== 'active') return false;

      // Search Query (title, neighborhood, city, description)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesDesc = prop.description.toLowerCase().includes(q);
        const matchesNeighborhood = prop.neighborhood.toLowerCase().includes(q);
        const matchesCity = prop.city.toLowerCase().includes(q);
        const matchesWilaya = prop.wilayaName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesNeighborhood && !matchesCity && !matchesWilaya) {
          return false;
        }
      }

      // Wilaya filter
      if (filters.wilaya !== 'all') {
        if (!prop.wilayaName.toLowerCase().includes(filters.wilaya.toLowerCase())) {
          return false;
        }
      }

      // City filter
      if (filters.city !== 'all' && filters.city.trim()) {
        const targetCity = filters.city.toLowerCase().trim();
        const propCity = prop.city.toLowerCase().trim();
        const propNeighborhood = prop.neighborhood.toLowerCase().trim();
        if (!propCity.includes(targetCity) && !propNeighborhood.includes(targetCity)) {
          return false;
        }
      }

      // Property Type (appartement, villa, studio, duplex, student)
      if (filters.propertyType !== 'all') {
        if (filters.propertyType === 'student') {
          if (!prop.isStudentFriendly && prop.propertyType !== 'student') return false;
        } else if (prop.propertyType !== filters.propertyType) {
          return false;
        }
      }

      // Price Range (DZD)
      if (filters.minPrice > 0 && prop.pricePerMonthDZD < filters.minPrice) return false;
      if (filters.maxPrice > 0 && filters.maxPrice < 300000 && prop.pricePerMonthDZD > filters.maxPrice) return false;

      // Rooms (F1, F2, F3, F4, F5+)
      if (filters.rooms !== 'all') {
        const roomNum = parseInt(filters.rooms, 10);
        if (filters.rooms === '5+' && prop.rooms < 5) return false;
        if (filters.rooms !== '5+' && prop.rooms !== roomNum) return false;
      }

      // Furnished
      if (filters.isFurnished !== null) {
        if (prop.isFurnished !== filters.isFurnished) return false;
      }

      // Student friendly
      if (filters.isStudentFriendly !== null && filters.isStudentFriendly) {
        if (!prop.isStudentFriendly && prop.propertyType !== 'student') return false;
      }

      // Available now
      if (filters.isAvailableNow !== null && filters.isAvailableNow) {
        if (!prop.isAvailable) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') {
        return a.pricePerMonthDZD - b.pricePerMonthDZD;
      }
      if (filters.sortBy === 'price_desc') {
        return b.pricePerMonthDZD - a.pricePerMonthDZD;
      }
      if (filters.sortBy === 'surface_desc') {
        return b.surfaceM2 - a.surfaceM2;
      }
      if (filters.sortBy === 'rating_desc') {
        return (b.rating || 0) - (a.rating || 0);
      }
      // default 'newest'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [properties, filters]);

  const displayedProperties = filteredProperties.slice(0, visibleCount);

  // Check how many filters are active
  const activeFilterCount = [
    filters.wilaya !== 'all',
    filters.city !== 'all' && Boolean(filters.city),
    filters.propertyType !== 'all',
    filters.minPrice > 0,
    filters.maxPrice < 300000 && filters.maxPrice > 0,
    filters.rooms !== 'all',
    filters.isFurnished !== null,
    filters.isStudentFriendly !== null,
    filters.isAvailableNow !== null,
    Boolean(filters.searchQuery.trim())
  ].filter(Boolean).length;

  // Handle Wilaya change
  const handleWilayaChange = (newWilaya: string) => {
    updateFilter('wilaya', newWilaya);
    if (newWilaya === 'all') {
      updateFilter('city', 'all');
    } else {
      const matched = ALGERIAN_WILAYAS.find(w => w.name.toLowerCase() === newWilaya.toLowerCase() || w.code === newWilaya);
      if (matched && filters.city !== 'all') {
        const belongs = matched.popularCities.some(c => c.toLowerCase() === filters.city.toLowerCase());
        if (!belongs) {
          updateFilter('city', 'all');
        }
      }
    }
  };

  // Quick categories list
  const propertyCategoryOptions = [
    { id: 'all', label: 'Tous les biens', icon: Sparkles },
    { id: 'apartment', label: 'Appartements', icon: Building2 },
    { id: 'villa', label: 'Villas', icon: Home },
    { id: 'studio', label: 'Studios', icon: Layers },
    { id: 'duplex', label: 'Duplex', icon: Building2 },
    { id: 'student', label: 'Logements étudiants', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <span>Accueil</span>
            <span>/</span>
            <span className="text-slate-800">Location Immobilière Algérie</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Annonces Immobilières en Algérie
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {filteredProperties.length} {filteredProperties.length > 1 ? 'biens disponibles' : 'bien disponible'} en location (Alger, Oran, Blida, Constantine...)
              </p>
            </div>

            {/* Sort Dropdown, View Mode & Mobile filter toggle */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Menu déroulant de tri */}
              <div className="relative">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="browse-header-sort-dropdown"
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value as any)}
                  className="pl-8.5 pr-8 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 appearance-none focus:outline-none focus:border-slate-400 cursor-pointer transition-colors shadow-2xs"
                  title="Trier les annonces"
                >
                  <option value="newest">Les plus récents</option>
                  <option value="rating_desc">Mieux notés (Avis)</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="surface_desc">Superficie décroissante</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <button
                  type="button"
                  onClick={() => setLayout('grid')}
                  className={`p-2 rounded-lg transition-colors ${layout === 'grid' ? 'bg-slate-900 text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Affichage Grille"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('list')}
                  className={`p-2 rounded-lg transition-colors ${layout === 'list' ? 'bg-slate-900 text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Affichage Liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filtres</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BARRE DE RECHERCHE AVANCÉE KRIDZ (DESKTOP & RESPONSIVE) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm shadow-slate-200/50 mb-8 transition-all">
          
          {/* Ligne 1 : Moteur de recherche principal à 4 blocs interactifs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-stretch">
            
            {/* BLOC 1: VILLE & COMMUNE (avec sélecteur de Wilaya) */}
            <div className="lg:col-span-4 bg-slate-50/80 hover:bg-slate-100/70 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent border border-slate-200 rounded-2xl p-3 transition-all relative flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Ville ou Commune
                  </span>
                </div>
                {(filters.city !== 'all' || filters.wilaya !== 'all') && (
                  <button 
                    type="button" 
                    onClick={() => {
                      updateFilter('city', 'all');
                      updateFilter('wilaya', 'all');
                    }} 
                    className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold transition-colors"
                  >
                    Effacer
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                {/* Wilaya select */}
                <div className="relative">
                  <select
                    value={filters.wilaya}
                    onChange={(e) => handleWilayaChange(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none appearance-none cursor-pointer pr-5 truncate"
                    title="Sélectionner la Wilaya"
                  >
                    <option value="all">Toutes wilayas</option>
                    {ALGERIAN_WILAYAS.map(w => (
                      <option key={w.code} value={w.name}>
                        {w.code} - {w.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Commune / Ville select */}
                <div className="relative border-l border-slate-200 pl-2">
                  <select
                    value={filters.city}
                    onChange={(e) => updateFilter('city', e.target.value)}
                    className={`w-full bg-transparent text-xs font-bold focus:outline-none appearance-none cursor-pointer pr-5 truncate ${
                      filters.city !== 'all' ? 'text-emerald-700' : 'text-slate-800'
                    }`}
                    title="Sélectionner la commune ou le quartier"
                  >
                    <option value="all">Toutes communes</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* BLOC 2: TYPE DE BIEN */}
            <div className="lg:col-span-3 bg-slate-50/80 hover:bg-slate-100/70 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent border border-slate-200 rounded-2xl p-3 transition-all relative flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Type de bien
                  </span>
                </div>
                {filters.propertyType !== 'all' && (
                  <button 
                    type="button" 
                    onClick={() => updateFilter('propertyType', 'all')} 
                    className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold transition-colors"
                  >
                    Tous
                  </button>
                )}
              </div>

              <div className="relative mt-1">
                <select
                  value={filters.propertyType}
                  onChange={(e) => updateFilter('propertyType', e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none appearance-none cursor-pointer pr-6 py-0.5 truncate"
                >
                  <option value="all">Tous les types de biens</option>
                  <option value="apartment">🏢 Appartement</option>
                  <option value="villa">🏡 Villa</option>
                  <option value="studio">🛋️ Studio</option>
                  <option value="duplex">🏰 Duplex</option>
                  <option value="student">🎓 Logement étudiant</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* BLOC 3: BUDGET MAXIMUM (DZD) */}
            <div className="lg:col-span-3 bg-slate-50/80 hover:bg-slate-100/70 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent border border-slate-200 rounded-2xl p-3 transition-all relative flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Budget Maximum
                  </span>
                </div>
                {filters.maxPrice > 0 && filters.maxPrice < 300000 && (
                  <button 
                    type="button" 
                    onClick={() => updateFilter('maxPrice', 300000)} 
                    className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold transition-colors"
                  >
                    Illimité
                  </button>
                )}
              </div>

              <div className="relative mt-1">
                <select
                  value={filters.maxPrice >= 300000 || filters.maxPrice === 0 ? '0' : String(filters.maxPrice)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateFilter('maxPrice', val === 0 ? 300000 : val);
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none appearance-none cursor-pointer pr-6 py-0.5 truncate"
                >
                  <option value="0">Tous budgets (Max illimité)</option>
                  <option value="25000">≤ 25 000 DA / mois</option>
                  <option value="35000">≤ 35 000 DA / mois</option>
                  <option value="50000">≤ 50 000 DA / mois</option>
                  <option value="70000">≤ 70 000 DA / mois</option>
                  <option value="90000">≤ 90 000 DA / mois</option>
                  <option value="120000">≤ 120 000 DA / mois</option>
                  <option value="150000">≤ 150 000 DA / mois</option>
                  <option value="200000">≤ 200 000 DA / mois</option>
                  <option value="250000">≤ 250 000 DA / mois</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* BLOC 4: BOUTONS D'ACTION (RECHERCHER + FILTRES DÉTAILLÉS) */}
            <div className="lg:col-span-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDetailedFiltersOpen(prev => !prev)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all h-full ${
                  isDetailedFiltersOpen || activeFilterCount > 0
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title={isDetailedFiltersOpen ? 'Masquer les filtres détaillés' : 'Ouvrir les filtres détaillés'}
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Critères</span>
                {isDetailedFiltersOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                )}
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  // Scroll smoothly to results
                  const resultsEl = document.getElementById('browse-results-grid');
                  if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-3 px-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors h-full shrink-0"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap font-bold">
                  ({filteredProperties.length})
                </span>
              </button>
            </div>
          </div>

          {/* Ligne 2 : Recherche textuelle rapide (mots-clés) */}
          <div className="mt-3.5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              placeholder="Rechercher par quartier, mot-clé, commodité (ex: Hydra, F3, meublé, vue sur mer, citerne, garage)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => updateFilter('searchQuery', '')}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                title="Effacer la recherche textuelle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Ligne 3 : Puces de suggestions rapides (Communes populaires & Types de bien) */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            
            {/* Quick city chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                Top Villes :
              </span>
              {popularCityChips.map(city => {
                const isActive = filters.city.toLowerCase() === city.toLowerCase();
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => updateFilter('city', isActive ? 'all' : city)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                      isActive 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>

            {/* Quick price presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <Coins className="w-3 h-3 text-slate-400" />
                Loyer :
              </span>
              {BUDGET_PRESETS.map((p, idx) => {
                const isSelected = filters.minPrice === p.min && (
                  p.max >= 300000 
                    ? (filters.maxPrice >= 300000 || filters.maxPrice === 0) 
                    : filters.maxPrice === p.max
                );
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, minPrice: p.min, maxPrice: p.max }));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* VOLET DÉTAILLÉ DÉROULANT (CRITÈRES COMPLÉMENTAIRES)     */}
          {/* ======================================================== */}
          {isDetailedFiltersOpen && (
            <div className="mt-5 pt-5 border-t border-slate-200 space-y-5 animate-in fade-in duration-200">
              
              {/* Type de bien sous forme de boutons illustrés */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Catégorie de logement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {propertyCategoryOptions.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = filters.propertyType === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => updateFilter('propertyType', cat.id)}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                        <span className="truncate w-full">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ligne : Nombre de pièces (F1 à F5+) & Ameublement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nombre de pièces */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Nombre de pièces (Typologie algérienne)
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {[
                      { id: 'all', label: 'Tous' },
                      { id: '1', label: 'F1' },
                      { id: '2', label: 'F2' },
                      { id: '3', label: 'F3' },
                      { id: '4', label: 'F4' },
                      { id: '5+', label: 'F5+' }
                    ].map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => updateFilter('rooms', r.id)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                          filters.rooms === r.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtres booléens (Meublé, Étudiant, Disponible) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Critères spécifiques
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => updateFilter('isFurnished', filters.isFurnished === true ? null : true)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        filters.isFurnished === true
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Sofa className="w-3.5 h-3.5" />
                      <span>Meublé</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateFilter('isStudentFriendly', filters.isStudentFriendly === true ? null : true)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        filters.isStudentFriendly === true
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Étudiant</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateFilter('isAvailableNow', filters.isAvailableNow === true ? null : true)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        filters.isAvailableNow === true
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Dispo immédiate</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider de budget précis en DZD */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Ajustement précis du budget mensuel
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      Min : {filters.minPrice > 0 ? formatPriceOnly(filters.minPrice) : '0 DA'}
                    </span>
                    <span className="text-slate-400">à</span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs text-emerald-700">
                      Max : {filters.maxPrice >= 300000 || filters.maxPrice === 0 ? 'Illimité' : formatPriceOnly(filters.maxPrice)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Loyer minimum : {formatPriceOnly(filters.minPrice)}
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={150000}
                      step={5000}
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
                      className="w-full accent-slate-900 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Loyer maximum : {filters.maxPrice >= 300000 || filters.maxPrice === 0 ? 'Illimité (300 000+ DA)' : formatPriceOnly(filters.maxPrice)}
                    </label>
                    <input
                      type="range"
                      min={15000}
                      max={300000}
                      step={5000}
                      value={filters.maxPrice >= 300000 ? 300000 : filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Bouton de réinitialisation rapide */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-medium">
                  {filteredProperties.length} {filteredProperties.length > 1 ? 'résultats trouvés' : 'résultat trouvé'} avec ces critères
                </span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser tous les filtres</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* BADGES DES FILTRES ACTIFS (SUPPRESSION RAPIDE EN UN CLIC) */}
          {/* ======================================================== */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-1">Filtres actifs :</span>

              {/* Wilaya badge */}
              {filters.wilaya !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
                  Wilaya: {filters.wilaya}
                  <button type="button" onClick={() => updateFilter('wilaya', 'all')} className="hover:text-emerald-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* City badge */}
              {filters.city !== 'all' && filters.city && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
                  Commune: {filters.city}
                  <button type="button" onClick={() => updateFilter('city', 'all')} className="hover:text-emerald-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Property type badge */}
              {filters.propertyType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200/60">
                  Type: {propertyCategoryOptions.find(c => c.id === filters.propertyType)?.label || filters.propertyType}
                  <button type="button" onClick={() => updateFilter('propertyType', 'all')} className="hover:text-blue-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Max budget badge */}
              {filters.maxPrice > 0 && filters.maxPrice < 300000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/60">
                  Max: {formatPriceOnly(filters.maxPrice)}
                  <button type="button" onClick={() => updateFilter('maxPrice', 300000)} className="hover:text-amber-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Min budget badge */}
              {filters.minPrice > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/60">
                  Min: {formatPriceOnly(filters.minPrice)}
                  <button type="button" onClick={() => updateFilter('minPrice', 0)} className="hover:text-amber-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Rooms badge */}
              {filters.rooms !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200/60">
                  Pièces: F{filters.rooms}
                  <button type="button" onClick={() => updateFilter('rooms', 'all')} className="hover:text-purple-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Furnished badge */}
              {filters.isFurnished === true && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                  Meublé
                  <button type="button" onClick={() => updateFilter('isFurnished', null)} className="hover:text-slate-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Student badge */}
              {filters.isStudentFriendly === true && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                  Étudiant
                  <button type="button" onClick={() => updateFilter('isStudentFriendly', null)} className="hover:text-slate-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Query badge */}
              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                  "{filters.searchQuery}"
                  <button type="button" onClick={() => updateFilter('searchQuery', '')} className="hover:text-slate-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Clear all */}
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 underline ml-2 transition-colors"
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>

        {/* RESULTS SECTION */}
        <div id="browse-results-grid">
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Aucun bien ne correspond à vos critères de recherche
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                Essayez d'élargir votre budget maximum, de changer de type de bien ou de sélectionner une autre commune en Algérie.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs"
              >
                Réinitialiser tous les critères
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {displayedProperties.map(property => (
                  <PropertyCard key={property.id} property={property} layout={layout} />
                ))}
              </div>

              {/* Load More Button */}
              {displayedProperties.length < filteredProperties.length && (
                <div className="text-center pt-8">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="px-6 py-3 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-sm font-bold shadow-xs transition-all"
                  >
                    Afficher plus d'annonces ({filteredProperties.length - displayedProperties.length} restantes)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                  Filtres de recherche avancée
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile filter elements */}
              <div className="py-4 space-y-5">
                
                {/* Tri des annonces */}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                    Trier les annonces
                  </label>
                  <div className="relative">
                    <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="mobile-drawer-sort-select"
                      value={filters.sortBy}
                      onChange={(e) => updateFilter('sortBy', e.target.value as any)}
                      className="w-full pl-9 pr-8 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 appearance-none focus:outline-none focus:border-slate-400 cursor-pointer"
                    >
                      <option value="newest">Les plus récents</option>
                      <option value="rating_desc">Mieux notés (Avis)</option>
                      <option value="price_asc">Prix croissant</option>
                      <option value="price_desc">Prix décroissant</option>
                      <option value="surface_desc">Superficie décroissante</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Localisation : Wilaya & Ville */}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                    Wilaya
                  </label>
                  <select
                    value={filters.wilaya}
                    onChange={(e) => handleWilayaChange(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="all">Toutes les wilayas</option>
                    {ALGERIAN_WILAYAS.map(w => (
                      <option key={w.code} value={w.name}>
                        {w.code} - {w.name} ({w.arName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ville / Commune */}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                    Ville ou Commune
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => updateFilter('city', e.target.value)}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-bold ${
                      filters.city !== 'all' && filters.city ? 'border-slate-900 text-slate-900 bg-slate-100/50' : 'border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="all">Toutes les communes</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Type de bien */}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                    Type de bien
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'all', label: 'Tous' },
                      { id: 'apartment', label: 'Appartement' },
                      { id: 'villa', label: 'Villa' },
                      { id: 'studio', label: 'Studio' },
                      { id: 'duplex', label: 'Duplex' },
                      { id: 'student', label: 'Étudiant' }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateFilter('propertyType', t.id)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold text-center transition-colors ${
                          filters.propertyType === t.id
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Maximum */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>Budget max (DZD)</span>
                    <span className="text-emerald-700 font-extrabold">
                      {filters.maxPrice >= 300000 || filters.maxPrice === 0 ? 'Illimité' : formatPriceOnly(filters.maxPrice)}
                    </span>
                  </div>

                  {/* Quick price presets in mobile */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {BUDGET_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFilters(prev => ({ ...prev, minPrice: p.min, maxPrice: p.max }));
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-colors ${
                          filters.minPrice === p.min && (p.max >= 300000 ? (filters.maxPrice >= 300000 || filters.maxPrice === 0) : filters.maxPrice === p.max)
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Max price slider */}
                  <div>
                    <input
                      type="range"
                      min={15000}
                      max={300000}
                      step={5000}
                      value={filters.maxPrice >= 300000 ? 300000 : filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                </div>

                {/* Nombre de pièces */}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                    Nombre de pièces
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['all', '1', '2', '3', '4', '5+'].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => updateFilter('rooms', num)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                          filters.rooms === num
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {num === 'all' ? 'Tous' : num === '5+' ? '5+ pièces' : `F${num}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ameublement & critères */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Logement meublé</span>
                    <input
                      type="checkbox"
                      checked={filters.isFurnished === true}
                      onChange={(e) => updateFilter('isFurnished', e.target.checked ? true : null)}
                      className="w-4 h-4 rounded text-slate-900 accent-slate-900"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Logement Étudiant</span>
                    <input
                      type="checkbox"
                      checked={filters.isStudentFriendly === true}
                      onChange={(e) => updateFilter('isStudentFriendly', e.target.checked ? true : null)}
                      className="w-4 h-4 rounded text-slate-900 accent-slate-900"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Disponible immédiatement</span>
                    <input
                      type="checkbox"
                      checked={filters.isAvailableNow === true}
                      onChange={(e) => updateFilter('isAvailableNow', e.target.checked ? true : null)}
                      className="w-4 h-4 rounded text-slate-900 accent-slate-900"
                    />
                  </label>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm"
              >
                Voir {filteredProperties.length} annonces
              </button>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
