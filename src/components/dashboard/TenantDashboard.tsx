import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  User as UserIcon, 
  LayoutDashboard, 
  Search, 
  ExternalLink, 
  Save, 
  CheckCircle2, 
  Trash2, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from '../common/PropertyCard';
import { formatDZD, formatShortDate, formatPriceOnly } from '../../utils/format';

export const TenantDashboard: React.FC = () => {
  const { 
    user, 
    properties, 
    favorites, 
    inquiries, 
    toggleFavorite, 
    navigateTo, 
    updateUserProfile,
    activeTenantTab
  } = useApp();

  const [tab, setTab] = useState<string>(activeTenantTab || 'overview');
  
  // Profile edit fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredCity, setPreferredCity] = useState(user?.preferredCity || 'Alger');
  const [budgetMax, setBudgetMax] = useState(user?.budgetMaxDZD || 50000);
  const [bio, setBio] = useState(user?.bio || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Saved properties list
  const savedPropertiesList = properties.filter(p => favorites.includes(p.id));

  // Inquiries sent by this tenant
  const myInquiries = inquiries.filter(i => i.tenantId === user?.id || user?.email === i.tenantEmail || i.tenantName === user?.name);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      preferredCity,
      budgetMaxDZD: Number(budgetMax),
      bio
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'visit_scheduled':
        return <span className="bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">Visite programmée</span>;
      case 'replied':
        return <span className="bg-slate-200 text-slate-900 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">Répondu par le bailleur</span>;
      case 'closed':
        return <span className="bg-slate-100 text-slate-500 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">Archivé</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">En attente</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name || 'Locataire'}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Bonjour, {user?.name || 'Locataire'}
                </h1>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Locataire
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Suivez vos favoris et vos échanges avec les bailleurs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('browse')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Rechercher un logement</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 no-scrollbar">
          <button
            onClick={() => setTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              tab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Vue d'ensemble</span>
          </button>

          <button
            onClick={() => setTab('favorites')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              tab === 'favorites'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Biens Sauvegardés ({savedPropertiesList.length})</span>
          </button>

          <button
            onClick={() => setTab('inquiries')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              tab === 'inquiries'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Mes Demandes ({myInquiries.length})</span>
          </button>

          <button
            onClick={() => setTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              tab === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Mon Profil & Critères</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-8">
            
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div 
                onClick={() => setTab('favorites')}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Favoris sauvegardés</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{savedPropertiesList.length}</p>
                <p className="text-xs text-slate-600 font-semibold mt-2">Consulter les favoris →</p>
              </div>

              <div 
                onClick={() => setTab('inquiries')}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demandes envoyées</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{myInquiries.length}</p>
                <p className="text-xs text-slate-600 font-semibold mt-2">Suivre mes demandes →</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ville de prédilection</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{user?.preferredCity || 'Alger'}</p>
                <p className="text-xs text-slate-500 font-medium mt-2">Budget max : {formatPriceOnly(user?.budgetMaxDZD || 50000)}</p>
              </div>
            </div>

            {/* Quick Search Shortcuts */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Raccourcis de recherche
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => navigateTo('browse', null, { wilaya: 'Alger' })}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                >
                  <p className="text-xs font-bold text-slate-900">Location Alger (16)</p>
                  <p className="text-[11px] text-slate-500">Hydra, Bab Ezzouar...</p>
                </button>

                <button
                  onClick={() => navigateTo('browse', null, { wilaya: 'Blida' })}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                >
                  <p className="text-xs font-bold text-slate-900">Location Blida (09)</p>
                  <p className="text-[11px] text-slate-500">Centre, Ouled Yaïch...</p>
                </button>

                <button
                  onClick={() => navigateTo('browse', null, { wilaya: 'Oran' })}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                >
                  <p className="text-xs font-bold text-slate-900">Location Oran (31)</p>
                  <p className="text-[11px] text-slate-500">Akid Lotfi, Canastel...</p>
                </button>

                <button
                  onClick={() => navigateTo('browse', null, { propertyType: 'student', isStudentFriendly: true })}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                >
                  <p className="text-xs font-bold text-slate-900">Logement Étudiant</p>
                  <p className="text-[11px] text-slate-500">Proche campus et universités</p>
                </button>
              </div>
            </div>

            {/* Recent Listings Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Dernières annonces publiées</h3>
                <button
                  onClick={() => navigateTo('browse')}
                  className="text-xs font-bold text-slate-900 hover:underline"
                >
                  Voir tout →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {properties.slice(0, 3).map(property => (
                  <PropertyCard key={property.id} property={property} layout="grid" />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: FAVORITES */}
        {tab === 'favorites' && (
          <div>
            {savedPropertiesList.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Aucun bien dans vos favoris</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-6">
                  Sauvegardez des annonces pour les retrouver et les comparer à tout moment.
                </p>
                <button
                  onClick={() => navigateTo('browse')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Explorer les annonces
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPropertiesList.map(property => (
                  <div key={property.id} className="relative group">
                    <PropertyCard property={property} layout="grid" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(property.id);
                      }}
                      className="mt-2 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Retirer de mes favoris</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INQUIRIES */}
        {tab === 'inquiries' && (
          <div className="space-y-4">
            {myInquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Aucune demande envoyée pour l'instant</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-6">
                  Lorsque vous contactez un bailleur via KriDZ, vous retrouverez l'historique et son statut ici.
                </p>
                <button
                  onClick={() => navigateTo('browse')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Trouver un bien à visiter
                </button>
              </div>
            ) : (
              myInquiries.map(inquiry => (
                <div
                  key={inquiry.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={inquiry.propertyImage}
                      alt={inquiry.propertyTitle}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{inquiry.propertyCity}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{formatShortDate(inquiry.createdAt)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{inquiry.propertyTitle}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        Bailleur : <strong className="text-slate-700">{inquiry.ownerName}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div>{getStatusBadge(inquiry.status)}</div>
                    <p className="text-xs font-bold text-slate-900">{formatDZD(inquiry.propertyPriceDZD)}</p>
                    <button
                      onClick={() => navigateTo('property-details', inquiry.propertyId)}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1"
                    >
                      <span>Voir l'annonce</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {tab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Paramètres du profil & critères
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Mettez à jour vos critères de recherche pour faciliter les échanges.
            </p>

            {profileSaved && (
              <div className="p-3 mb-6 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700" />
                <span>Profil mis à jour avec succès !</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom et prénom
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numéro de téléphone (+213)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wilaya / Ville recherchée
                  </label>
                  <select
                    value={preferredCity}
                    onChange={(e) => setPreferredCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white outline-none focus:border-slate-400"
                  >
                    <option value="Alger">16 - Alger</option>
                    <option value="Oran">31 - Oran</option>
                    <option value="Blida">09 - Blida</option>
                    <option value="Constantine">25 - Constantine</option>
                    <option value="Chlef">02 - Chlef</option>
                    <option value="Béjaïa">06 - Béjaïa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Budget maximum (DZD)
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Présentation / Statut (Étudiant, Professionnel, Famille...)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ex: Étudiante en master à l'USTHB, sérieuse et calme..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white outline-none focus:border-slate-400"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer mes modifications</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
