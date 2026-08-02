import { HeroSection } from '../components/home/HeroSection'
import { WhyUsSection } from '../components/home/WhyUsSection'
import { PanoramaSection } from '../components/home/PanoramaSection'
import { RoomsSection } from '../components/home/RoomsSection'
import { DiningSection } from '../components/home/DiningSection'
import { ExploreSection } from '../components/home/ExploreSection'
import { HostServiceSection } from '../components/home/HostServiceSection'
import { ContactCtaSection } from '../components/home/ContactCtaSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WhyUsSection />
      <PanoramaSection />
      <RoomsSection />
      <DiningSection />
      <ExploreSection />
      <HostServiceSection />
      <ContactCtaSection />
    </main>
  )
}
