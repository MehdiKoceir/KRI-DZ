import React, { useState } from 'react';
import { Search, MapPin, Building, GraduationCap, Home, Sparkles, CheckCircle2, History, ArrowUpRight, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALGERIAN_WILAYAS } from '../../data/algerianCities';

export const HeroSection: React.FC = () => {
  const { navigateTo, recentSearches, properties } = useApp();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [priceBudget, setPriceBudget] = useState<string>('all');

  const activeCount = properties.filter(p => p.status === 'active').length;

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();

    let minPrice = 0;
    let maxPrice = 300000;

    if (priceBudget === 'under_30k') {
      minPrice = 0;
      maxPrice = 30000;
    } else if (priceBudget === '30k_50k') {
      minPrice = 30000;
      maxPrice = 50000;
    } else if (priceBudget === '50k_80k') {
      minPrice = 50000;
      maxPrice = 80000;
    } else if (priceBudget === '80k_120k') {
      minPrice = 80000;
      maxPrice = 120000;
    } else if (priceBudget === 'over_120k') {
      minPrice = 120000;
      maxPrice = 500000;
    }

    navigateTo('browse', null, {
      propertyType: selectedType,
      wilaya: selectedWilaya,
      minPrice,
      maxPrice
    });
  };

  const quickNeeds = [
    { label: '📍 Alger (Hydra, Kouba, Bab Ezzouar)', filter: { wilaya: 'Alger' } },
    { label: '📍 Oran (Akid Lotfi, Canastel)', filter: { wilaya: 'Oran' } },
    { label: '📍 Blida & Mitidja', filter: { wilaya: 'Blida' } },
    { label: '🎓 Étudiants (< 35 000 DA)', filter: { isStudentFriendly: true, maxPrice: 35000 } },
    { label: '🛋️ Appartements Meublés', filter: { isFurnished: true } },
    { label: '💰 Moins de 50 000 DA / mois', filter: { maxPrice: 50000 } },
    { label: '🏡 Villas & Duplex', filter: { propertyType: 'villa' } },
  ];

  return (
    <div className="relative bg-white text-slate-900 pt-8 pb-12 lg:pt-14 lg:pb-16 border-b border-slate-200">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Headline & Intro */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeCount} logements vérifiés disponibles en Algérie</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Trouvez votre logement rapidement.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto">
            Accès direct aux appartements, studios et logements étudiants à Alger, Oran, Blida, Constantine et dans toute l’Algérie.
          </p>
        </div>

        {/* Hero Search Box */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 text-slate-900">
            
            {/* Quick Type Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 border-b border-slate-100 no-scrollbar">
              {[
                { id: 'all', label: 'Tous les biens' },
                { id: 'apartment', label: '🏢 Appartements (F1-F5)' },
                { id: 'student', label: '🎓 Étudiants' },
                { id: 'villa', label: '🏡 Villas & Maisons' },
                { id: 'duplex', label: '🏰 Duplex' }
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
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-2.5 pt-3.5 items-center">
              
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
                  <option value="Alger">16 - Alger (Hydra, Bab Ezzouar, Kouba...)</option>
                  <option value="Oran">31 - Oran (Akid Lotfi, Canastel, Centre...)</option>
                  <option value="Blida">09 - Blida (Centre, Ouled Yaïch...)</option>
                  <option value="Constantine">25 - Constantine (Ali Mendjeli...)</option>
                  <option value="Chlef">02 - Chlef (Centre, Hay Es Salem...)</option>
                  <option value="Béjaïa">06 - Béjaïa (Targa Ouzemour...)</option>
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
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-slate-500" />
                  Budget mensuel (DZD)
                </label>
                <select
                  value={priceBudget}
                  onChange={(e) => setPriceBudget(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                  id="hero-budget-select"
                >
                  <option value="all">Tout budget</option>
                  <option value="under_30k">Moins de 30 000 DA / mois</option>
                  <option value="30k_50k">30 000 à 50 000 DA / mois</option>
                  <option value="50k_80k">50 000 à 80 000 DA / mois</option>
                  <option value="80k_120k">80 000 à 120 000 DA / mois</option>
                  <option value="over_120k">Plus de 120 000 DA / mois</option>
                </select>
              </div>

              {/* Search Submit Button */}
              <div className="lg:col-span-3">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="hero-search-submit"
                >
                  <Search className="w-4 h-4 text-slate-300" />
                  <span>Trouver un logement</span>
                </button>
              </div>

            </form>

            {/* Quick 1-Click Access for Common Needs */}
            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Besoins fréquents (1 clic pour voir directement) :</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {quickNeeds.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigateTo('browse', null, item.filter)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 font-medium transition-colors text-xs cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches if any */}
            {recentSearches.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                  <History className="w-3 h-3 text-slate-500" />
                  <span>Historique :</span>
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {recentSearches.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateTo('browse', null, item.filters)}
                      className="px-2 py-0.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-[11px] font-medium transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Direct Trust Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Prix affichés en Dinars (DZD)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Contact direct propriétaire sans intermédiaire imposé
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Annonces avec photos et localisation
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
