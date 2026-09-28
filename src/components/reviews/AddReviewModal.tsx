import React, { useState } from 'react';
import { X, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { Property, Review } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddReviewModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({ property, isOpen, onClose }) => {
  const { user, addReview } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  // Specific criteria ratings
  const [locationRating, setLocationRating] = useState<number>(5);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(5);
  const [communicationRating, setCommunicationRating] = useState<number>(5);
  const [valueRating, setValueRating] = useState<number>(5);

  const [authorName, setAuthorName] = useState(user?.name || '');
  const [rentalPeriod, setRentalPeriod] = useState('6 mois à 1 an');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1: return 'Décevant';
      case 2: return 'Passable';
      case 3: return 'Bien';
      case 4: return 'Très bien';
      case 5: return 'Excellent !';
      default: return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMessage('Veuillez rédiger un commentaire d\'au moins 10 caractères pour aider les futurs locataires.');
      return;
    }

    if (!authorName.trim()) {
      setErrorMessage('Veuillez indiquer votre nom ou pseudonyme.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const reviewData: Omit<Review, 'id' | 'createdAt'> = {
      propertyId: property.id,
      tenantId: user?.id || `anon-${Date.now()}`,
      tenantName: authorName.trim(),
      tenantAvatar: user?.avatar || undefined,
      rating,
      criteriaRatings: {
        location: locationRating,
        cleanliness: cleanlinessRating,
        communication: communicationRating,
        valueForMoney: valueRating
      },
      comment: comment.trim(),
      rentalPeriod,
      isVerifiedTenant: true
    };

    const res = await addReview(reviewData);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Une erreur est survenue lors de l\'enregistrement.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 id="review-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
              Donner votre avis
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {property.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Overall Star Rating */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Note globale du logement
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-hidden transition-transform hover:scale-115 active:scale-95"
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-amber-700 mt-2">
              {getRatingLabel(hoverRating || rating)} ({hoverRating || rating}/5)
            </p>
          </div>

          {/* Sub-criteria Ratings */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
            <span className="block text-xs font-bold text-slate-800">
              Évaluation par critère (de 1 à 5)
            </span>

            {/* Emplacement */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Emplacement & Quartier</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLocationRating(val)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        locationRating >= val ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Propreté */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Propreté & État des lieux</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCleanlinessRating(val)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        cleanlinessRating >= val ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Communication */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Communication du bailleur</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCommunicationRating(val)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        communicationRating >= val ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Rapport Qualité/Prix */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Rapport Qualité / Prix</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setValueRating(val)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        valueRating >= val ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Author Name & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Votre nom ou pseudonyme *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex. Karim B."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Durée de la location
              </label>
              <select
                value={rentalPeriod}
                onChange={(e) => setRentalPeriod(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="Moins de 3 mois">Moins de 3 mois</option>
                <option value="3 à 6 mois">3 à 6 mois</option>
                <option value="6 mois à 1 an">6 mois à 1 an</option>
                <option value="1 an à 2 ans">1 an à 2 ans</option>
                <option value="Plus de 2 ans">Plus de 2 ans</option>
              </select>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Votre retour d'expérience détaillé *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Décrivez votre expérience : points forts (calme, pression d'eau, proximité des transports), réactivité du propriétaire, conseils pour les prochains locataires..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 resize-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Minimum 10 caractères. Votre avis aide les Algériens à trouver leur chez-soi en toute confiance.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Publication...' : 'Publier mon avis'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
