import React from 'react';
import { Heart, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatDZD } from '../../utils/format';

interface PropertyCardProps {
  property: Property;
  layout?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, layout = 'grid' }) => {
  const { navigateTo, isFavorited, toggleFavorite } = useApp();
  const favorited = isFavorited(property.id);

  const handleCardClick = () => {
    navigateTo('property-details', property.id);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  if (layout === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col sm:flex-row"
        id={`property-card-${property.id}`}
      >
        {/* Image Container */}
        <div className="relative sm:w-72 h-52 sm:h-auto shrink-0 overflow-hidden bg-slate-100">
          <img
            src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />

          {/* Neutral Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {property.isFeatured && (
              <span className="bg-white/95 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                À la une
              </span>
            )}
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-xs">
              {property.isFurnished ? 'Meublé' : 'Non meublé'}
            </span>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-sm transition-all z-10"
            title={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'text-slate-900 fill-slate-900' : ''}`} />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {property.city}, {property.wilayaName} ({property.wilayaCode})
              </span>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Wilaya {property.wilayaCode}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-slate-700 transition-colors">
              {property.title}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
              {property.description}
            </p>

            {/* Spec pills */}
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1 font-medium">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                {property.rooms} {property.rooms > 1 ? 'pièces' : 'pièce'}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                {property.bathrooms} sdb
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                {property.surfaceM2} m²
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Loyer mensuel</span>
              <p className="text-lg font-extrabold text-slate-900">
                {formatDZD(property.pricePerMonthDZD)}
              </p>
            </div>

            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Consulter l'annonce
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid layout
  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col h-full"
      id={`property-card-${property.id}`}
    >
      {/* Top Image area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Subtle shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-75" />

        {/* Neutral Badges Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {property.isFeatured && (
            <span className="bg-white/95 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
              À la une
            </span>
          )}
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-xs">
            {property.isFurnished ? 'Meublé' : 'Non meublé'}
          </span>
          {property.isStudentFriendly && (
            <span className="bg-slate-800/90 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded shadow-xs">
              Étudiant
            </span>
          )}
        </div>

        {/* Heart Favorite Top Right */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-sm transition-all z-10"
          title={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'text-slate-900 fill-slate-900' : ''}`} />
        </button>

        {/* Price Tag Overlaid at Bottom Left of Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
          <div>
            <span className="text-[10px] text-slate-300 font-medium block">Loyer</span>
            <p className="text-lg font-bold tracking-tight">
              {formatDZD(property.pricePerMonthDZD)}
            </p>
          </div>
          {property.ownerType === 'agency' && (
            <span className="text-[10px] bg-slate-900/80 backdrop-blur-sm text-slate-200 font-medium px-2 py-0.5 rounded border border-slate-700">
              Agence
            </span>
          )}
        </div>
      </div>

      {/* Body details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          {/* Location line */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-600 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {property.city}, {property.wilayaName}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold shrink-0">
              W.{property.wilayaCode}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 group-hover:text-slate-700 transition-colors">
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {property.neighborhood} — {property.description}
          </p>
        </div>

        {/* Specs footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold" title="Pièces">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              F{property.rooms}
            </span>
            <span className="flex items-center gap-1 font-semibold" title="Salles de bain">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1 font-semibold" title="Superficie">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              {property.surfaceM2}m²
            </span>
          </div>

          <span className="text-slate-900 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
            Détails →
          </span>
        </div>
      </div>
    </div>
  );
};
