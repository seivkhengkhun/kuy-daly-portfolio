"use client";
import { useState } from "react";
import { navigation } from "@/data/profile";
import { Arrow } from "./Arrow";

export function Navigation() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <a href="#home" className="wordmark" aria-label="kd — Kuy Daly home" onClick={() => setOpen(false)}>kd<span className="brand-square" /></a>
    <span className="header-label mono">DEVELOPER / CREATIVE THINKER</span>
    <button className="menu-toggle mono" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? "CLOSE −" : "MENU +"}</button>
    <nav id="main-nav" aria-label="Main navigation" className={open ? "nav-links is-open" : "nav-links"} onKeyDown={event => { if (event.key === "Escape") { setOpen(false); document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus(); } }}>{navigation.map((item, i) => <a key={item.href} href={item.href} onClick={() => setOpen(false)} className={item.label === "Contact" ? "contact-nav" : ""}><span className="mobile-nav-number mono">0{i + 1}</span>{item.label}{item.label === "Contact" && <Arrow diagonal />}</a>)}</nav>
  </header>;
}
