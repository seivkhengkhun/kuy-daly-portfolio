"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function TiltVisual({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const element = ref.current; return () => { if (element) gsap.killTweensOf(element); }; }, []);
  return <div className="project-visual-tilt" ref={ref} onPointerMove={e => {
    if (!matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches || !ref.current) return;
    const box = e.currentTarget.getBoundingClientRect();
    gsap.to(ref.current, { rotationY: ((e.clientX - box.left) / box.width - .5) * 3, rotationX: -((e.clientY - box.top) / box.height - .5) * 3, duration: .5, overwrite: true });
  }} onPointerLeave={() => { if (ref.current) gsap.to(ref.current, { rotationY: 0, rotationX: 0, duration: .6, overwrite: true }); }}>{children}</div>;
}
