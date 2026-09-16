import React from 'react';
import { MessageSquareText, Droplets, ShieldCheck, Banknote } from 'lucide-react';

export const WhyChooseKriDZ: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 mb-3">
            <span>Adapté au marché algérien</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pourquoi choisir KriDZ ?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Une expérience de location claire, directe et sans mauvaises surprises.
          </p>
        </div>

        {/* Feature Cards Grid - Refined Minimalist Slate */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 hover:border-slate-400 hover:bg-white transition-all">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center mb-4 shadow-xs">
              <MessageSquareText className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Contact direct propriétaire
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Discutez directement avec le bailleur sur WhatsApp ou par téléphone, sans barrière inutile.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 hover:border-slate-400 hover:bg-white transition-all">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center mb-4 shadow-xs">
              <Droplets className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Bâche à eau & citernes
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              L'alimentation en eau est essentielle : chaque annonce précise la présence de citerne ou suppresseur.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 hover:border-slate-400 hover:bg-white transition-all">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center mb-4 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Annonces vérifiées
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Élimination des doublons et modération proactive des offres avec photos et prix réels.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 hover:border-slate-400 hover:bg-white transition-all">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center mb-4 shadow-xs">
              <Banknote className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Gratuit pour locataires
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Recherche et prise de contact 100% gratuites. Prix transparents affichés en Dinar Algérien (DZD).
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
