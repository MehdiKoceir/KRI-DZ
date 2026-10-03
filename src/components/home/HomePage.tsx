import React from 'react';
import { HeroSection } from './HeroSection';
import { FeaturedProperties } from './FeaturedProperties';
import { CtaBanner } from './CtaBanner';

export const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero & Recherche Directe avec Puces de besoins en 1 clic */}
      <HeroSection />

      {/* 2. Annonces disponibles immédiatement sous la recherche (pas de défilement superflu) */}
      <FeaturedProperties />

      {/* 3. Bandeau compact pour les propriétaires et bailleurs */}
      <CtaBanner />
    </main>
  );
};
