import { Terminal } from "@/components/Terminal";
export function BehindCode() {
  return <section className="terminal-section section-pad" id="terminal" aria-labelledby="terminal-title"><div className="terminal-heading"><span className="eyebrow mono">04 / BEHIND THE CODE</span><h2 id="terminal-title" data-reveal>A different way<br />to say <span className="serif">hello.</span></h2><p>No installation required.<br /><span className="muted">Just a little curiosity.</span></p></div><div data-reveal><Terminal /></div><div className="terminal-footnote mono"><span>TRY: WHOAMI / PROJECTS / SKILLS</span><span>YOUR KEYBOARD IS WELCOME HERE.</span></div></section>;
}
