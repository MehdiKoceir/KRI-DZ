import { AlgerianWilaya } from '../types';

export const ALGERIAN_WILAYAS: AlgerianWilaya[] = [
  {
    code: '16',
    name: 'Alger',
    arName: 'الجزائر',
    popularCities: ['Hydra', 'Bab Ezzouar', 'Dely Ibrahim', 'Sidi Yahia', 'Kouba', 'Cheraga', 'El Biar', 'Said Hamdine'],
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '31',
    name: 'Oran',
    arName: 'وهران',
    popularCities: ['Akid Lotfi', 'Canastel', 'Maraval', 'Centre-ville', 'Bir El Djir', 'Es Senia'],
    image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '09',
    name: 'Blida',
    arName: 'البليدة',
    popularCities: ['Centre-ville', 'Ouled Yaïch', 'Boufarik', 'Zabana', 'Beni Mered'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '25',
    name: 'Constantine',
    arName: 'قسنطينة',
    popularCities: ['Ali Mendjeli', 'Coudiat', 'Sidi Mabrouk', 'Zouaghi', 'Belhadj'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '02',
    name: 'Chlef',
    arName: 'الشلف',
    popularCities: ['Hay Bensouna', 'Centre-ville', 'Hay Chettia', 'Oum Drou', 'Ouled Fares'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '06',
    name: 'Béjaïa',
    arName: 'بجاية',
    popularCities: ['Targa Ouzemour', 'Ihadadene', 'Centre-ville', 'Tichy', 'Aokas'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '15',
    name: 'Tizi Ouzou',
    arName: 'تيزي وزو',
    popularCities: ['Nouvelle Ville', 'Centre-ville', 'Bastos', 'Tala Allam'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '19',
    name: 'Sétif',
    arName: 'سطيف',
    popularCities: ['Ain Tebinet', 'El Hidhab', 'Centre-ville', 'Bel-Air'],
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  }
];

export const AMENITIES_LIST = [
  { id: 'water_tank', label: 'Bâche à eau / Citerne', icon: 'Droplets' },
  { id: 'ac', label: 'Climatisation', icon: 'Wind' },
  { id: 'heating', label: 'Chauffage central', icon: 'Flame' },
  { id: 'elevator', label: 'Ascenseur', icon: 'ArrowUpDown' },
  { id: 'parking', label: 'Place de parking / Garage', icon: 'Car' },
  { id: 'internet', label: 'Fibre optique / Wi-Fi', icon: 'Wifi' },
  { id: 'equipped_kitchen', label: 'Cuisine équipée', icon: 'Utensils' },
  { id: 'balcony', label: 'Balcon / Terrasse', icon: 'Sun' },
  { id: 'security', label: 'Interphone & Caméras', icon: 'ShieldCheck' },
  { id: 'near_transport', label: 'Proche Métro / Tramway / Bus', icon: 'Train' },
  { id: 'near_univ', label: 'Proximité Université', icon: 'GraduationCap' },
];
