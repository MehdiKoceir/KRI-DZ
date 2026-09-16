import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from '../common/PropertyCard';

export const FeaturedProperties: React.FC = () => {
  const { properties, navigateTo } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'apartment' | 'student' | 'villa'>('all');

  const featuredList = properties
    .filter(p => p.status === 'active')
    .filter(p => {
      if (filterType === 'all') return true;
      if (filterType === 'student') return p.isStudentFriendly;
      return p.propertyType === filterType;
    })
    .slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              Sélection du moment
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Biens récents en Algérie
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Annonces vérifiées à Alger, Oran, Blida et environs.
            </p>
          </div>

          {/* Quick Filter tabs - Crisp monochrome */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl self-start md:self-auto">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'apartment', label: 'Appartements' },
              { id: 'student', label: 'Étudiants' },
              { id: 'villa', label: 'Villas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
          {featuredList.map(property => (
            <PropertyCard key={property.id} property={property} layout="grid" />
          ))}
        </div>

        {/* Bottom CTA to browse all */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateTo('browse')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-bold text-sm shadow-xs hover:shadow-sm transition-all group"
            id="featured-browse-all-btn"
          >
            <span>Explorer toutes les annonces disponibles</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
