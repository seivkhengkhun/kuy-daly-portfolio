"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function MagneticLink({ children, href, className = "", external = false, download = false }: { children: React.ReactNode; href: string; className?: string; external?: boolean; download?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => { const element = ref.current; return () => { if (element) gsap.killTweensOf(element); }; }, []);
  const active = () => matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
  return <a ref={ref} href={href} className={className} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} download={download || undefined} onPointerMove={e => {
    if (!active() || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    gsap.to(ref.current, { x: (e.clientX - box.left - box.width / 2) * 0.13, y: (e.clientY - box.top - box.height / 2) * 0.2, duration: 0.35, overwrite: true });
  }} onPointerLeave={() => { if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, overwrite: true }); }} onBlur={() => { if (ref.current) gsap.set(ref.current, { x: 0, y: 0 }); }}>{children}</a>;
}
