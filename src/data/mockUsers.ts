import { User, Inquiry } from '../types';

export const DEMO_USERS: Record<string, User> = {
  tenant: {
    id: 'user-tenant-demo',
    name: 'Amina Bouzid',
    email: 'amina.bouzid@gmail.com',
    phone: '+213 554 12 34 56',
    role: 'tenant',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Étudiante en master informatique à l\'USTHB, à la recherche d\'un studio ou colocation calme à Bab Ezzouar ou Alger Centre.',
    preferredCity: 'Alger',
    budgetMinDZD: 25000,
    budgetMaxDZD: 45000,
    createdAt: '2026-01-15T09:00:00Z'
  },
  owner: {
    id: 'owner-particulier-1',
    name: 'Youcef Benali',
    email: 'youcef.benali@outlook.dz',
    phone: '+213 661 89 22 40',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Propriétaire particulier à Alger et Blida. Mes biens sont entretenus et équipés pour le confort de mes locataires.',
    createdAt: '2025-11-20T11:00:00Z'
  },
  agency: {
    id: 'owner-agency-1',
    name: 'Agence Immobilière El Bahdja',
    email: 'contact@elbahdja-immo.dz',
    phone: '+213 550 42 18 90',
    role: 'agency',
    agencyName: 'El Bahdja Immobilier Agréé',
    agencyLogo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
    agencyRegisterNumber: 'RC 16/00-0982341B20',
    avatar: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
    bio: 'Agence immobilière agréée par l\'État, spécialisée dans la location résidentielle et professionnelle haut standing sur Alger et ses environs.',
    preferredCity: 'Alger',
    createdAt: '2025-08-10T14:30:00Z'
  }
};

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-001',
    propertyId: 'kri-002',
    propertyTitle: 'Studio Cosy Meublé Idéal Étudiant ou Jeune Cadre - Bab Ezzouar',
    propertyPriceDZD: 32000,
    propertyCity: 'Bab Ezzouar (Alger)',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    tenantId: 'user-tenant-demo',
    tenantName: 'Amina Bouzid',
    tenantEmail: 'amina.bouzid@gmail.com',
    tenantPhone: '+213 554 12 34 56',
    ownerId: 'owner-particulier-1',
    ownerName: 'Youcef Benali',
    message: 'Salam alaykoum M. Benali, je suis étudiante à l\'USTHB et très intéressée par votre studio. Serait-il possible de convenir d\'une visite ce samedi après-midi ?',
    moveInDate: '2026-04-01',
    status: 'visit_scheduled',
    createdAt: '2026-03-10T11:20:00Z'
  },
  {
    id: 'inq-002',
    propertyId: 'kri-003',
    propertyTitle: 'Appartement F3 Moderne et Ensoleillé - Blida Centre',
    propertyPriceDZD: 42000,
    propertyCity: 'Blida Centre',
    propertyImage: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=600&q=80',
    tenantId: 'user-tenant-demo',
    tenantName: 'Amina Bouzid',
    tenantEmail: 'amina.bouzid@gmail.com',
    tenantPhone: '+213 554 12 34 56',
    ownerId: 'owner-particulier-2',
    ownerName: 'Mourad Cherif',
    message: 'Bonjour M. Cherif, l\'appartement F3 est-il toujours disponible pour une location avec engagement annuel ? Merci.',
    moveInDate: '2026-04-15',
    status: 'replied',
    createdAt: '2026-03-11T16:45:00Z'
  }
];
