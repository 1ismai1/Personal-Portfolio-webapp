import Reveal from './Reveal'

const categories = [
  {
    label: 'Languages',
    skills: ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'SQL', 'HTML / CSS', 'MATLAB'],
  },
  {
    label: 'Frameworks & Tools',
    skills: ['Next.js', 'SvelteKit', 'Firebase', 'Git / GitHub', 'VS Code', 'JupyterLab', 'Greenfoot'],
  },
  {
    label: 'Engineering',
    skills: ['Algorithm Design', '3D Printing / CAD', 'Mathematical Modelling', 'Debugging', 'Iterative Prototyping', 'Technical Writing'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="skills" aria-labelledby="skills-title">
      <div className="container">
        <Reveal className="sec-head">
          <div className="sec-label">Technical Toolkit</div>
          <h2 className="sec-title" id="skills-title">Skills</h2>
        </Reveal>

        <div className="skills-cols">
          {categories.map((cat, i) => (
            <Reveal key={cat.label} delay={i * 100}>
              <div className="skill-cat">{cat.label}</div>
              <div className="skill-row">
                {cat.skills.map(s => <span key={s} className="spill">{s}</span>)}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
