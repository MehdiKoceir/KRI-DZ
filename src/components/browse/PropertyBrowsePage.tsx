import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  X, 
  RotateCcw, 
  GraduationCap, 
  ChevronDown 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from '../common/PropertyCard';
import { ALGERIAN_WILAYAS } from '../../data/algerianCities';
import { formatPriceOnly } from '../../utils/format';

export const PropertyBrowsePage: React.FC = () => {
  const { properties, filters, updateFilter, resetFilters } = useApp();

  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(9);

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
      if (filters.city !== 'all' && filters.city) {
        if (!prop.city.toLowerCase().includes(filters.city.toLowerCase())) {
          return false;
        }
      }

      // Property Type
      if (filters.propertyType !== 'all') {
        if (filters.propertyType === 'student') {
          if (!prop.isStudentFriendly && prop.propertyType !== 'student') return false;
        } else if (prop.propertyType !== filters.propertyType) {
          return false;
        }
      }

      // Price Range (DZD)
      if (prop.pricePerMonthDZD < filters.minPrice) return false;
      if (filters.maxPrice > 0 && prop.pricePerMonthDZD > filters.maxPrice) return false;

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
    filters.propertyType !== 'all',
    filters.minPrice > 0,
    filters.maxPrice < 200000,
    filters.rooms !== 'all',
    filters.isFurnished !== null,
    filters.isStudentFriendly !== null,
    filters.isAvailableNow !== null,
    Boolean(filters.searchQuery.trim())
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="mb-8">
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
              <p className="text-sm text-slate-500 mt-0.5">
                {filteredProperties.length} {filteredProperties.length > 1 ? 'biens disponibles' : 'bien disponible'} en Algérie
              </p>
            </div>

            {/* Mobile filter toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-bold flex items-center justify-center gap-2 shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                <span>Filtres</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Quick Controls */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Text Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                placeholder="Rechercher par quartier ou ville (ex: Hydra, Akid Lotfi, Bab Ezzouar)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-400"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => updateFilter('searchQuery', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Wilaya Dropdown */}
            <div className="w-full md:w-56">
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={filters.wilaya}
                  onChange={(e) => updateFilter('wilaya', e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 appearance-none focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="all">Toutes les wilayas</option>
                  {ALGERIAN_WILAYAS.map(w => (
                    <option key={w.code} value={w.name}>
                      {w.code} - {w.name} ({w.arName})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Sort By Dropdown */}
            <div className="w-full md:w-52">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="newest">Plus récentes en premier</option>
                <option value="price_asc">Prix : Moins cher d'abord</option>
                <option value="price_desc">Prix : Plus cher d'abord</option>
                <option value="surface_desc">Superficie : Plus grande</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl">
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
          </div>

          {/* Active Filter Chips - Monochrome & Understated */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium">Filtres :</span>
              {filters.wilaya !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  Wilaya: {filters.wilaya}
                  <button onClick={() => updateFilter('wilaya', 'all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.propertyType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  Type: {filters.propertyType}
                  <button onClick={() => updateFilter('propertyType', 'all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.rooms !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  {filters.rooms === '5+' ? '5+ pièces' : `F${filters.rooms}`}
                  <button onClick={() => updateFilter('rooms', 'all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.isFurnished !== null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  {filters.isFurnished ? 'Meublé' : 'Non meublé'}
                  <button onClick={() => updateFilter('isFurnished', null)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.isStudentFriendly !== null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  Logement Étudiant
                  <button onClick={() => updateFilter('isStudentFriendly', null)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.maxPrice < 200000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  Max: {formatPriceOnly(filters.maxPrice)}
                  <button onClick={() => updateFilter('maxPrice', 200000)}><X className="w-3 h-3" /></button>
                </span>
              )}

              <button
                type="button"
                onClick={resetFilters}
                className="text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 ml-auto"
              >
                <RotateCcw className="w-3 h-3" />
                Réinitialiser
              </button>
            </div>
          )}
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar - Neutral & Clear */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Filter className="w-4 h-4 text-slate-600" />
                <span>Filtres</span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
                >
                  Effacer ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Property Type Radio */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                Type de bien
              </label>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'Tous les types' },
                  { id: 'apartment', label: 'Appartement (F1-F5)' },
                  { id: 'student', label: 'Logement Étudiant' },
                  { id: 'villa', label: 'Villa & Maison' },
                  { id: 'duplex', label: 'Duplex' }
                ].map(type => (
                  <label key={type.id} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900">
                    <input
                      type="radio"
                      name="propertyType"
                      checked={filters.propertyType === type.id}
                      onChange={() => updateFilter('propertyType', type.id)}
                      className="w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900"
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Range (DZD) */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Loyer Max (DZD)
                </label>
                <span className="text-xs font-bold text-slate-900">
                  {filters.maxPrice >= 200000 ? 'Illimité' : formatPriceOnly(filters.maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={15000}
                max={200000}
                step={5000}
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>15 000 DZD</span>
                <span>200 000+ DZD</span>
              </div>
            </div>

            {/* Number of Rooms */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                Nombre de pièces
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['all', '1', '2', '3', '4', '5+'].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => updateFilter('rooms', num)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      filters.rooms === num
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {num === 'all' ? 'Tous' : num === '5+' ? '5+' : `F${num}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnished Status */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                Ameublement
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateFilter('isFurnished', filters.isFurnished === true ? null : true)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    filters.isFurnished === true
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Meublé
                </button>
                <button
                  type="button"
                  onClick={() => updateFilter('isFurnished', filters.isFurnished === false ? null : false)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    filters.isFurnished === false
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Non meublé
                </button>
              </div>
            </div>

            {/* Toggles: Student & Immediate */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                  Logement Étudiant
                </span>
                <input
                  type="checkbox"
                  checked={filters.isStudentFriendly === true}
                  onChange={(e) => updateFilter('isStudentFriendly', e.target.checked ? true : null)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-700">
                  Disponible immédiatement
                </span>
                <input
                  type="checkbox"
                  checked={filters.isAvailableNow === true}
                  onChange={(e) => updateFilter('isAvailableNow', e.target.checked ? true : null)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                />
              </label>
            </div>

          </aside>

          {/* Results Grid / List */}
          <div className="lg:col-span-9">
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Aucun bien ne correspond à vos filtres
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Essayez d'élargir votre recherche, de sélectionner une autre wilaya ou d'ajuster votre budget.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
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
                      onClick={() => setVisibleCount(prev => prev + 6)}
                      className="px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-sm font-bold shadow-xs transition-all"
                    >
                      Afficher plus d'annonces ({filteredProperties.length - displayedProperties.length} restantes)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

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
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile filter elements */}
              <div className="py-4 space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                    Wilaya
                  </label>
                  <select
                    value={filters.wilaya}
                    onChange={(e) => updateFilter('wilaya', e.target.value)}
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

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                    Type de bien
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => updateFilter('propertyType', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="all">Tous les types</option>
                    <option value="apartment">Appartement</option>
                    <option value="student">Logement Étudiant</option>
                    <option value="villa">Villa / Maison</option>
                    <option value="duplex">Duplex</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Loyer Max (DZD)</span>
                    <span className="text-slate-900">{formatPriceOnly(filters.maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={15000}
                    max={200000}
                    step={5000}
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                    className="w-full accent-slate-900"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold">
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
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
