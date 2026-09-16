import React from 'react';
import { GraduationCap, ArrowRight, Wifi, Droplets, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from '../common/PropertyCard';

export const StudentHousingSection: React.FC = () => {
  const { properties, navigateTo } = useApp();

  const studentListings = properties
    .filter(p => p.isStudentFriendly || p.propertyType === 'student')
    .slice(0, 3);

  const handleExploreStudents = () => {
    navigateTo('browse', null, { propertyType: 'student', isStudentFriendly: true });
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block with Algerian Campus Badges */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
              <span>Logements pour étudiants</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              Biens proches des universités
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed">
              Studios et colocations à proximité des pôles universitaires (USTHB, Saad Dahlab, Ben Aknoun...).
            </p>

            {/* University Tags - Clean subtle pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="text-xs bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                USTHB Bab Ezzouar
              </span>
              <span className="text-xs bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                Univ. Saad Dahlab Blida
              </span>
              <span className="text-xs bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                Ben Aknoun / Dely Ibrahim
              </span>
              <span className="text-xs bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                USTO Oran
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleExploreStudents}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all group"
              id="student-explore-btn"
            >
              <span>Voir les logements étudiants</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Benefits for students in Algeria - Clean border cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <Droplets className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Réserve d'eau</p>
              <p className="text-slate-500 mt-0.5">Biens équipés de citernes ou bâches à eau pour réviser l'esprit tranquille.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <Wifi className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Fibre & Bureau</p>
              <p className="text-slate-500 mt-0.5">Espaces de travail adaptés et connexion internet haut débit.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Prix modérés</p>
              <p className="text-slate-500 mt-0.5">Offres adaptées aux étudiants à partir de 18 000 DZD par mois.</p>
            </div>
          </div>
        </div>

        {/* Student Property Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentListings.map(property => (
            <PropertyCard key={property.id} property={property} layout="grid" />
          ))}
        </div>

      </div>
    </section>
  );
};
