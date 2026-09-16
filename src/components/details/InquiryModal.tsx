import React, { useState } from 'react';
import { X, Send, CheckCircle2, User, Phone, Mail, Calendar } from 'lucide-react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatDZD } from '../../utils/format';

interface InquiryModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ property, isOpen, onClose }) => {
  const { user, submitInquiry } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+213 ');
  const [email, setEmail] = useState(user?.email || '');
  const [moveInDate, setMoveInDate] = useState('2026-04-01');
  const [message, setMessage] = useState(
    `Bonjour, je suis très intéressé(e) par votre bien "${property.title}" situé à ${property.city}. Est-il toujours disponible pour une visite ?`
  );
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    submitInquiry({
      propertyId: property.id,
      name,
      phone,
      email,
      moveInDate,
      message
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Demande envoyée avec succès</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto">
              Le bailleur <strong>{property.ownerName}</strong> a reçu votre message et vos coordonnées.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Header with property snippet */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Demande de contact / Visite
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 line-clamp-1">
                Contacter {property.ownerName}
              </h2>
              <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{property.title}</p>
                  <p className="text-[11px] text-slate-500 font-semibold">{formatDZD(property.pricePerMonthDZD)}</p>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Votre nom complet
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Karim Hadj"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numéro de téléphone (+213)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+213 550 00 00 00"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date souhaitée
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-slate-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email (Optionnel)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.dz"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message au bailleur
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-slate-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer ma demande</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
