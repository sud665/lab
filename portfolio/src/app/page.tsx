import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  SkillsSection,
  ContactSection,
} from '@/components/sections'
import { Navigation, Footer } from '@/components/layout'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
