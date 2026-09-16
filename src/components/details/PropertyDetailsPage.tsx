import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Building, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Droplets, 
  Wind, 
  Flame, 
  Car, 
  Wifi, 
  Utensils, 
  Sun, 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  Eye, 
  Clock, 
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD, formatPriceOnly, formatShortDate } from '../../utils/format';
import { InquiryModal } from './InquiryModal';
import { ReportModal } from './ReportModal';
import { PropertyCard } from '../common/PropertyCard';

export const PropertyDetailsPage: React.FC = () => {
  const { 
    properties, 
    selectedPropertyId, 
    navigateTo, 
    isFavorited, 
    toggleFavorite 
  } = useApp();

  // Find target property or fallback
  const property = properties.find(p => p.id === selectedPropertyId) || properties[0];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showPhone, setShowPhone] = useState<boolean>(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const favorited = isFavorited(property.id);

  // Similar properties
  const similarProperties = properties
    .filter(p => p.id !== property.id && (p.wilayaCode === property.wilayaCode || p.propertyType === property.propertyType))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const getWhatsAppUrl = () => {
    const rawNumber = property.ownerWhatsapp || property.ownerPhone.replace(/[^0-9]/g, '');
    const cleanNumber = rawNumber.startsWith('0') ? '213' + rawNumber.slice(1) : rawNumber;
    const text = encodeURIComponent(
      `Salam alaykoum, je vous contacte depuis KriDZ concernant votre annonce : "${property.title}" (${formatDZD(property.pricePerMonthDZD)}). Est-elle toujours disponible ? Merci.`
    );
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('eau') || lower.includes('bâche') || lower.includes('citerne')) return <Droplets className="w-4 h-4 text-slate-700" />;
    if (lower.includes('clim')) return <Wind className="w-4 h-4 text-slate-700" />;
    if (lower.includes('chauffage')) return <Flame className="w-4 h-4 text-slate-700" />;
    if (lower.includes('parking') || lower.includes('garage')) return <Car className="w-4 h-4 text-slate-700" />;
    if (lower.includes('fibre') || lower.includes('wi-fi')) return <Wifi className="w-4 h-4 text-slate-700" />;
    if (lower.includes('cuisine')) return <Utensils className="w-4 h-4 text-slate-700" />;
    if (lower.includes('balcon') || lower.includes('terrasse')) return <Sun className="w-4 h-4 text-slate-700" />;
    return <Check className="w-4 h-4 text-slate-700" />;
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation bar / Back */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigateTo('browse')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 font-bold text-xs shadow-xs transition-all"
            id="details-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux annonces</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
              title="Partager le lien"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>{copiedShare ? 'Lien copié !' : 'Partager'}</span>
            </button>

            <button
              onClick={() => toggleFavorite(property.id)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-rose-600 font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
              id="details-favorite-btn"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span>{favorited ? 'Sauvegardé' : 'Sauvegarder'}</span>
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs mb-8">
          
          {/* Main Display Image */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] max-h-[480px] w-full rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

            {/* Badges on main image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {property.isFeatured && (
                <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-xs">
                  À la une
                </span>
              )}
              <span className="bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1 rounded-lg shadow-xs">
                {property.isFurnished ? 'Meublé' : 'Non meublé'}
              </span>
              {property.isStudentFriendly && (
                <span className="bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1 rounded-lg shadow-xs">
                  Étudiant
                </span>
              )}
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg">
              {activeImageIndex + 1} / {property.images.length} photos
            </div>
          </div>

          {/* Thumbnails Row */}
          {property.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pt-4 no-scrollbar">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 sm:w-28 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-slate-900 ring-2 ring-slate-900/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Center Column: Details & Specs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Block */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {property.city}, {property.wilayaName} ({property.wilayaCode})
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Publié le {formatShortDate(property.createdAt)}
                  </span>
                </div>

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {property.viewsCount} vues
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {property.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{property.address || property.neighborhood}</span>
              </p>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Type & Pièces</span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Bed className="w-4 h-4 text-slate-700" />
                    F{property.rooms} ({property.propertyType})
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Superficie</span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Maximize2 className="w-4 h-4 text-slate-700" />
                    {property.surfaceM2} m²
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Salles de bain</span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Bath className="w-4 h-4 text-slate-700" />
                    {property.bathrooms} sdb
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Étage</span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-4 h-4 text-slate-700" />
                    {property.floor ? `${property.floor}ème étage` : 'RDC / Villa'}
                  </p>
                </div>
              </div>

            </div>

            {/* Description Block */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Description détaillée
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                {property.description}
              </div>

              {/* Rental condition pills in Algeria */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                  Disponibilité : <strong className="text-slate-900">{property.availabilityDate}</strong>
                </span>
                {property.paymentFrequency && (
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                    Modalité de paiement : <strong className="text-slate-900">
                      {property.paymentFrequency === 'annual' ? '12 mois d\'avance' : property.paymentFrequency === 'semiannual' ? '6 mois d\'avance' : 'Trimestriel'}
                    </strong>
                  </span>
                )}
                {property.depositDZD && (
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                    Caution : <strong className="text-slate-900">{formatPriceOnly(property.depositDZD)}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Équipements & Commodités
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs border border-slate-200">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Algerian Neighborhood Location & Transport Note */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Localisation & Quartier
              </h2>
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center mx-auto">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {property.neighborhood}, {property.city}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Situé dans un quartier résidentiel avec accès direct aux commodités, commerces et axes de transport.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>Adresse exacte communiquée directement par le propriétaire</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Pricing & Contact Owner Card */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm sticky top-28 space-y-6">
              
              {/* Price Block */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Loyer mensuel
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {formatPriceOnly(property.pricePerMonthDZD)}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">/ mois</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Sans commission d'agence pour les locataires sur KriDZ
                </p>
              </div>

              {/* Owner Profile Snippet */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-base shadow-xs">
                    {property.ownerName.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {property.ownerName}
                      </h4>
                      {property.ownerVerified && (
                        <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0" title="Vérifié" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {property.ownerType === 'agency' ? 'Agence Immobilière Agréée' : 'Propriétaire Particulier'}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-200">
                  <p>• Répond généralement rapidement</p>
                  <p>• Conforme à la législation locative algérienne</p>
                </div>
              </div>

              {/* Direct Contact CTAs */}
              <div className="space-y-3">
                
                {/* WhatsApp Button */}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all"
                  id="details-whatsapp-btn"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contacter sur WhatsApp</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                {/* Direct Phone Call / Reveal Button */}
                {showPhone ? (
                  <a
                    href={`tel:${property.ownerPhone}`}
                    className="w-full py-3.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-slate-200"
                    id="details-phone-revealed"
                  >
                    <Phone className="w-4 h-4 text-slate-700" />
                    <span>Appeler : {property.ownerPhone}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPhone(true)}
                    className="w-full py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors"
                    id="details-reveal-phone-btn"
                  >
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>Afficher le numéro de téléphone</span>
                  </button>
                )}

                {/* Send In-App Inquiry */}
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                  id="details-inquiry-btn"
                >
                  <span>Envoyer un message au bailleur</span>
                </button>
              </div>

              {/* Report Listing */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Signaler une anomalie</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Biens similaires
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Dans la même wilaya ou de typologie semblable
                </p>
              </div>

              <button
                onClick={() => navigateTo('browse', null, { wilaya: property.wilayaName })}
                className="text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 underline"
              >
                Voir plus dans cette wilaya
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map(simProp => (
                <PropertyCard key={simProp.id} property={simProp} layout="grid" />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        property={property}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        property={property}
      />

    </div>
  );
};
