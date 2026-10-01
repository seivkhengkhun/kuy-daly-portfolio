import { experience } from "@/data/experience";
export function Experience() {
  return <section className="experience-section section-pad" id="experience" aria-labelledby="experience-title"><div><span className="eyebrow mono">05 / STILL IN PROGRESS</span><h2 id="experience-title" data-reveal>The path<br /><span className="serif">so far.</span></h2></div><div className="timeline">{experience.map(item => <article className="timeline-item" key={item.title} data-reveal><div className="timeline-meta mono"><span>{item.date}</span><span>{item.type}</span></div><h3>{item.title}</h3><p className="timeline-place">{item.place}</p><p className="timeline-description">{item.description}</p></article>)}</div></section>;
}
