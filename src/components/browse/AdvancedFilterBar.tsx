import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation,
  SlidersHorizontal, 
  Building2, 
  Home, 
  Layers, 
  ChevronsUp, 
  GraduationCap, 
  X, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  BedDouble, 
  Coins, 
  Sparkles,
  Check,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALGERIAN_WILAYAS } from '../../data/algerianCities';
import { formatPriceOnly } from '../../utils/format';

interface AdvancedFilterBarProps {
  matchingCount: number;
  totalCount: number;
  layout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
}

// Preset price bands for Algerian real estate market in DZD
const PRICE_PRESETS = [
  { label: 'Tous les prix', min: 0, max: 300000 },
  { label: '< 40 000 DA', min: 0, max: 40000 },
  { label: '40k - 80k DA', min: 40000, max: 80000 },
  { label: '80k - 150k DA', min: 80000, max: 150000 },
  { label: '> 150 000 DA', min: 150000, max: 300000 },
];

export const AdvancedFilterBar: React.FC<AdvancedFilterBarProps> = ({
  matchingCount,
  totalCount,
  layout,
  onLayoutChange
}) => {
  const { properties, filters, updateFilter, resetFilters, setFilters } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);

  // Property types config (emphasizing apartment, villa, studio, duplex, student)
  const propertyTypes = [
    { id: 'all', label: 'Tous les types', icon: Sparkles },
    { id: 'apartment', label: 'Appartement', icon: Building2 },
    { id: 'villa', label: 'Villa', icon: Home },
    { id: 'studio', label: 'Studio', icon: Layers },
    { id: 'duplex', label: 'Duplex', icon: ChevronsUp },
    { id: 'student', label: 'Étudiant', icon: GraduationCap },
  ];

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

  // Top popular cities for quick-chips
  const popularCityChips = useMemo(() => {
    if (filters.wilaya !== 'all') {
      const matchedWilaya = ALGERIAN_WILAYAS.find(
        w => w.name.toLowerCase() === filters.wilaya.toLowerCase() || w.code === filters.wilaya
      );
      return matchedWilaya ? matchedWilaya.popularCities.slice(0, 6) : availableCities.slice(0, 6);
    }
    // Most sought-after rental cities across Algeria
    return ['Hydra', 'Bab Ezzouar', 'Dely Ibrahim', 'Canastel', 'Akid Lotfi', 'Cheraga', 'Kouba'];
  }, [filters.wilaya, availableCities]);

  // Room options (F1 - F5+)
  const roomOptions = [
    { id: 'all', label: 'Tous', description: 'Toutes surfaces' },
    { id: '1', label: '1 ch', sublabel: 'Studio / F1' },
    { id: '2', label: '2 ch', sublabel: 'F2' },
    { id: '3', label: '3 ch', sublabel: 'F3' },
    { id: '4', label: '4 ch', sublabel: 'F4' },
    { id: '5+', label: '5+ ch', sublabel: 'F5 ou plus' },
  ];

  // Count matching properties by type
  const countByType = (typeId: string) => {
    if (typeId === 'all') return properties.filter(p => p.status === 'active').length;
    if (typeId === 'student') return properties.filter(p => p.status === 'active' && (p.isStudentFriendly || p.propertyType === 'student')).length;
    return properties.filter(p => p.status === 'active' && p.propertyType === typeId).length;
  };

  // Determine active filter count
  const activeFiltersCount = [
    filters.propertyType !== 'all',
    filters.rooms !== 'all',
    filters.minPrice > 0,
    filters.maxPrice < 300000 && filters.maxPrice > 0,
    filters.wilaya !== 'all',
    filters.city !== 'all' && Boolean(filters.city),
    filters.isFurnished !== null,
    filters.isStudentFriendly !== null,
    filters.isAvailableNow !== null,
    Boolean(filters.searchQuery.trim())
  ].filter(Boolean).length;

  // Handle Wilaya change & reset city if needed
  const handleWilayaChange = (newWilaya: string) => {
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

  // Handle price preset click
  const handlePricePreset = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
  };

  // Check if current min/max matches a preset
  const isPresetActive = (min: number, max: number) => {
    const isCurrentMaxUnlimited = (filters.maxPrice >= 300000 || filters.maxPrice === 0);
    const isPresetMaxUnlimited = max >= 300000;
    if (isPresetMaxUnlimited && isCurrentMaxUnlimited) {
      return filters.minPrice === min;
    }
    return filters.minPrice === min && filters.maxPrice === max;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs mb-8 overflow-hidden transition-all duration-200">
      
      {/* SECTION 1: SEARCH & QUICK CONTROLS BAR (Search, Wilaya, City, Sort, Expand) */}
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          
          {/* Search Query Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              placeholder="Rechercher par mot-clé, quartier ou référence (ex: Hydra, Canastel, Bab Ezzouar)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 transition-colors"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => updateFilter('searchQuery', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="Effacer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Wilaya Selection */}
          <div className="relative min-w-[170px] sm:min-w-[180px]">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.wilaya}
              onChange={(e) => handleWilayaChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 appearance-none focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer transition-colors"
              title="Filtrer par Wilaya"
            >
              <option value="all">Toutes les wilayas</option>
              {ALGERIAN_WILAYAS.map(w => (
                <option key={w.code} value={w.name}>
                  {w.code} - {w.name} ({w.arName})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* City / Commune Selection */}
          <div className="relative min-w-[160px] sm:min-w-[175px]">
            <Navigation className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.city}
              onChange={(e) => updateFilter('city', e.target.value)}
              className={`w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm font-bold appearance-none focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer transition-colors ${
                filters.city !== 'all' && filters.city ? 'border-slate-900 text-slate-900 bg-slate-100/60' : 'border-slate-200 text-slate-800'
              }`}
              title="Filtrer par Ville ou Commune"
            >
              <option value="all">Toutes les villes</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Menu déroulant de tri */}
          <div className="relative min-w-[160px] sm:min-w-[175px]">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="filterbar-sort-select"
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 appearance-none focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer transition-colors"
              title="Trier les annonces"
            >
              <option value="newest">Les plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="surface_desc">Superficie décroissante</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Expand / Collapse Advanced Filters Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
              isExpanded || activeFiltersCount > 0
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-slate-900 text-[10px] font-extrabold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400 ml-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* SECTION 2: ADVANCED FILTERING PANEL (Type, Ville / Communes, Fourchette de Prix, Chambres) */}
      {isExpanded && (
        <div className="p-5 sm:p-6 bg-slate-50/50 space-y-6 animate-fadeIn">
          
          {/* 1. FILTER BY PROPERTY TYPE (Appartement, Villa, Studio, Duplex, Étudiant) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Type de bien (Appartement, Villa, Studio...)</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-500">
                {filters.propertyType === 'all' 
                  ? 'Tous les types de biens' 
                  : propertyTypes.find(t => t.id === filters.propertyType)?.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {propertyTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = filters.propertyType === type.id;
                const count = countByType(type.id);

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => updateFilter('propertyType', type.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold truncate">{type.label}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. FILTER BY LOCATION / VILLE & COMMUNES RAPIDES */}
          <div className="pt-5 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-slate-500" />
                <span>Localisation : Ville / Commune</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-500">
                {filters.city === 'all' || !filters.city ? 'Toutes les villes' : `Ville sélectionnée : ${filters.city}`}
              </span>
            </div>

            {/* Quick Popular City Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Villes populaires :</span>
              <button
                type="button"
                onClick={() => updateFilter('city', 'all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  filters.city === 'all' || !filters.city
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                Toutes les villes
              </button>
              {popularCityChips.map(cityName => {
                const isActive = filters.city.toLowerCase() === cityName.toLowerCase();
                return (
                  <button
                    key={cityName}
                    type="button"
                    onClick={() => updateFilter('city', isActive ? 'all' : cityName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cityName}</span>
                    {isActive && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. FILTER BY PRICE RANGE / FOURCHETTE DE PRIX (DZD) */}
          <div className="pt-5 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-500" />
                <span>Fourchette de prix (Loyer mensuel en DZD)</span>
              </label>
              <div className="text-xs font-bold text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                {filters.minPrice > 0 ? formatPriceOnly(filters.minPrice) : '0 DA'}
                {' - '}
                {filters.maxPrice >= 300000 || filters.maxPrice === 0 
                  ? 'Illimité' 
                  : formatPriceOnly(filters.maxPrice)}
              </div>
            </div>

            {/* Price Presets */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Paliers rapides :</span>
              {PRICE_PRESETS.map((preset, idx) => {
                const active = isPresetActive(preset.min, preset.max);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePricePreset(preset.min, preset.max)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      active
                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Min / Max Inputs and Range Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Min Price Input */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                  <span>Prix minimum (DA)</span>
                  <span className="text-slate-900 font-extrabold">
                    {filters.minPrice > 0 ? formatPriceOnly(filters.minPrice) : '0 DA'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={250000}
                    step={5000}
                    value={filters.minPrice === 0 ? '' : filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white outline-none focus:border-slate-400"
                  />
                  <span className="text-xs font-semibold text-slate-400">DA</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={150000}
                  step={5000}
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
                  className="w-full mt-3 accent-slate-900 cursor-pointer"
                />
              </div>

              {/* Max Price Input */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                  <span>Prix maximum (DA)</span>
                  <span className="text-slate-900 font-extrabold">
                    {filters.maxPrice >= 300000 || filters.maxPrice === 0 
                      ? 'Illimité (300 000+ DA)' 
                      : formatPriceOnly(filters.maxPrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={15000}
                    max={300000}
                    step={5000}
                    value={filters.maxPrice >= 300000 ? '' : filters.maxPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateFilter('maxPrice', val > 0 ? val : 300000);
                    }}
                    placeholder="Illimité"
                    className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white outline-none focus:border-slate-400"
                  />
                  <span className="text-xs font-semibold text-slate-400">DA</span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={300000}
                  step={5000}
                  value={filters.maxPrice >= 300000 ? 300000 : filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                  className="w-full mt-3 accent-slate-900 cursor-pointer"
                />
              </div>

            </div>
          </div>

          {/* 4. FILTER BY NUMBER OF ROOMS / CHAMBRES (F1, F2, F3, F4, F5+) */}
          <div className="pt-5 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-slate-500" />
                <span>Nombre de pièces / Chambres</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                {filters.rooms === 'all' ? 'Toutes configurations' : filters.rooms === '5+' ? '5 pièces et plus' : `${filters.rooms} pièce(s) / F${filters.rooms}`}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {roomOptions.map((room) => {
                const isSelected = filters.rooms === room.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => updateFilter('rooms', room.id)}
                    className={`py-2.5 px-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-extrabold">{room.label}</span>
                    <span className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {room.sublabel || room.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. COMPLEMENTARY CRITERIA (Furnished, Student, Immediate) */}
          <div className="pt-5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Ameublement :
              </span>
              
              <div className="inline-flex rounded-xl p-1 bg-white border border-slate-200">
                <button
                  type="button"
                  onClick={() => updateFilter('isFurnished', null)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    filters.isFurnished === null 
                      ? 'bg-slate-900 text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tous
                </button>
                <button
                  type="button"
                  onClick={() => updateFilter('isFurnished', true)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    filters.isFurnished === true 
                      ? 'bg-slate-900 text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Meublé
                </button>
                <button
                  type="button"
                  onClick={() => updateFilter('isFurnished', false)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    filters.isFurnished === false 
                      ? 'bg-slate-900 text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Non meublé
                </button>
              </div>
            </div>

            {/* Quick check pill toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateFilter('isStudentFriendly', filters.isStudentFriendly === true ? null : true)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  filters.isStudentFriendly === true
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Logement étudiant</span>
                {filters.isStudentFriendly === true && <Check className="w-3 h-3 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => updateFilter('isAvailableNow', filters.isAvailableNow === true ? null : true)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  filters.isAvailableNow === true
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Disponible immédiatement</span>
                {filters.isAvailableNow === true && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* SECTION 3: BOTTOM STATUS BAR (Matching Results, Active Filter Tags & Reset) */}
      <div className="px-5 py-3.5 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Results Counter & Active Tag Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-extrabold text-slate-900">
            {matchingCount} {matchingCount > 1 ? 'biens trouvés' : 'bien trouvé'}
          </span>
          <span className="text-slate-400">sur {totalCount} au total</span>

          {/* Active filter badges with instant clear */}
          {filters.propertyType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
              Type: {propertyTypes.find(t => t.id === filters.propertyType)?.label}
              <button 
                type="button"
                onClick={() => updateFilter('propertyType', 'all')}
                className="hover:text-slate-950 p-0.5"
                title="Supprimer ce filtre"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.wilaya !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
              Wilaya: {filters.wilaya}
              <button 
                type="button"
                onClick={() => handleWilayaChange('all')}
                className="hover:text-slate-950 p-0.5"
                title="Supprimer ce filtre"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.city !== 'all' && Boolean(filters.city) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
              Ville: {filters.city}
              <button 
                type="button"
                onClick={() => updateFilter('city', 'all')}
                className="hover:text-slate-950 p-0.5"
                title="Supprimer ce filtre"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(filters.minPrice > 0 || (filters.maxPrice < 300000 && filters.maxPrice > 0)) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
              Prix: {filters.minPrice > 0 ? `${formatPriceOnly(filters.minPrice)}` : '0 DA'} - {filters.maxPrice >= 300000 ? 'Illimité' : formatPriceOnly(filters.maxPrice)}
              <button 
                type="button"
                onClick={() => {
                  updateFilter('minPrice', 0);
                  updateFilter('maxPrice', 300000);
                }}
                className="hover:text-slate-950 p-0.5"
                title="Supprimer ce filtre"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.rooms !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
              {filters.rooms === '5+' ? '5+ pièces' : `F${filters.rooms}`}
              <button 
                type="button"
                onClick={() => updateFilter('rooms', 'all')}
                className="hover:text-slate-950 p-0.5"
                title="Supprimer ce filtre"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.isFurnished !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
              {filters.isFurnished ? 'Meublé' : 'Non meublé'}
              <button 
                type="button"
                onClick={() => updateFilter('isFurnished', null)}
                className="hover:text-slate-950 p-0.5"
                title="Supprimer ce filtre"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.isStudentFriendly !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
              Étudiant
              <button 
                type="button"
                onClick={() => updateFilter('isStudentFriendly', null)}
                className="hover:text-slate-950 p-0.5"
                title="Supprimer ce filtre"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {/* Clear All & Sort / View Controls */}
        <div className="flex items-center gap-3 ml-auto">
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser les critères</span>
            </button>
          )}

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-slate-400 font-medium hidden sm:inline">Trier :</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="newest">Les plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="surface_desc">Superficie décroissante</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
};
