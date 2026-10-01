import { projects } from "@/data/projects";
import { ProjectVisual } from "@/components/ProjectVisual";
import { Arrow } from "@/components/Arrow";
import { TiltVisual } from "@/components/TiltVisual";

export function SelectedWork() {
  return <section className="work-section" id="work" aria-labelledby="work-title">
    <div className="work-heading section-heading"><div><span className="eyebrow mono">01 / SELECTED WORK</span><h2 id="work-title">Less talk.<br /><span className="serif">More building.</span></h2></div><p>A few things I&apos;ve put into the world.<br /><span className="muted">From interfaces to the systems behind them.</span></p><div className="work-direction mono"><span>SCROLL TO DISCOVER</span><Arrow /></div></div>
    <div className="work-pin"><div className="work-track">{projects.map(project => <article className="project-panel" key={project.id} id={`project-${project.id}`} aria-labelledby={`project-title-${project.id}`}>
      <div className="project-copy"><div className="project-topline"><span className="project-number">{project.id}</span><span className="mono project-category">{project.category}</span></div><h3 id={`project-title-${project.id}`}>{project.name}</h3><p className="project-description">{project.description}</p><div className="project-contribution"><span className="mono">CONTRIBUTION</span><p>{project.contribution}</p></div><ul className="project-stack mono" aria-label="Technologies">{project.stack.map(tech => <li key={tech}>{tech}</li>)}</ul><div className="project-links"><a href={project.github} target="_blank" rel="noopener noreferrer">View source <Arrow diagonal /></a>{project.live ? <a href={project.live} target="_blank" rel="noopener noreferrer">Live site <Arrow diagonal /></a> : <span className="mono demo-note">SOURCE AVAILABLE</span>}</div></div>
      <div className="project-media" style={{ background: project.color }}><div className="project-media-label mono"><span>{project.id} / {project.name.toUpperCase()}</span><span>{project.image ? "ACTUAL INTERFACE" : "SOURCE STUDY"}</span></div><div className="project-reveal"><TiltVisual><ProjectVisual project={project} /></TiltVisual></div><div className="project-media-footer mono"><span>{project.image ? "SCREEN CAPTURE / PUBLIC PROJECT" : "ILLUSTRATIVE VISUAL / PUBLIC SOURCE LINKED"}</span><span>↗</span></div></div>
    </article>)}</div><div className="work-progress" aria-hidden="true"><span className="work-progress-fill" /></div></div>
  </section>;
}
