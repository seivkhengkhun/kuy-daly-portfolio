"use client";
import { useState } from "react";
import { buildAreas, skillGroups, skillVerificationNote } from "@/data/skills";
import { Arrow } from "@/components/Arrow";

export function Stack() {
  const [active, setActive] = useState<string | null>("01");
  const desktopHover = () => matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
  return <section className="stack-section section-pad" id="skills" aria-labelledby="stack-title"><div className="stack-heading"><span className="eyebrow mono">03 / THE TOOLKIT</span><h2 id="stack-title" data-reveal>THINGS<br />I <span className="serif">BUILD.</span></h2><p>Tools change.<br />The fundamentals stay.</p><span className="stack-asterisk" aria-hidden="true">✳</span></div><div className="stack-content"><div className="build-areas">{buildAreas.map(area => <div className={active === area.number ? "build-row active" : "build-row"} key={area.number}><button onMouseEnter={() => { if (desktopHover()) setActive(area.number); }} onFocus={() => { if (desktopHover()) setActive(area.number); }} onClick={() => setActive(current => current === area.number ? null : area.number)} aria-expanded={active === area.number} aria-controls={`area-${area.number}`}><span className="mono build-number">{area.number}</span><span>{area.title}</span><Arrow diagonal /></button><div className="build-detail" id={`area-${area.number}`} hidden={active !== area.number}><p className="mono">{area.tech}</p><p>{area.detail}</p></div></div>)}</div><div className="skill-groups">{skillGroups.map(group => <div className="skill-group" key={group.label}><h3 className="mono">{group.label}</h3><p>{group.note}</p><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div><p className="skill-note mono">{skillVerificationNote}</p></div></section>;
}
