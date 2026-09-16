import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const HowItWorks: React.FC = () => {
  const { navigateTo, setAuthMode } = useApp();
  const [activeTab, setActiveTab] = useState<'tenant' | 'owner'>('tenant');

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comment ça marche ?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Que vous cherchiez un toit ou que vous soyez bailleur, KriDZ simplifie chaque étape.
          </p>

          {/* Toggle pill */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-200">
            <button
              onClick={() => setActiveTab('tenant')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'tenant'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Je cherche un logement
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'owner'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Je suis propriétaire / agence
            </button>
          </div>
        </div>

        {activeTab === 'tenant' ? (
          /* Tenant steps */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Explorez selon vos critères
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Filtrez par wilaya, quartier, budget en DZD, présence de meuble, ou proximité des universités en quelques clics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Échangez en direct
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Contactez le bailleur immédiatement par WhatsApp, appel téléphonique direct ou message sans barrières.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Visitez et emménagez
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Prenez rendez-vous pour visiter le bien sur place, convenez des modalités du bail et installez-vous sereinement.
              </p>
            </div>
          </div>
        ) : (
          /* Owner steps */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Déposez votre annonce
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Renseignez les photos, le loyer en DZD, l'emplacement et les équipements (bâche à eau, clim, stationnement).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Recevez des contacts qualifiés
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Les candidats sérieux vous contactent directement sur WhatsApp ou vous soumettent leur profil avec dossier.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Louez en toute tranquillité
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Finalisez votre contrat de location (notarié ou sous seing privé) avec le locataire idéal et gérez vos biens.
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          {activeTab === 'tenant' ? (
            <button
              onClick={() => navigateTo('browse')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all"
            >
              Parcourir les annonces disponibles
            </button>
          ) : (
            <button
              onClick={() => setAuthMode('signup', 'owner')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all"
            >
              Créer un compte bailleur gratuit
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
