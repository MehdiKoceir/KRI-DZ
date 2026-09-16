import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  propertyTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ propertyTitle, isOpen, onClose }) => {
  const [reason, setReason] = useState('already_rented');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-slate-900 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Signalement transmis</h3>
            <p className="text-xs text-slate-500">
              Merci de nous aider à maintenir l'intégrité des annonces sur KriDZ.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <AlertCircle className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Signaler cette annonce
              </h3>
            </div>

            <p className="text-xs text-slate-500 line-clamp-1">
              {propertyTitle}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Motif du signalement
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="already_rented">Ce bien est déjà loué / indisponible</option>
                <option value="incorrect_price">Prix ou informations non conformes</option>
                <option value="unreachable">Bailleur injoignable</option>
                <option value="fraud">Suspicion de fausse annonce</option>
                <option value="other">Autre problème</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Précisions
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Décrivez brièvement le problème..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-slate-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Transmettre le signalement
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
