import React from 'react';
import { PlusCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CtaBanner: React.FC = () => {
  const { navigateTo, setAuthMode, user } = useApp();

  return (
    <section className="py-10 sm:py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Espace Bailleurs & Agences</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Vous avez un logement à louer en Algérie ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
              Publiez votre appartement ou villa gratuitement et recevez directement les demandes de locataires sérieux par téléphone ou WhatsApp.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                if (user?.role === 'owner' || user?.role === 'agency') {
                  navigateTo('owner-dashboard');
                } else {
                  setAuthMode('signup', 'owner');
                }
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="cta-list-property-btn"
            >
              <PlusCircle className="w-4 h-4 text-slate-300" />
              <span>Déposer une annonce gratuite</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
