import React from 'react';
import { HeroSection } from './HeroSection';
import { FeaturedProperties } from './FeaturedProperties';
import { PopularCities } from './PopularCities';
import { StudentHousingSection } from './StudentHousingSection';
import { WhyChooseKriDZ } from './WhyChooseKriDZ';
import { HowItWorks } from './HowItWorks';
import { TrustedPartners } from './TrustedPartners';
import { CtaBanner } from './CtaBanner';

export const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedProperties />
      <PopularCities />
      <StudentHousingSection />
      <WhyChooseKriDZ />
      <HowItWorks />
      <TrustedPartners />
      <CtaBanner />
    </main>
  );
};
