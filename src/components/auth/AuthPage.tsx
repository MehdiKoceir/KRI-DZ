import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Building, 
  Building2, 
  ArrowRight, 
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AuthPage: React.FC = () => {
  const { 
    authMode, 
    authRoleIntent, 
    login, 
    loginAsDemo, 
    navigateTo 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>(authMode || 'signin');
  const [role, setRole] = useState<UserRole>(authRoleIntent || 'tenant');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    // Perform sign-in (or switch to demo user based on email)
    if (email.includes('owner') || email.includes('benali') || email.includes('immo')) {
      loginAsDemo('owner');
    } else if (email.includes('agency') || email.includes('bahdja')) {
      loginAsDemo('agency');
    } else {
      // Default to tenant or created user
      login({
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0] || 'Locataire',
        email,
        phone: phone || '+213 550 00 00 00',
        role: role,
        preferredCity: 'Alger',
        budgetMinDZD: 30000,
        budgetMaxDZD: 70000,
        createdAt: new Date().toISOString()
      });
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!acceptTerms) {
      setErrorMsg('Veuillez accepter les conditions d\'utilisation.');
      return;
    }

    login({
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || '+213 550 00 00 00',
      role,
      agencyName: role === 'agency' ? (agencyName || 'Mon Agence Immobilière') : undefined,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div 
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-2.5 cursor-pointer mb-2"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-extrabold text-base">
              K<span className="text-xs text-slate-400 ml-0.5">DZ</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              KriDZ
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'signin' ? 'Connexion à votre compte' : 'Créer votre compte KriDZ'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {mode === 'signin' 
              ? 'Accédez à vos favoris, messages et annonces.' 
              : 'Rejoignez la plateforme de location immobilière en Algérie.'}
          </p>
        </div>

        {/* Auth Container Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* Signin / Signup Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800">
              {errorMsg}
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.dz"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Mot de passe
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500 cursor-pointer hover:underline">
                    Mot de passe oublié ?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                />
                <label htmlFor="remember-me" className="ml-2 text-xs font-medium text-slate-600 cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                id="auth-submit-signin"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUp} className="space-y-4">
              
              {/* Account Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Type de profil
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('tenant')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      role === 'tenant'
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserIcon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-bold block">Locataire</span>
                    <span className={`text-[10px] block ${role === 'tenant' ? 'text-slate-300' : 'text-slate-400'}`}>Je cherche</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      role === 'owner'
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-bold block">Propriétaire</span>
                    <span className={`text-[10px] block ${role === 'owner' ? 'text-slate-300' : 'text-slate-400'}`}>Particulier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('agency')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      role === 'agency'
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-bold block">Agence</span>
                    <span className={`text-[10px] block ${role === 'agency' ? 'text-slate-300' : 'text-slate-400'}`}>Agréée</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom et prénom
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Karim Benali"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {role === 'agency' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom de l'agence immobilière
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Ex: Agence El Bahdja Agréée"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.dz"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numéro de téléphone (+213)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+213 550 12 34 56"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Au moins 8 caractères"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Accept Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                />
                <label htmlFor="accept-terms" className="ml-2 text-xs text-slate-600 cursor-pointer">
                  J'accepte les conditions d'utilisation de KriDZ et certifie l'exactitude de mes coordonnées.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                id="auth-submit-signup"
              >
                <span>Créer mon compte</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Test Accounts */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-3">
              <span>Accès rapide démo :</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => loginAsDemo('tenant')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between transition-colors"
                id="demo-login-tenant"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    A
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Amina Bouzid (Locataire)</p>
                    <p className="text-[10px] text-slate-500">Étudiante à Alger • Espace locataire</p>
                  </div>
                </div>
                <span className="text-xs text-slate-700 font-bold">Tester →</span>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('owner')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between transition-colors"
                id="demo-login-owner"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    Y
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Youcef Benali (Propriétaire)</p>
                    <p className="text-[10px] text-slate-500">Bailleur particulier • Tableau de bord</p>
                  </div>
                </div>
                <span className="text-xs text-slate-700 font-bold">Tester →</span>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('agency')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between transition-colors"
                id="demo-login-agency"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    EB
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">El Bahdja Immobilier (Agence)</p>
                    <p className="text-[10px] text-slate-500">Agence agréée • Gestion des annonces</p>
                  </div>
                </div>
                <span className="text-xs text-slate-700 font-bold">Tester →</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
