"use client";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/profile";
import { Arrow } from "./Arrow";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const compact = matchMedia("(max-width: 1023px)");
    const sync = () => {
      if (navRef.current) navRef.current.inert = compact.matches && !open;
      if (!compact.matches) setOpen(false);
    };
    sync(); compact.addEventListener("change", sync);
    const previous = document.body.style.overflow;
    if (open && compact.matches) document.body.style.overflow = "hidden";
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false); document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previous;
      compact.removeEventListener("change", sync);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return <header className="site-header" onKeyDown={event => {
    if (!open || event.key !== "Tab" || !matchMedia("(max-width: 1023px)").matches) return;
    const targets = [...event.currentTarget.querySelectorAll<HTMLElement>(".menu-toggle, .nav-links a")];
    const first = targets[0]; const last = targets[targets.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }}>
    <a href="#home" className="wordmark" aria-label="kd — Kuy Daly home" onClick={() => setOpen(false)}>kd<span className="brand-square" /></a>
    <span className="header-label mono">DEVELOPER / CREATIVE THINKER</span>
    <button className="menu-toggle mono" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? "CLOSE −" : "MENU +"}</button>
    <nav ref={navRef} id="main-nav" aria-label="Main navigation" className={open ? "nav-links is-open" : "nav-links"} onKeyDown={event => { if (event.key === "Escape") { setOpen(false); document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus(); } }}>{navigation.map((item, i) => <a key={item.href} href={item.href} onClick={() => setOpen(false)} className={item.label === "Contact" ? "contact-nav" : ""}><span className="mobile-nav-number mono">0{i + 1}</span>{item.label}{item.label === "Contact" && <Arrow diagonal />}</a>)}</nav>
  </header>;
}
