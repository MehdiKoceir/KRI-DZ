import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TrustedPartners: React.FC = () => {
  const partners = [
    {
      name: 'El Bahdja Immobilier Agréé',
      wilaya: 'Alger (Hydra & Sidi Yahia)',
      type: 'Agence Immobilière Agréée',
      activeListings: 14,
      verified: true,
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Wahran Prestige Immobilier',
      wilaya: 'Oran (Akid Lotfi & Canastel)',
      type: 'Cabinet Immobilier',
      activeListings: 19,
      verified: true,
      logo: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Mitidja Immo Services',
      wilaya: 'Blida (Centre & Ouled Yaïch)',
      type: 'Agence de Gestion Locative',
      activeListings: 11,
      verified: true,
      logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Cirta Immobilier Constantine',
      wilaya: 'Constantine (Ali Mendjeli)',
      type: 'Agence Agréée',
      activeListings: 8,
      verified: true,
      logo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              Professionnels partenaires
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Propriétaires & Agences Immobilières
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Des professionnels agréés et des propriétaires particuliers engagés pour une location claire et sécurisée.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-slate-700" />
              Identités vérifiées
            </span>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {partner.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {partner.wilaya}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-slate-700 text-[11px] font-semibold border border-slate-200">
                  <CheckCircle2 className="w-3 h-3 text-slate-600" />
                  <span>Agréé & Vérifié</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <span>{partner.type}</span>
                <span className="font-semibold text-slate-900">{partner.activeListings} annonces</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
