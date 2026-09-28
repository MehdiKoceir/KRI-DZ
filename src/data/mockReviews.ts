import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    propertyId: 'kri-001',
    tenantId: 'user-tenant-demo',
    tenantName: 'Karim Benali',
    tenantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    criteriaRatings: {
      location: 5,
      cleanliness: 5,
      communication: 5,
      valueForMoney: 4
    },
    comment: 'Appartement exceptionnel, spacieux et très lumineux à Hydra. La bâche à eau avec suppresseur automatique est un vrai soulagement durant l\'été. L\'agence El Bahdja est d\'un professionnalisme exemplaire.',
    rentalPeriod: '1 an (2025 - 2026)',
    isVerifiedTenant: true,
    createdAt: '2026-02-15T14:30:00Z'
  },
  {
    id: 'rev-002',
    propertyId: 'kri-001',
    tenantId: 'user-tenant-yassine',
    tenantName: 'Yassine Touati',
    tenantAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 4.5,
    criteriaRatings: {
      location: 5,
      cleanliness: 4,
      communication: 5,
      valueForMoney: 4
    },
    comment: 'Quartier très calme et sécurisé, idéal pour une famille. Le parking au sous-sol est très pratique car il est difficile de stationner dehors à Hydra. Seul bémol le loyer qui est un peu élevé mais justifié par les prestations.',
    rentalPeriod: '6 mois',
    isVerifiedTenant: true,
    createdAt: '2026-01-20T09:15:00Z'
  },
  {
    id: 'rev-003',
    propertyId: 'kri-002',
    tenantId: 'user-tenant-amina',
    tenantName: 'Amina Saidi',
    tenantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    criteriaRatings: {
      location: 5,
      cleanliness: 5,
      communication: 5,
      valueForMoney: 5
    },
    comment: 'Studio parfait pour mes études à l\'université de Bab Ezzouar ! Le tramway est à moins de 5 minutes à pied, le wifi fibre marche très bien pour mes révisions et le propriétaire M. Reda est toujours disponible en cas de besoin.',
    rentalPeriod: '10 mois (Année universitaire)',
    isVerifiedTenant: true,
    createdAt: '2026-03-05T18:45:00Z'
  },
  {
    id: 'rev-004',
    propertyId: 'kri-002',
    tenantId: 'user-tenant-mourad',
    tenantName: 'Mourad Cherif',
    tenantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4,
    criteriaRatings: {
      location: 4,
      cleanliness: 4,
      communication: 5,
      valueForMoney: 4
    },
    comment: 'Studio moderne et bien équipé. Quartier vivant avec supérette et fast-food juste en bas. Très bon rapport qualité/prix pour Bab Ezzouar.',
    rentalPeriod: '3 mois',
    isVerifiedTenant: true,
    createdAt: '2026-02-28T11:20:00Z'
  },
  {
    id: 'rev-005',
    propertyId: 'kri-003',
    tenantId: 'user-tenant-sofiane',
    tenantName: 'Sofiane Kaci',
    tenantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    criteriaRatings: {
      location: 5,
      cleanliness: 5,
      communication: 4,
      valueForMoney: 5
    },
    comment: 'Vue sur mer splendide depuis le balcon ! L\'appartement à Akid Lotfi est très bien aéré et la cuisine est top. Je recommande vivement pour des séjours professionnels ou en famille à Oran.',
    rentalPeriod: '8 mois',
    isVerifiedTenant: true,
    createdAt: '2026-03-10T16:10:00Z'
  },
  {
    id: 'rev-006',
    propertyId: 'kri-005',
    tenantId: 'user-tenant-lydia',
    tenantName: 'Lydia Hamdi',
    tenantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    criteriaRatings: {
      location: 5,
      cleanliness: 5,
      communication: 5,
      valueForMoney: 4
    },
    comment: 'Superbe duplex avec piscine à Zéralda. Parfait pour se détendre loin du bruit du centre-ville. Propriétaire très accueillant et respectueux.',
    rentalPeriod: '1 an',
    isVerifiedTenant: true,
    createdAt: '2026-01-14T10:00:00Z'
  }
];
