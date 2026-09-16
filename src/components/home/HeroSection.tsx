import React, { useState } from 'react';
import { Search, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALGERIAN_WILAYAS } from '../../data/algerianCities';

export const HeroSection: React.FC = () => {
  const { navigateTo } = useApp();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [priceBudget, setPriceBudget] = useState<string>('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();

    let minPrice = 0;
    let maxPrice = 300000;

    if (priceBudget === 'under_30k') {
      minPrice = 0;
      maxPrice = 30000;
    } else if (priceBudget === '30k_60k') {
      minPrice = 30000;
      maxPrice = 60000;
    } else if (priceBudget === '60k_100k') {
      minPrice = 60000;
      maxPrice = 100000;
    } else if (priceBudget === 'over_100k') {
      minPrice = 100000;
      maxPrice = 500000;
    }

    navigateTo('browse', null, {
      propertyType: selectedType,
      wilaya: selectedWilaya,
      minPrice,
      maxPrice
    });
  };

  return (
    <div className="relative bg-slate-950 text-white pt-14 pb-20 lg:pt-24 lg:pb-32 overflow-hidden border-b border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Headline & Intro */}
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Plateforme de location immobilière vérifiée en Algérie</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Trouvez votre prochain logement en Algérie.
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Appartements, villas, studios et logements étudiants à Alger, Oran, Blida, Constantine et dans les 48 wilayas. Contact direct avec les bailleurs et agences agréées.
          </p>
        </div>

        {/* Hero Search Box */}
        <div className="mt-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200 text-slate-900">
            
            {/* Quick Type Tabs - Crisp Monochrome */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 sm:pb-3 border-b border-slate-100 no-scrollbar">
              {[
                { id: 'all', label: 'Tous les biens' },
                { id: 'apartment', label: 'Appartements (F1-F5)' },
                { id: 'student', label: 'Logement Étudiant' },
                { id: 'villa', label: 'Villas & Maisons' },
                { id: 'duplex', label: 'Duplex' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedType === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filter Fields Form */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-2.5 pt-3 items-center">
              
              {/* Wilaya / City Field */}
              <div className="lg:col-span-5 bg-slate-50 hover:bg-slate-100/70 transition-colors rounded-xl p-2.5 border border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  Wilaya ou Ville
                </label>
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                  id="hero-wilaya-select"
                >
                  <option value="all">Toutes les wilayas (48 Wilayas)</option>
                  <option value="Alger">16 - Alger (Alger-Centre, Hydra, Bab Ezzouar...)</option>
                  <option value="Oran">31 - Oran (Akid Lotfi, Canastel, Centre...)</option>
                  <option value="Blida">09 - Blida (Centre, Ouled Yaïch...)</option>
                  <option value="Constantine">25 - Constantine (Ali Mendjeli...)</option>
                  <option value="Chlef">02 - Chlef (Centre, Hay Es Salem...)</option>
                  <option value="Béjaïa">06 - Béjaïa (Targa Ouzemour, Iheddadene...)</option>
                  <option value="Sétif">19 - Sétif (Centre, Bel Air...)</option>
                  <option value="Tizi Ouzou">15 - Tizi Ouzou (Nouvelle Ville...)</option>
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w.code} value={w.name}>
                      {w.code} - {w.name} ({w.arName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div className="lg:col-span-4 bg-slate-50 hover:bg-slate-100/70 transition-colors rounded-xl p-2.5 border border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Budget mensuel (DZD)
                </label>
                <select
                  value={priceBudget}
                  onChange={(e) => setPriceBudget(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                  id="hero-budget-select"
                >
                  <option value="all">Tout budget</option>
                  <option value="under_30k">Moins de 30 000 DZD / mois</option>
                  <option value="30k_60k">30 000 à 60 000 DZD / mois</option>
                  <option value="60k_100k">60 000 à 100 000 DZD / mois</option>
                  <option value="over_100k">Plus de 100 000 DZD / mois</option>
                </select>
              </div>

              {/* Search Submit Button */}
              <div className="lg:col-span-3">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                  id="hero-search-submit"
                >
                  <Search className="w-4 h-4 text-slate-300" />
                  <span>Rechercher</span>
                </button>
              </div>

            </form>
          </div>

          {/* Micro trust indicators */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
              Annonces vérifiées
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
              Prix affichés en Dinars Algériens (DZD)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
              Contact direct propriétaire sans frais
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
