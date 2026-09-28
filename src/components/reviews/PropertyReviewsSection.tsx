import React, { useState, useMemo } from 'react';
import { Star, MessageSquarePlus, CheckCircle, Trash2, ThumbsUp } from 'lucide-react';
import { Property, Review } from '../../types';
import { useApp } from '../../context/AppContext';
import { AddReviewModal } from './AddReviewModal';

interface PropertyReviewsSectionProps {
  property: Property;
}

export const PropertyReviewsSection: React.FC<PropertyReviewsSectionProps> = ({ property }) => {
  const { user, reviews, deleteReview } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  // Filter reviews for this property
  const propertyReviews = useMemo(() => {
    return reviews.filter(r => r.propertyId === property.id);
  }, [reviews, property.id]);

  // Sorted reviews
  const sortedReviews = useMemo(() => {
    const list = [...propertyReviews];
    if (sortBy === 'highest') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'lowest') {
      return list.sort((a, b) => a.rating - b.rating);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [propertyReviews, sortBy]);

  // Statistics calculation
  const totalCount = propertyReviews.length;
  const avgRating = totalCount > 0
    ? Math.round((propertyReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount) * 10) / 10
    : (property.rating || 0);

  // Criteria calculations
  const criteriaStats = useMemo(() => {
    if (totalCount === 0) {
      return { location: 4.8, cleanliness: 4.7, communication: 4.9, valueForMoney: 4.6 };
    }
    let locSum = 0, cleanSum = 0, commSum = 0, valSum = 0;
    let count = 0;

    propertyReviews.forEach(r => {
      if (r.criteriaRatings) {
        locSum += r.criteriaRatings.location || r.rating;
        cleanSum += r.criteriaRatings.cleanliness || r.rating;
        commSum += r.criteriaRatings.communication || r.rating;
        valSum += r.criteriaRatings.valueForMoney || r.rating;
        count++;
      }
    });

    if (count === 0) return { location: 4.8, cleanliness: 4.7, communication: 4.9, valueForMoney: 4.6 };

    return {
      location: Math.round((locSum / count) * 10) / 10,
      cleanliness: Math.round((cleanSum / count) * 10) / 10,
      communication: Math.round((commSum / count) * 10) / 10,
      valueForMoney: Math.round((valSum / count) * 10) / 10
    };
  }, [propertyReviews, totalCount]);

  // Star breakdown
  const starCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    propertyReviews.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rounded] = (counts[rounded] || 0) + 1;
    });
    return counts;
  }, [propertyReviews]);

  const toggleHelpful = (reviewId: string) => {
    setHelpfulLiked(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch {
      return 'Récemment';
    }
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8" id="reviews-section">
      {/* Header with Title and Add Review button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Avis des locataires
            </h2>
            {totalCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                {totalCount} {totalCount > 1 ? 'avis vérifiés' : 'avis vérifié'}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Retours d'expérience authentiques de locataires ayant séjourné dans ce logement.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
          id="write-review-btn"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Laisser un avis</span>
        </button>
      </div>

      {/* Overview Cards & Criteria Breakdown */}
      {totalCount > 0 ? (
        <div className="py-6 border-b border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Score Big Display */}
            <div className="md:col-span-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {avgRating.toFixed(1)}
              </span>
              <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      Math.round(avgRating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Basé sur {totalCount} évaluation{totalCount > 1 ? 's' : ''}
              </p>
            </div>

            {/* Criteria Breakdown */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Emplacement & Transports</span>
                  <span>{criteriaStats.location.toFixed(1)}/5</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${(criteriaStats.location / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Propreté & Équipements</span>
                  <span>{criteriaStats.cleanliness.toFixed(1)}/5</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${(criteriaStats.cleanliness / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Réactivité du bailleur</span>
                  <span>{criteriaStats.communication.toFixed(1)}/5</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${(criteriaStats.communication / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Rapport Qualité / Prix</span>
                  <span>{criteriaStats.valueForMoney.toFixed(1)}/5</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${(criteriaStats.valueForMoney / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Sorting bar & list */}
      <div className="pt-6">
        {totalCount > 0 ? (
          <>
            <div className="flex items-center justify-between gap-4 mb-6">
              <span className="text-xs font-bold text-slate-700">
                {totalCount} avis publié{totalCount > 1 ? 's' : ''}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Trier par :</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                >
                  <option value="recent">Plus récents</option>
                  <option value="highest">Meilleures notes</option>
                  <option value="lowest">Moins bonnes notes</option>
                </select>
              </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
              {sortedReviews.map((rev) => {
                const isAuthor = user?.id === rev.tenantId || user?.name === rev.tenantName;
                const isLiked = Boolean(helpfulLiked[rev.id]);

                return (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        {rev.tenantAvatar ? (
                          <img
                            src={rev.tenantAvatar}
                            alt={rev.tenantName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center border border-slate-200">
                            {rev.tenantName.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {rev.tenantName}
                            </h4>
                            {rev.isVerifiedTenant && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <CheckCircle className="w-3 h-3" />
                                Locataire vérifié
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{formatDate(rev.createdAt)}</span>
                            {rev.rentalPeriod && (
                              <>
                                <span>•</span>
                                <span>Séjour de {rev.rentalPeriod}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rating Stars & Delete */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/50 px-2 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-amber-800">
                            {rev.rating.toFixed(1)}
                          </span>
                        </div>

                        {isAuthor && (
                          <button
                            type="button"
                            onClick={() => deleteReview(rev.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Supprimer mon avis"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Criteria Badges */}
                    {rev.criteriaRatings && (
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px] font-medium text-slate-600">
                        <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          Emplacement : <strong>{rev.criteriaRatings.location}/5</strong>
                        </span>
                        <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          Propreté : <strong>{rev.criteriaRatings.cleanliness}/5</strong>
                        </span>
                        <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          Bailleur : <strong>{rev.criteriaRatings.communication}/5</strong>
                        </span>
                        <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          Rapport Q/P : <strong>{rev.criteriaRatings.valueForMoney}/5</strong>
                        </span>
                      </div>
                    )}

                    {/* Review Comment */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-3">
                      {rev.comment}
                    </p>

                    {/* Helpful footer */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <button
                        type="button"
                        onClick={() => toggleHelpful(rev.id)}
                        className={`inline-flex items-center gap-1.5 transition-colors ${
                          isLiked ? 'text-slate-900 font-bold' : 'hover:text-slate-600'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-slate-900 text-slate-900' : ''}`} />
                        <span>{isLiked ? 'Avis utile (1)' : 'Cet avis vous a été utile ?'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-10 bg-slate-50/70 rounded-2xl border border-slate-100 p-6">
            <div className="w-12 h-12 rounded-full bg-white text-slate-400 flex items-center justify-center mx-auto mb-3 border border-slate-200 shadow-xs">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Aucun avis pour le moment
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Vous avez déjà visité ou habité ce logement ? Partagez votre expérience avec la communauté algérienne !
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Rédiger le premier avis
            </button>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        property={property}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
