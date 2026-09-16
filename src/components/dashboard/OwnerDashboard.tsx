import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Eye, 
  MessageSquare, 
  CheckCircle2, 
  Trash2, 
  Phone, 
  ExternalLink, 
  LayoutDashboard, 
  Home, 
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyType } from '../../types';
import { ALGERIAN_WILAYAS } from '../../data/algerianCities';
import { formatDZD, formatPriceOnly, formatShortDate } from '../../utils/format';

export const OwnerDashboard: React.FC = () => {
  const { 
    user, 
    properties, 
    inquiries, 
    addProperty, 
    updateProperty, 
    deleteProperty, 
    updateInquiryStatus, 
    navigateTo 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'inquiries' | 'add-listing'>('overview');

  // Filter listings belonging to this owner/agency or show demo owner listings
  const ownerListings = properties.filter(p => 
    p.ownerId === user?.id || 
    p.ownerName.toLowerCase().includes(user?.name.toLowerCase() || 'youcef') ||
    (user?.role === 'agency' && p.ownerType === 'agency')
  );

  // Inquiries for this owner's properties
  const ownerInquiries = inquiries.filter(i => 
    ownerListings.some(p => p.id === i.propertyId) || 
    i.ownerName.toLowerCase().includes(user?.name.toLowerCase() || 'youcef')
  );

  // Total views
  const totalViews = ownerListings.reduce((sum, p) => sum + p.viewsCount, 0);

  // Form State for new listing
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [wilayaCode, setWilayaCode] = useState('16');
  const [city, setCity] = useState('Alger');
  const [neighborhood, setNeighborhood] = useState('');
  const [priceDZD, setPriceDZD] = useState(50000);
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'quarterly' | 'semiannual' | 'annual'>('semiannual');
  const [surfaceM2, setSurfaceM2] = useState(85);
  const [rooms, setRooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(1);
  const [floor, setFloor] = useState(2);
  const [isFurnished, setIsFurnished] = useState(true);
  const [isStudentFriendly, setIsStudentFriendly] = useState(false);
  const [waterTank, setWaterTank] = useState(true);
  const [ac, setAc] = useState(true);
  const [heating, setHeating] = useState(true);
  const [elevator, setElevator] = useState(false);
  const [parking, setParking] = useState(true);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80');
  const [formSuccess, setFormSuccess] = useState(false);

  // Handle new listing submission
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !neighborhood.trim()) return;

    const wilayaObj = ALGERIAN_WILAYAS.find(w => w.code === wilayaCode) || ALGERIAN_WILAYAS[15];

    const amenitiesList: string[] = [];
    if (waterTank) amenitiesList.push('Bâche à eau / Citerne');
    if (ac) amenitiesList.push('Climatisation');
    if (heating) amenitiesList.push('Chauffage central');
    if (elevator) amenitiesList.push('Ascenseur');
    if (parking) amenitiesList.push('Place de parking');
    if (isFurnished) amenitiesList.push('Cuisine équipée', 'Mobilier complet');
    amenitiesList.push('Ligne téléphonique / Internet');

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title,
      propertyType,
      wilayaCode: wilayaObj.code,
      wilayaName: wilayaObj.name,
      city: city || wilayaObj.name,
      neighborhood,
      address: `${neighborhood}, ${city || wilayaObj.name}`,
      pricePerMonthDZD: Number(priceDZD),
      paymentFrequency,
      depositDZD: Number(priceDZD),
      surfaceM2: Number(surfaceM2),
      rooms: Number(rooms),
      bathrooms: Number(bathrooms),
      floor: Number(floor),
      isFurnished,
      isStudentFriendly,
      isAvailable: true,
      availabilityDate: 'Immédiate',
      images: [
        imageUrl || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
      ],
      description: description || `Très bel appartement à louer situé à ${neighborhood}, ${city}. Idéal pour résidence calme, proche de toutes commodités.`,
      amenities: amenitiesList,
      ownerId: user?.id || 'owner-youcef',
      ownerName: user?.name || 'Propriétaire KriDZ',
      ownerPhone: user?.phone || '+213 550 00 00 00',
      ownerType: user?.role === 'agency' ? 'agency' : 'individual',
      ownerVerified: true,
      status: 'active',
      viewsCount: 1,
      inquiriesCount: 0,
      createdAt: new Date().toISOString()
    };

    addProperty(newProperty);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('listings');
    }, 1500);
  };

  const getInquiryWhatsApp = (phone: string, propTitle: string) => {
    const rawNumber = phone.replace(/[^0-9]/g, '');
    const cleanNumber = rawNumber.startsWith('0') ? '213' + rawNumber.slice(1) : rawNumber;
    const text = encodeURIComponent(
      `Salam, suite à votre demande sur KriDZ pour l'annonce "${propTitle}", je suis disponible pour échanger ou planifier une visite.`
    );
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center shadow-xs">
              {user?.agencyName ? user.agencyName.charAt(0) : user?.name.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {user?.agencyName || user?.name || 'Espace Bailleur'}
                </h1>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  {user?.role === 'agency' ? 'Agence Immobilière Agréée' : 'Propriétaire Vérifié'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Gérez vos annonces locatives et répondez aux demandes des locataires.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('add-listing')}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2"
            id="owner-add-listing-cta"
          >
            <PlusCircle className="w-4 h-4 text-slate-300" />
            <span>Déposer une nouvelle annonce</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Tableau de bord</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Mes Annonces ({ownerListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Demandes Reçues ({ownerInquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add-listing')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'add-listing'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Publier une annonce</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div 
                onClick={() => setActiveTab('listings')}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-4">
                  <Home className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annonces actives</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{ownerListings.length}</p>
                <p className="text-xs text-slate-600 font-semibold mt-2">Gérer les biens →</p>
              </div>

              <div 
                onClick={() => setActiveTab('inquiries')}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demandes de locataires</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{ownerInquiries.length}</p>
                <p className="text-xs text-slate-600 font-semibold mt-2">Répondre aux candidats →</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vues cumulées</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalViews}</p>
                <p className="text-xs text-slate-500 font-medium mt-2">Audience sur la plateforme</p>
              </div>
            </div>

            {/* Recent Inquiries Snippet */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Dernières demandes de contact reçues
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Locataires intéressés par vos logements.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-bold text-slate-900 hover:underline"
                >
                  Voir toutes les demandes ({ownerInquiries.length}) →
                </button>
              </div>

              {ownerInquiries.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Aucune demande pour l'instant. Vos nouvelles demandes apparaîtront ici.
                </div>
              ) : (
                <div className="space-y-3">
                  {ownerInquiries.slice(0, 3).map(inquiry => (
                    <div
                      key={inquiry.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900">{inquiry.tenantName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-700 font-semibold">{inquiry.tenantPhone}</span>
                        </div>
                        <p className="text-xs text-slate-600 italic line-clamp-1">"{inquiry.message}"</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Bien : {inquiry.propertyTitle} • {formatShortDate(inquiry.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={getInquiryWhatsApp(inquiry.tenantPhone, inquiry.propertyTitle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={`tel:${inquiry.tenantPhone}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Appeler</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: MY LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Mes Annonces Immobilières ({ownerListings.length})
              </h3>
              <button
                onClick={() => setActiveTab('add-listing')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-slate-300" />
                <span>Ajouter un bien</span>
              </button>
            </div>

            {ownerListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <p className="text-sm text-slate-600 mb-4">Vous n'avez pas encore d'annonces publiées.</p>
                <button
                  onClick={() => setActiveTab('add-listing')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Publier ma première annonce
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {ownerListings.map(listing => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            listing.status === 'active' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {listing.status === 'active' ? 'En ligne' : 'Loué'}
                          </span>
                          <span className="text-xs text-slate-500">{listing.city}, {listing.neighborhood}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{listing.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                          <span className="font-bold text-slate-900">{formatDZD(listing.pricePerMonthDZD)}</span>
                          <span>•</span>
                          <span>F{listing.rooms} ({listing.surfaceM2} m²)</span>
                          <span>•</span>
                          <span>{listing.viewsCount} vues</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <button
                        onClick={() => navigateTo('property-details', listing.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Voir</span>
                      </button>

                      <button
                        onClick={() => {
                          const newStatus = listing.status === 'active' ? 'rented' : 'active';
                          updateProperty(listing.id, { status: newStatus });
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
                      >
                        {listing.status === 'active' ? 'Marquer comme loué' : 'Réactiver'}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Voulez-vous supprimer cette annonce ?')) {
                            deleteProperty(listing.id);
                          }
                        }}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INQUIRIES MANAGEMENT */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              Demandes de contact reçues ({ownerInquiries.length})
            </h3>

            {ownerInquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <p className="text-sm text-slate-600">Aucune demande reçue pour vos biens pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ownerInquiries.map(inq => (
                  <div
                    key={inq.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{inq.tenantName}</span>
                          <span className="text-xs text-slate-400">• {formatShortDate(inq.createdAt)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Bien : <strong>{inq.propertyTitle}</strong>
                        </p>
                      </div>

                      {/* Status changer */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Statut :</span>
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                          className="text-xs font-semibold p-1.5 rounded-lg border border-slate-300 bg-slate-50"
                        >
                          <option value="pending">En attente</option>
                          <option value="replied">Répondu</option>
                          <option value="visit_scheduled">Visite programmée</option>
                          <option value="closed">Clôturé</option>
                        </select>
                      </div>
                    </div>

                    {/* Message body */}
                    <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 leading-relaxed">
                      "{inq.message}"
                    </div>

                    {/* Quick contacts */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                      <div className="flex items-center gap-4 text-slate-600 font-medium">
                        <span>Tél : <strong className="text-slate-900">{inq.tenantPhone}</strong></span>
                        {inq.tenantEmail && <span>Email : {inq.tenantEmail}</span>}
                        {inq.moveInDate && <span>Emménagement : <strong>{inq.moveInDate}</strong></span>}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={getInquiryWhatsApp(inq.tenantPhone, inq.propertyTitle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${inq.tenantPhone}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Appeler</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ADD LISTING FORM */}
        {activeTab === 'add-listing' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
            
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Publication Immobilière
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                Publier une annonce de location
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Renseignez avec soin les critères de votre bien pour attirer des locataires sérieux.
              </p>
            </div>

            {formSuccess && (
              <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-slate-700" />
                <span>Votre annonce a été publiée avec succès ! Redirection...</span>
              </div>
            )}

            <form onSubmit={handleCreateListing} className="space-y-6">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Titre de l'annonce *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Spacieux F3 meublé avec bâche à eau et vue dégagée"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white outline-none focus:border-slate-400"
                />
              </div>

              {/* Type and Wilaya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Type de bien *
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white outline-none focus:border-slate-400"
                  >
                    <option value="apartment">Appartement (F1 à F5)</option>
                    <option value="student">Logement Étudiant</option>
                    <option value="villa">Villa / Maison individuelle</option>
                    <option value="duplex">Duplex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wilaya *
                  </label>
                  <select
                    value={wilayaCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setWilayaCode(code);
                      const w = ALGERIAN_WILAYAS.find(x => x.code === code);
                      if (w) setCity(w.name);
                    }}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white outline-none focus:border-slate-400"
                  >
                    {ALGERIAN_WILAYAS.map(w => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {w.name} ({w.arName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City and Neighborhood */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Commune / Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Hydra, Bab Ezzouar, Akid Lotfi"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quartier / Résidence *
                  </label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ex: Cité 5 Juillet, Proche Tramway"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Pricing & Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Loyer mensuel (DZD) *
                  </label>
                  <input
                    type="number"
                    required
                    step={1000}
                    value={priceDZD}
                    onChange={(e) => setPriceDZD(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 outline-none"
                  />
                  <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                    {formatPriceOnly(priceDZD)} / mois
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Modalité de paiement souhaitée *
                  </label>
                  <select
                    value={paymentFrequency}
                    onChange={(e) => setPaymentFrequency(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 outline-none"
                  >
                    <option value="monthly">Mensuel</option>
                    <option value="quarterly">Trimestriel (3 mois)</option>
                    <option value="semiannual">Semestriel (6 mois)</option>
                    <option value="annual">Annuel (12 mois)</option>
                  </select>
                </div>
              </div>

              {/* Specs: Surface, Rooms, Bathrooms, Floor */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Superficie (m²)
                  </label>
                  <input
                    type="number"
                    value={surfaceM2}
                    onChange={(e) => setSurfaceM2(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pièces (F1-F5)
                  </label>
                  <select
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold"
                  >
                    <option value={1}>1 pièce (Studio)</option>
                    <option value={2}>2 pièces (F2)</option>
                    <option value={3}>3 pièces (F3)</option>
                    <option value={4}>4 pièces (F4)</option>
                    <option value={5}>5 pièces ou +</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Salles de bain
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Étage
                  </label>
                  <input
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold"
                  />
                </div>
              </div>

              {/* Specific Algerian criteria */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Équipements & critères clés
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-700">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={waterTank}
                      onChange={(e) => setWaterTank(e.target.checked)}
                      className="w-4 h-4 text-slate-900 rounded"
                    />
                    <span>Bâche à eau / Citerne</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFurnished}
                      onChange={(e) => setIsFurnished(e.target.checked)}
                      className="w-4 h-4 text-slate-900 rounded"
                    />
                    <span>Meublé</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isStudentFriendly}
                      onChange={(e) => setIsStudentFriendly(e.target.checked)}
                      className="w-4 h-4 text-slate-900 rounded"
                    />
                    <span>Convient aux étudiants</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ac}
                      onChange={(e) => setAc(e.target.checked)}
                      className="w-4 h-4 text-slate-900 rounded"
                    />
                    <span>Climatisation</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heating}
                      onChange={(e) => setHeating(e.target.checked)}
                      className="w-4 h-4 text-slate-900 rounded"
                    />
                    <span>Chauffage</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={parking}
                      onChange={(e) => setParking(e.target.checked)}
                      className="w-4 h-4 text-slate-900 rounded"
                    />
                    <span>Place de parking</span>
                  </label>
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo principale (URL)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none focus:border-slate-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez l'état de l'appartement, l'orientation, les commerces et transports à proximité..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white outline-none focus:border-slate-400"
                />
              </div>

              {/* Submit button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('listings')}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2"
                  id="owner-submit-listing-btn"
                >
                  <PlusCircle className="w-4 h-4 text-slate-300" />
                  <span>Publier l'annonce</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
