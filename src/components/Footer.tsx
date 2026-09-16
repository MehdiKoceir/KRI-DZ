import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => navigateTo('home')} 
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
                <span className="font-extrabold text-lg">K</span>
                <span className="text-emerald-400 font-bold text-xs ml-0.5">DZ</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  KriDZ
                </span>
                <p className="text-[11px] text-slate-500 font-medium">
                  Trouvez votre prochain chez-vous en Algérie.
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plateforme immobilière pour la location d’appartements, studios, villas et logements étudiants en Algérie. Contact direct propriétaires et agences sans frais cachés.
            </p>

            <div className="space-y-2 pt-1 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Alger, Wilaya d'Alger, Algérie</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>+213 (0) 550 00 00 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>contact@kridz.dz</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Rapide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('browse')} className="hover:text-white transition-colors">
                  Toutes les annonces
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('browse', null, { propertyType: 'student', isStudentFriendly: true })}
                  className="hover:text-white transition-colors"
                >
                  Logements Étudiants
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('browse', null, { propertyType: 'apartment' })}
                  className="hover:text-white transition-colors"
                >
                  Appartements F1 à F5
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('browse', null, { propertyType: 'villa' })}
                  className="hover:text-white transition-colors"
                >
                  Villas & Maisons
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Wilayas Populaires */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Villes & Wilayas
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button 
                  onClick={() => navigateTo('browse', null, { wilaya: 'Alger' })}
                  className="hover:text-white transition-colors"
                >
                  Location Alger (16)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('browse', null, { wilaya: 'Oran' })}
                  className="hover:text-white transition-colors"
                >
                  Location Oran (31)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('browse', null, { wilaya: 'Blida' })}
                  className="hover:text-white transition-colors"
                >
                  Location Blida (09)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('browse', null, { wilaya: 'Constantine' })}
                  className="hover:text-white transition-colors"
                >
                  Location Constantine (25)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('browse', null, { wilaya: 'Chlef' })}
                  className="hover:text-white transition-colors"
                >
                  Location Chlef (02)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Confiance & Légal Algérie */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Conseils Location Algérie
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>Privilégiez un contrat notarié conforme à la réglementation algérienne.</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>Vérifiez la présence d'une bâche à eau ou citerne lors de la visite.</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>Paiements clairs en Dinars Algériens (DZD) selon l'accord convenu.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} KriDZ — Plateforme de location immobilière en Algérie.</p>
          <div className="text-slate-500 text-xs">
            Marché immobilier algérien
          </div>
        </div>

      </div>
    </footer>
  );
};
