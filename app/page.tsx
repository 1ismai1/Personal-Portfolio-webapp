import PagedHome from '@/components/PagedHome'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Embedded from '@/components/Embedded'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

export default function Page() {
  return (
    <main>
      <PagedHome>
        <Hero />
        <Embedded />
        <Projects />
        <Skills />
        <Contact />
      </PagedHome>
    </main>
  )
}
