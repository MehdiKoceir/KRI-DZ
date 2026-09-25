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
  Navigation,
  MapPin,
  BedDouble,
  Coins,
  ArrowUpDown,
  ChevronDown,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from '../common/PropertyCard';
import { AdvancedFilterBar } from './AdvancedFilterBar';
import { ALGERIAN_WILAYAS } from '../../data/algerianCities';
import { formatPriceOnly } from '../../utils/format';

export const PropertyBrowsePage: React.FC = () => {
  const { properties, filters, updateFilter, resetFilters, setFilters, addRecentSearch } = useApp();

  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
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

  // Handle Wilaya change in mobile
  const handleWilayaChangeMobile = (newWilaya: string) => {
    updateFilter('wilaya', newWilaya);
    if (newWilaya === 'all') {
      updateFilter('city', 'all');
    } else {
      const matched = ALGERIAN_WILAYAS.find(w => w.name.toLowerCase() === newWilaya.toLowerCase());
      if (matched && filters.city !== 'all') {
        const belongs = matched.popularCities.some(c => c.toLowerCase() === filters.city.toLowerCase());
        if (!belongs) {
          updateFilter('city', 'all');
        }
      }
    }
  };

  // Quick category pills
  const quickCategories = [
    { id: 'all', label: 'Toutes les catégories', icon: Sparkles },
    { id: 'apartment', label: 'Appartements', icon: Building2 },
    { id: 'villa', label: 'Villas', icon: Home },
    { id: 'studio', label: 'Studios', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
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
                Annonces Immobilières
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {filteredProperties.length} {filteredProperties.length > 1 ? 'biens disponibles' : 'bien disponible'} en location en Algérie
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
                  className="pl-8.5 pr-8 py-2 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 appearance-none focus:outline-none focus:border-slate-400 cursor-pointer transition-colors shadow-2xs"
                  title="Trier les annonces"
                >
                  <option value="newest">Les plus récents</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="surface_desc">Superficie décroissante</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLayout('grid')}
                  className={`p-2 rounded-lg transition-colors ${layout === 'grid' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Affichage Grille"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('list')}
                  className={`p-2 rounded-lg transition-colors ${layout === 'list' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Affichage Liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filtres</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-slate-900 text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Property Type Selector Pills (Appartement, Villa, Studio, Tous) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 scrollbar-none">
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = filters.propertyType === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateFilter('propertyType', cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ADVANCED FILTER BAR */}
        <AdvancedFilterBar
          matchingCount={filteredProperties.length}
          totalCount={properties.length}
          layout={layout}
          onLayoutChange={setLayout}
        />

        {/* RESULTS SECTION */}
        <div>
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Aucun bien ne correspond à vos critères de recherche
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                Essayez d'élargir votre fourchette de prix, de modifier le type de bien ou de sélectionner une autre commune.
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
                  Filtres de recherche
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
                    onChange={(e) => handleWilayaChangeMobile(e.target.value)}
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
                    <option value="all">Toutes les villes</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Type de bien (Appartement, Villa, Studio...) */}
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

                {/* Fourchette de prix complète (Min et Max en DZD) */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>Fourchette de prix (DA)</span>
                    <span className="text-slate-900">
                      {filters.minPrice > 0 ? formatPriceOnly(filters.minPrice) : '0 DA'} - {filters.maxPrice >= 300000 || filters.maxPrice === 0 ? 'Max' : formatPriceOnly(filters.maxPrice)}
                    </span>
                  </div>

                  {/* Quick price presets in mobile */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'Tous', min: 0, max: 300000 },
                      { label: '< 40 000 DA', min: 0, max: 40000 },
                      { label: '40k - 80k DA', min: 40000, max: 80000 },
                      { label: '> 150 000 DA', min: 150000, max: 300000 },
                    ].map((p, idx) => (
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

                  {/* Min price slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                      <span>Min: {filters.minPrice > 0 ? formatPriceOnly(filters.minPrice) : '0 DA'}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={150000}
                      step={5000}
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
                      className="w-full accent-slate-900"
                    />
                  </div>

                  {/* Max price slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                      <span>Max: {filters.maxPrice >= 300000 || filters.maxPrice === 0 ? 'Illimité' : formatPriceOnly(filters.maxPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min={15000}
                      max={300000}
                      step={5000}
                      value={filters.maxPrice >= 300000 ? 300000 : filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                      className="w-full accent-slate-900"
                    />
                  </div>
                </div>

                {/* Nombre de pièces (Chambres) */}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                    Nombre de pièces / Chambres
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
                  <label className="flex items-center justify-between">
                    <span>Logement meublé</span>
                    <input
                      type="checkbox"
                      checked={filters.isFurnished === true}
                      onChange={(e) => updateFilter('isFurnished', e.target.checked ? true : null)}
                      className="w-4 h-4 rounded text-slate-900"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Logement Étudiant</span>
                    <input
                      type="checkbox"
                      checked={filters.isStudentFriendly === true}
                      onChange={(e) => updateFilter('isStudentFriendly', e.target.checked ? true : null)}
                      className="w-4 h-4 rounded text-slate-900"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Disponible immédiatement</span>
                    <input
                      type="checkbox"
                      checked={filters.isAvailableNow === true}
                      onChange={(e) => updateFilter('isAvailableNow', e.target.checked ? true : null)}
                      className="w-4 h-4 rounded text-slate-900"
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
