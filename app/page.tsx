import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

export default function Page() {
  return (
    <main>
      <section id="about" className="page" aria-label="About Ismail Ahmed">
        <Hero />
        <Stats />
      </section>
      <Projects />
      <Skills />
      <Contact />
    </main>
  )
}
