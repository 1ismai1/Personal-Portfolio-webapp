export default function Stats() {
  return (
    <div className="stats" role="region" aria-label="Quick stats">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-cell">
            <div className="stat-num">3<em>.9</em></div>
            <div className="stat-lbl">GPA at McMaster</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num">2<em>×</em></div>
            <div className="stat-lbl">Hackathon Winner</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num">63<em>+</em></div>
            <div className="stat-lbl">Teams Outranked</div>
          </div>
        </div>
      </div>
    </div>
  )
}
