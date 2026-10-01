export function Sculpture() {
  return <div className="sculpture" aria-hidden="true">
    <svg viewBox="0 0 600 600" className="sculpture-svg" fill="none">
      <defs>
        <linearGradient id="ribbon" x1="120" y1="100" x2="470" y2="500" gradientUnits="userSpaceOnUse"><stop stopColor="#173bc8" /><stop offset=".3" stopColor="#5276ff" /><stop offset=".55" stopColor="#193fee" /><stop offset=".8" stopColor="#6788ff" /><stop offset="1" stopColor="#1234b5" /></linearGradient>
        <linearGradient id="edge" x1="170" y1="80" x2="460" y2="500" gradientUnits="userSpaceOnUse"><stop stopColor="#9bb0ff" /><stop offset=".45" stopColor="#173ad2" /><stop offset="1" stopColor="#86a0ff" /></linearGradient>
      </defs>
      <g transform="rotate(-28 300 300)">
        <ellipse cx="308" cy="317" rx="160" ry="213" stroke="#0e205e" strokeWidth="84" />
        <ellipse cx="291" cy="286" rx="160" ry="213" stroke="url(#ribbon)" strokeWidth="78" />
        <ellipse cx="291" cy="286" rx="198" ry="251" stroke="url(#edge)" strokeWidth="1.3" />
        <ellipse cx="291" cy="286" rx="121" ry="174" stroke="#879fff" strokeOpacity=".55" strokeWidth="1.2" />
        {Array.from({ length: 21 }, (_, i) => <ellipse key={i} cx="291" cy="286" rx={122 + i * 3.7} ry={175 + i * 3.7} stroke="#b8c8ff" strokeOpacity={0.025 + (i % 3) * 0.015} strokeWidth="0.8" />)}
      </g>
    </svg>
    <div className="sculpture-cross cross-one">+</div><div className="sculpture-cross cross-two">+</div>
    <span className="sculpture-caption mono">FIG. 01 — CONTINUOUSLY ITERATING</span>
  </div>;
}
