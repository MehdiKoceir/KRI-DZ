import React from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CtaBanner: React.FC = () => {
  const { navigateTo, setAuthMode, user } = useApp();

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
          Prêt à trouver votre prochain logement ?
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Rejoignez locataires et bailleurs à travers l’Algérie. Parcourez les annonces vérifiées ou publiez votre bien en quelques clics.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigateTo('browse')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 shadow-sm transition-all flex items-center justify-center gap-2"
            id="cta-browse-btn"
          >
            <Search className="w-4 h-4 text-slate-700" />
            <span>Consulter les annonces</span>
          </button>

          <button
            onClick={() => {
              if (user?.role === 'owner' || user?.role === 'agency') {
                navigateTo('owner-dashboard');
              } else {
                setAuthMode('signup', 'owner');
              }
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            id="cta-list-property-btn"
          >
            <PlusCircle className="w-4 h-4 text-slate-300" />
            <span>Déposer une annonce propriétaire</span>
          </button>
        </div>
      </div>
    </section>
  );
};
