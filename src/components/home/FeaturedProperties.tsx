import React, { useState } from 'react';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from '../common/PropertyCard';

export const FeaturedProperties: React.FC = () => {
  const { properties, navigateTo } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'apartment' | 'student' | 'villa'>('all');

  const activeProperties = properties.filter(p => p.status === 'active');

  const filteredList = activeProperties
    .filter(p => {
      if (filterType === 'all') return true;
      if (filterType === 'student') return p.isStudentFriendly;
      return p.propertyType === filterType;
    })
    .slice(0, 6);

  // Quick counts
  const algerCount = activeProperties.filter(p => p.wilayaName.includes('Alger')).length;
  const oranCount = activeProperties.filter(p => p.wilayaName.includes('Oran')).length;
  const blidaCount = activeProperties.filter(p => p.wilayaName.includes('Blida')).length;

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Logements disponibles immédiatement</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Dernières annonces vérifiées
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
              <span>{activeProperties.length} biens en ligne actuellement :</span>
              <button
                onClick={() => navigateTo('browse', null, { wilaya: 'Alger' })}
                className="font-medium text-slate-700 hover:text-slate-950 underline underline-offset-2"
              >
                Alger ({algerCount})
              </button>
              <span>•</span>
              <button
                onClick={() => navigateTo('browse', null, { wilaya: 'Oran' })}
                className="font-medium text-slate-700 hover:text-slate-950 underline underline-offset-2"
              >
                Oran ({oranCount})
              </button>
              <span>•</span>
              <button
                onClick={() => navigateTo('browse', null, { wilaya: 'Blida' })}
                className="font-medium text-slate-700 hover:text-slate-950 underline underline-offset-2"
              >
                Blida ({blidaCount})
              </button>
            </div>
          </div>

          {/* Quick Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl self-start md:self-auto">
            {[
              { id: 'all', label: 'Tous les biens' },
              { id: 'apartment', label: 'Appartements' },
              { id: 'student', label: 'Étudiants' },
              { id: 'villa', label: 'Villas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map(property => (
            <PropertyCard key={property.id} property={property} layout="grid" />
          ))}
        </div>

        {/* Bottom CTA to browse all */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigateTo('browse')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all group cursor-pointer"
            id="featured-browse-all-btn"
          >
            <span>Voir toutes les annonces avec filtres complets ({activeProperties.length})</span>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
