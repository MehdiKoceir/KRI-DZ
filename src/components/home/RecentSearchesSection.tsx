import React from 'react';
import { 
  History, 
  Search, 
  MapPin, 
  Building2, 
  Home, 
  Layers, 
  GraduationCap, 
  ArrowUpRight, 
  X, 
  Trash2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RecentSearch, FilterState } from '../../types';

export const RecentSearchesSection: React.FC = () => {
  const { 
    recentSearches, 
    removeRecentSearch, 
    clearRecentSearches, 
    navigateTo, 
    properties,
    addRecentSearch 
  } = useApp();

  // Calculate live matching listings for any filter combination
  const getMatchCount = (searchFilters: Partial<FilterState>) => {
    return properties.filter(prop => {
      if (prop.status !== 'active') return false;

      if (searchFilters.searchQuery && searchFilters.searchQuery.trim()) {
        const q = searchFilters.searchQuery.toLowerCase();
        const matchText = `${prop.title} ${prop.description} ${prop.city} ${prop.wilayaName} ${prop.neighborhood}`.toLowerCase();
        if (!matchText.includes(q)) return false;
      }

      if (searchFilters.wilaya && searchFilters.wilaya !== 'all') {
        if (!prop.wilayaName.toLowerCase().includes(searchFilters.wilaya.toLowerCase())) {
          return false;
        }
      }

      if (searchFilters.city && searchFilters.city !== 'all' && searchFilters.city.trim()) {
        const targetCity = searchFilters.city.toLowerCase().trim();
        const propCity = prop.city.toLowerCase().trim();
        const propNeighborhood = prop.neighborhood.toLowerCase().trim();
        if (!propCity.includes(targetCity) && !propNeighborhood.includes(targetCity)) {
          return false;
        }
      }

      if (searchFilters.propertyType && searchFilters.propertyType !== 'all') {
        if (searchFilters.propertyType === 'student') {
          if (!prop.isStudentFriendly && prop.propertyType !== 'student') return false;
        } else if (prop.propertyType !== searchFilters.propertyType) {
          return false;
        }
      }

      if (searchFilters.minPrice && prop.pricePerMonthDZD < searchFilters.minPrice) {
        return false;
      }

      if (searchFilters.maxPrice && searchFilters.maxPrice < 300000 && prop.pricePerMonthDZD > searchFilters.maxPrice) {
        return false;
      }

      if (searchFilters.rooms && searchFilters.rooms !== 'all') {
        if (searchFilters.rooms === '5+') {
          if (prop.rooms < 5) return false;
        } else {
          if (prop.rooms !== parseInt(searchFilters.rooms)) return false;
        }
      }

      return true;
    }).length;
  };

  const getSearchIcon = (item: RecentSearch) => {
    const type = item.filters.propertyType;
    if (type === 'apartment') return Building2;
    if (type === 'villa') return Home;
    if (type === 'studio') return Layers;
    if (type === 'student' || item.filters.isStudentFriendly) return GraduationCap;
    if (item.filters.searchQuery) return Search;
    return MapPin;
  };

  const formatRelativeTime = (timestamp: number) => {
    const diffMinutes = Math.floor((Date.now() - timestamp) / 60000);
    if (diffMinutes < 1) return "À l'instant";
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays} j`;
  };

  const handleApplySearch = (item: RecentSearch) => {
    navigateTo('browse', null, item.filters);
  };

  // Popular suggested searches when list is empty
  const SUGGESTED_SEARCHES = [
    {
      label: 'Appartements à Alger (Hydra)',
      details: 'Quartier résidentiel · F3 / F4',
      filters: { wilaya: 'Alger', city: 'Hydra', propertyType: 'apartment' }
    },
    {
      label: 'Studios étudiants · Bab Ezzouar',
      details: 'Proche pôles universitaires · < 35 000 DA',
      filters: { wilaya: 'Alger', city: 'Bab Ezzouar', propertyType: 'studio', isStudentFriendly: true, maxPrice: 35000 }
    },
    {
      label: 'Villas vue mer à Oran (Canastel)',
      details: 'Espaces extérieurs · Garage',
      filters: { wilaya: 'Oran', city: 'Canastel', propertyType: 'villa' }
    },
    {
      label: 'Locations meublées à Blida',
      details: 'Centre-ville · Prêt à emménager',
      filters: { wilaya: 'Blida', isFurnished: true }
    }
  ];

  return (
    <section className="py-10 sm:py-14 bg-slate-50/70 border-b border-slate-200" id="recent-searches-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full mb-2.5 shadow-2xs">
              <History className="w-3.5 h-3.5 text-slate-900" />
              <span>Historique local de recherche</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Vos recherches récentes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Reprenez vos recherches là où vous vous étiez arrêté et découvrez les nouveaux biens disponibles.
            </p>
          </div>

          {recentSearches.length > 0 && (
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {recentSearches.length} {recentSearches.length > 1 ? 'recherches mémorisées' : 'recherche mémorisée'}
              </span>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                title="Effacer tout l'historique des recherches"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                <span>Effacer tout</span>
              </button>
            </div>
          )}
        </div>

        {/* Recent Search Cards */}
        {recentSearches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentSearches.map((item) => {
              const Icon = getSearchIcon(item);
              const matchCount = getMatchCount(item.filters);

              return (
                <div
                  key={item.id}
                  onClick={() => handleApplySearch(item)}
                  className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(item.id);
                    }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors opacity-80 group-hover:opacity-100"
                    title="Supprimer cette recherche"
                    aria-label="Supprimer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    {/* Icon and Timestamp */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>

                    {/* Search Title */}
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-slate-950 line-clamp-1 pr-6 tracking-tight">
                      {item.label}
                    </h3>

                    {/* Details subtitle */}
                    {item.details && (
                      <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">
                        {item.details}
                      </p>
                    )}
                  </div>

                  {/* Footer with Match Count and Action Arrow */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                      {matchCount > 0 ? (
                        <span>{matchCount} {matchCount > 1 ? 'biens disponibles' : 'bien disponible'}</span>
                      ) : (
                        <span className="text-slate-400">Consulter les annonces</span>
                      )}
                    </span>

                    <span className="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-slate-900 text-slate-500 group-hover:text-white flex items-center justify-center transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State with Quick Suggestions */
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Aucune recherche récente enregistrée
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
              Vos prochaines recherches s'afficheront ici automatiquement pour vous permettre de reprendre votre navigation en un instant.
            </p>

            <div className="text-left pt-4 border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                <span>Suggestions rapides populaires :</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_SEARCHES.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      addRecentSearch({ label: sug.label, details: sug.details, filters: sug.filters });
                      navigateTo('browse', null, sug.filters);
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white text-left transition-all group flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-slate-950">
                        {sug.label}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {sug.details}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
