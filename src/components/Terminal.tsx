"use client";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

type Entry = { id: number; command: string; output: string; href?: string; label?: string };
const commands = ["help", "whoami", "projects", "skills", "github", "contact", "clear", "secret"];
const initial: Entry[] = [
  { id: 0, command: "whoami", output: `${profile.name}\n${profile.role}\nBased in ${profile.location}` },
  { id: 1, command: "current-focus", output: `${profile.focus}\n\nAnd occasionally fighting bugs\nthat definitely “worked yesterday.”` },
];

export function Terminal() {
  const [entries, setEntries] = useState<Entry[]>(initial);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(2);
  useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [entries]);
  useEffect(() => {
    const viewport = window.visualViewport;
    let frame = 0;
    const keepInputVisible = () => {
      if (!matchMedia("(max-width: 1023px)").matches || document.activeElement !== inputRef.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => inputRef.current?.scrollIntoView({ block: "nearest", behavior: "instant" }));
    };
    viewport?.addEventListener("resize", keepInputVisible);
    return () => { cancelAnimationFrame(frame); viewport?.removeEventListener("resize", keepInputVisible); };
  }, []);

  function execute(input: string) {
    const command = input.trim().toLowerCase();
    if (!command) return;
    setHistory(prev => [...prev, input.trim()]); setHistoryIndex(-1); setValue("");
    if (command === "clear") { setEntries([]); setAnnouncement("Terminal cleared."); return; }
    let output = ""; let href: string | undefined; let label: string | undefined;
    switch (command) {
      case "help": output = "Available commands:\n\nwhoami       A little about Daly\nprojects     Explore selected work\nskills       What's in the toolkit\ngithub       Find the source\ncontact      Start a conversation\nclear        A clean slate\nsecret       Something undocumented\n\nTip: ↑ / ↓ for history. Tab to complete."; break;
      case "whoami": output = `${profile.name}\n${profile.role}\nInformation Technology student\nBased in ${profile.location}`; break;
      case "current-focus": output = profile.focus; break;
      case "projects": output = projects.map(p => `${p.id}  ${p.name} — ${p.stack.join(" / ")}`).join("\n"); href = "#work"; label = "Explore selected work"; break;
      case "skills": output = skillGroups.map(g => `${g.label}\n${g.items.join(" · ")}\n${g.note}`).join("\n\n"); break;
      case "github": output = "DalyTechie / public repositories"; href = profile.github; label = "Open GitHub"; break;
      case "contact": output = `${profile.email}\nBased in ${profile.location}. Open to a good conversation.`; href = `mailto:${profile.email}`; label = "Write an email"; break;
      case "secret": output = "There's one undocumented contributor.\n\nHe doesn't really know what he's doing...\n\nbut he wanted this place to represent\nhow good you are.\n\n♥"; break;
      default: output = `Command not found: ${input.trim().slice(0, 80)}\nType help to see what works here.`;
    }
    setEntries(prev => [...prev.slice(-29), { id: nextId.current++, command: input.trim(), output, href, label }]);
    setAnnouncement(output);
  }

  return <div className="terminal-window"><div className="terminal-titlebar"><div className="terminal-dots" aria-hidden="true"><i /><i /><i /></div><span className="mono">daly — portfolio / interactive session</span><span className="terminal-title-end mono">zsh</span></div><div className="terminal-scroll" ref={scrollRef} data-lenis-prevent tabIndex={0} role="region" aria-label="Terminal output">{entries.map(entry => <div className={entry.command.toLowerCase() === "secret" ? "terminal-entry secret-output" : "terminal-entry"} key={entry.id}><div className="terminal-prompt"><span>daly@portfolio</span><span className="terminal-path">~ %</span><span className="terminal-command">{entry.command}</span></div><pre>{entry.output}</pre>{entry.href && <a className="terminal-result-link" href={entry.href} target={entry.href.startsWith("http") ? "_blank" : undefined} rel={entry.href.startsWith("http") ? "noopener noreferrer" : undefined}>{entry.label} ↗</a>}</div>)}<form className="terminal-input-row" onSubmit={event => { event.preventDefault(); execute(value); }}><label htmlFor="terminal-command"><span>daly@portfolio</span><span className="terminal-path">~ %</span><span className="sr-only">Terminal command</span></label><input ref={inputRef} enterKeyHint="send" id="terminal-command" name="command" type="text" value={value} onChange={e => setValue(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} maxLength={120} placeholder="Type help to begin" onKeyDown={e => {
      if (e.key === "ArrowUp" && history.length) { e.preventDefault(); const index = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1); setHistoryIndex(index); setValue(history[index]); }
      if (e.key === "ArrowDown" && historyIndex >= 0) { e.preventDefault(); const index = historyIndex + 1; if (index >= history.length) { setHistoryIndex(-1); setValue(""); } else { setHistoryIndex(index); setValue(history[index]); } }
      if (e.key === "Tab" && value.trim()) { const matches = commands.filter(c => c.startsWith(value.toLowerCase())); if (matches.length === 1) { e.preventDefault(); setValue(matches[0]); } }
    }} /><button type="submit" aria-label="Run command">↵</button></form></div><div className="terminal-status mono"><span><i /> SESSION READY</span><span>UTF-8 <span className="terminal-status-right">/ NO WRONG QUESTIONS</span></span></div><span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span></div>;
}
