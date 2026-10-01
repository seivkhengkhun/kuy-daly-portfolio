import { profile } from "@/data/profile";
import { Sculpture } from "@/components/Sculpture";
import { MagneticLink } from "@/components/MagneticLink";
import { Arrow } from "@/components/Arrow";

export function Hero() {
  return <section className="hero" id="home" aria-labelledby="hero-title">
    <div className="hero-grid" aria-hidden="true" />
    <div className="hero-kicker mono"><span>FULL-STACK DEVELOPER</span><span>BASED IN CAMBODIA <span className="tiny-star">✳</span></span></div>
    <h1 id="hero-title" className="hero-title"><span className="hero-kuy">KUY</span><span className="hero-daly">{Array.from("DALY").map((letter, i) => <span className="daly-letter" key={i}>{letter}</span>)}</span></h1>
    <Sculpture />
    <div className="hero-aside"><p>Thoughtful interfaces.<br />Useful systems.<br /><span className="muted">The code in between.</span></p><MagneticLink href="#work" className="hero-work-link">Explore my work <Arrow diagonal /></MagneticLink></div>
    <div className="hero-code mono"><span className="code-muted">const</span> developer = &#123;<br /><span className="indent">name: <span>&quot;Kuy Daly&quot;</span>,</span><br /><span className="indent">focus: <span>&quot;Full Stack&quot;</span>,</span><br /><span className="indent">status: <span>&quot;Building&quot;</span></span><br />&#125;</div>
    <div className="hero-footer mono"><a href="#work" className="scroll-cue"><span className="scroll-line" />SCROLL TO EXPLORE</a><span className="hero-edition">{profile.year} PORTFOLIO<span className="hero-volume"> / VOL. 01</span></span><span className="hero-index">[ 01 — 06 ]</span></div>
  </section>;
}
