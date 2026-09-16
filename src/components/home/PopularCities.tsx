import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { ALGERIAN_WILAYAS } from '../../data/algerianCities';
import { useApp } from '../../context/AppContext';

export const PopularCities: React.FC = () => {
  const { navigateTo, properties } = useApp();

  const getListingCount = (wilayaName: string) => {
    return properties.filter(p => p.wilayaName.toLowerCase().includes(wilayaName.toLowerCase())).length;
  };

  const handleCityClick = (wilayaName: string) => {
    navigateTo('browse', null, { wilaya: wilayaName });
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            Wilayas populaires
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explorez les wilayas les plus demandées
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Trouvez rapidement votre futur logement à Alger, Oran, Blida, Constantine et dans toute l’Algérie.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ALGERIAN_WILAYAS.slice(0, 4).map(wilaya => {
            const count = getListingCount(wilaya.name);
            return (
              <div
                key={wilaya.code}
                onClick={() => handleCityClick(wilaya.name)}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300"
                id={`city-card-${wilaya.code}`}
              >
                <img
                  src={wilaya.image}
                  alt={wilaya.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                {/* Wilaya badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
                    {wilaya.code} - {wilaya.arName}
                  </span>
                </div>

                {/* Arrow Icon */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold tracking-tight">
                    {wilaya.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center justify-between">
                    <span>{wilaya.popularCities.slice(0, 2).join(', ')}</span>
                    <span className="font-semibold text-white">{count > 0 ? `${count} annonces` : 'Consulter'}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Pill Row for other wilayas */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {ALGERIAN_WILAYAS.slice(4).map(wilaya => (
            <button
              key={wilaya.code}
              onClick={() => handleCityClick(wilaya.name)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="text-slate-400 font-mono text-[11px]">{wilaya.code}</span>
              <span>{wilaya.name}</span>
              <span className="text-slate-400 font-normal text-[11px]">({wilaya.arName})</span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
