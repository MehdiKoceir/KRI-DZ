import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  GraduationCap, 
  HelpCircle, 
  PlusCircle, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Heart, 
  Building2, 
  ChevronDown,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    user, 
    currentPage, 
    navigateTo, 
    setAuthMode, 
    logout, 
    favorites, 
    language, 
    setLanguage 
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleNav = (page: any, filterOverrides?: any) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    navigateTo(page, null, filterOverrides);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Timeless, Minimalist & Dignified */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer select-none"
            id="navbar-brand"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <span className="font-extrabold text-lg text-white">K</span>
              <span className="text-slate-400 font-bold text-xs ml-0.5">DZ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center">
                KriDZ
                <span className="ml-2 text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Algérie
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-normal -mt-0.5 hidden sm:block">
                Location immobilière
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Clean Neutral Hover States */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === 'home'
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
              id="nav-link-home"
            >
              <Home className="w-4 h-4 text-slate-500" />
              Accueil
            </button>

            <button
              onClick={() => handleNav('browse')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === 'browse'
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
              id="nav-link-browse"
            >
              <Search className="w-4 h-4 text-slate-500" />
              Parcourir les biens
            </button>

            <button
              onClick={() => handleNav('browse', { propertyType: 'student', isStudentFriendly: true })}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              id="nav-link-student"
            >
              <GraduationCap className="w-4 h-4 text-slate-500" />
              Logement Étudiant
            </button>

            <button
              onClick={() => {
                if (currentPage !== 'home') {
                  handleNav('home');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                } else {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              id="nav-link-how"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              Comment ça marche
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                title="Changer de langue"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in">
                  <button
                    onClick={() => { setLanguage('fr'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${language === 'fr' ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-700'}`}
                  >
                    <span>Français</span>
                    {language === 'fr' && <span className="text-[10px] text-slate-500">FR</span>}
                  </button>
                  <button
                    onClick={() => { setLanguage('ar'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${language === 'ar' ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-700'}`}
                  >
                    <span>العربية (Algérie)</span>
                    {language === 'ar' && <span className="text-[10px] text-slate-500">AR</span>}
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${language === 'en' ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-700'}`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="text-[10px] text-slate-500">EN</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Favorites Icon */}
            <button
              onClick={() => {
                if (user?.role === 'tenant') {
                  handleNav('tenant-dashboard');
                } else {
                  handleNav('browse');
                }
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Mes favoris"
              id="navbar-favorites-btn"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-slate-900 fill-slate-900' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* User State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-xs"
                  id="navbar-user-menu"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-500 capitalize">
                      {user.role === 'tenant' ? 'Locataire' : user.role === 'agency' ? 'Agence' : 'Propriétaire'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[11px] text-slate-400">Connecté en tant que</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded capitalize">
                        {user.role === 'tenant' ? 'Compte Locataire' : user.role === 'agency' ? 'Compte Agence' : 'Compte Propriétaire'}
                      </span>
                    </div>

                    <div className="py-1">
                      {user.role === 'tenant' ? (
                        <button
                          onClick={() => handleNav('tenant-dashboard')}
                          className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950 flex items-center gap-2"
                        >
                          <UserIcon className="w-4 h-4 text-slate-500" />
                          Mon Espace Locataire
                        </button>
                      ) : (
                        <button
                          onClick={() => handleNav('owner-dashboard')}
                          className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950 flex items-center gap-2"
                        >
                          <Building2 className="w-4 h-4 text-slate-500" />
                          Tableau de bord Propriétaire
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (user.role === 'tenant') {
                            handleNav('tenant-dashboard');
                          } else {
                            handleNav('owner-dashboard');
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        Mes Sauvegardes
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthMode('signin')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  id="navbar-signin-btn"
                >
                  Se connecter
                </button>
              </div>
            )}

            {/* List Your Property CTA - Solid timeless dark button */}
            <button
              onClick={() => {
                if (user?.role === 'owner' || user?.role === 'agency') {
                  handleNav('owner-dashboard');
                } else if (user?.role === 'tenant') {
                  handleNav('owner-dashboard');
                } else {
                  setAuthMode('signup', 'owner');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2"
              id="navbar-list-property-btn"
            >
              <PlusCircle className="w-4 h-4 text-slate-300" />
              <span>Déposer une annonce</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                if (user?.role === 'tenant') {
                  handleNav('tenant-dashboard');
                } else {
                  handleNav('browse');
                }
              }}
              className="p-2 text-slate-600 relative"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-slate-900 fill-slate-900' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2.5 ${
              currentPage === 'home' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
            }`}
          >
            <Home className="w-4 h-4 text-slate-500" />
            Accueil
          </button>

          <button
            onClick={() => handleNav('browse')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2.5 ${
              currentPage === 'browse' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
            }`}
          >
            <Search className="w-4 h-4 text-slate-500" />
            Parcourir les annonces
          </button>

          <button
            onClick={() => handleNav('browse', { propertyType: 'student', isStudentFriendly: true })}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 flex items-center justify-between"
          >
            <span className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              Logement Étudiant
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
              Universités
            </span>
          </button>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <div className="px-3.5 py-2 flex items-center gap-3 bg-slate-50 rounded-xl">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>

                {user.role === 'tenant' ? (
                  <button
                    onClick={() => handleNav('tenant-dashboard')}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-100 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4" />
                    Mon Espace Locataire
                  </button>
                ) : (
                  <button
                    onClick={() => handleNav('owner-dashboard')}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-100 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Tableau de bord Propriétaire
                  </button>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-950 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthMode('signin');
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-700 text-center"
                >
                  Connexion
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthMode('signup', 'owner');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-sm font-bold text-white text-center"
                >
                  Déposer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
