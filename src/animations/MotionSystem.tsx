"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion } from "./config";

gsap.registerPlugin(ScrollTrigger);

export function MotionSystem() {
  useEffect(() => {
    const media = gsap.matchMedia();
    const cinematic = matchMedia(motion.desktop);
    let alive = true;
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;
    const reduce = matchMedia(motion.reduced);
    const desktop = matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const configureScroll = () => {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy(); lenis = undefined; tick = undefined;
      if (!reduce.matches && desktop.matches) {
        lenis = new Lenis({ duration: 1.08, smoothWheel: true, anchors: true });
        lenis.on("scroll", ScrollTrigger.update);
        tick = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(tick);
      }
    };
    configureScroll();
    reduce.addEventListener("change", configureScroll);
    desktop.addEventListener("change", configureScroll);

    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.timeline({ defaults: { ease: motion.ease } });
      intro.from(".hero-title > span", { yPercent: 22, opacity: 0, duration: 1.1, stagger: .12 })
        .from(".sculpture-svg", { scale: .75, rotation: -12, opacity: 0, duration: 1.25 }, .15)
        .from(".hero-kicker, .hero-aside, .hero-code, .hero-footer", { y: 16, opacity: 0, duration: .7, stagger: .09 }, .4);
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(el => {
        gsap.from(el, { y: 36, opacity: 0, ...(el.matches("h2, h3") ? { clipPath: "inset(0 0 100% 0)" } : {}), duration: motion.duration, ease: motion.ease, scrollTrigger: { trigger: el, start: "top 91%", once: true } });
      });
      gsap.from(".section-heading h2, .section-heading p", { y: 45, opacity: 0, duration: .9, stagger: .12, scrollTrigger: { trigger: ".work-heading", start: "top 86%", once: true } });
    });

    media.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-title, .hero-kicker, .sculpture, .hero-aside, .hero-code", { y: 12, opacity: 0, duration: .55, stagger: .05, ease: "power2.out" });
      gsap.utils.toArray<HTMLElement>("[data-reveal], .work-heading h2, .project-media").forEach(el => {
        gsap.from(el, { y: 14, opacity: 0, duration: .55, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 94%", once: true } });
      });
    });

    media.add(motion.desktop, () => {
      const hero = gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
      hero.to(".hero-kuy", { y: -140, opacity: .15 }, 0)
        .to(".daly-letter", { x: i => (i - 1.5) * 95, y: i => (i % 2 ? 65 : -35), opacity: .25 }, 0)
        .to(".sculpture", { scale: .8, rotation: 22, y: 160 }, 0)
        .to(".hero-code", { y: -100, opacity: 0 }, 0)
        .to(".hero-aside", { y: -55, opacity: 0 }, 0);

      const track = document.querySelector<HTMLElement>(".work-track");
      const pin = document.querySelector<HTMLElement>(".work-pin");
      if (track && pin) {
        pin.classList.add("motion-horizontal");
        const distance = () => track.scrollWidth - pin.clientWidth;
        let viewport = pin.clientWidth;
        let travel = distance();
        const reveals: { index: number; timeline: gsap.core.Timeline }[] = [];
        const updateReveals = (progress: number) => {
          if (!cinematic.matches) return;
          const offset = progress * travel;
          reveals.forEach(({ index, timeline }) => {
            timeline.progress(gsap.utils.clamp(0, 1, (offset - (index * viewport - viewport * .85)) / (viewport * .6)));
          });
        };
        const horizontal = gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { id: "work-horizontal", trigger: pin, start: "top top", end: () => `+=${distance()}`, scrub: .8, pin: true, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: self => updateReveals(self.progress), onRefresh: self => { viewport = pin.clientWidth; travel = distance(); updateReveals(self.progress); } } });
        gsap.to(".work-progress-fill", { scaleX: 1, ease: "none", scrollTrigger: { trigger: pin, start: "top top", end: () => `+=${distance()}`, scrub: .8 } });
        gsap.utils.toArray<HTMLElement>(".project-panel").forEach((panel, i) => {
          const visual = panel.querySelector(".project-reveal");
          const text = panel.querySelectorAll(".project-copy h3, .project-description, .project-contribution, .project-stack, .project-links");
          const reveal = gsap.timeline(i === 0 ? { scrollTrigger: { trigger: ".work-heading", start: "bottom 90%", once: true } } : { paused: true });
          reveal.fromTo(visual, { scale: .75, rotation: 3, clipPath: "inset(12% 8% 12% 8%)" }, { scale: 1, rotation: 0, clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" })
            .fromTo(text, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, ease: "power2.out" }, 0);
          if (i > 0) reveals.push({ index: i, timeline: reveal });
        });
        updateReveals(horizontal.scrollTrigger?.progress ?? 0);
        const focusPanel = (event: FocusEvent) => {
          const target = event.target;
          if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) return;
          const panel = target.closest<HTMLElement>(".project-panel");
          const panels = [...track.querySelectorAll(".project-panel")];
          const index = panel ? panels.indexOf(panel) : -1;
          const trigger = horizontal.scrollTrigger;
          if (index < 0 || !trigger) return;
          const scroll = trigger.start + distance() * index / Math.max(1, panels.length - 1);
          if (lenis) lenis.scrollTo(scroll, { immediate: true });
          else window.scrollTo({ top: scroll, behavior: "instant" });
        };
        track.addEventListener("focusin", focusPanel);
        return () => { pin.classList.remove("motion-horizontal"); track.removeEventListener("focusin", focusPanel); };
      }
    });

    const cursor = document.querySelector<HTMLElement>(".custom-cursor");
    media.add(motion.finePointer, () => {
      if (!cursor) return;
      const setX = gsap.quickTo(cursor, "x", { duration: .18, ease: "power2.out" });
      const setY = gsap.quickTo(cursor, "y", { duration: .18, ease: "power2.out" });
      const move = (e: PointerEvent) => { setX(e.clientX); setY(e.clientY); cursor.style.opacity = "1"; cursor.classList.toggle("is-link", !!(e.target as Element).closest("a, button")); };
      const leave = () => { cursor.style.opacity = "0"; };
      window.addEventListener("pointermove", move); document.addEventListener("pointerleave", leave);
      return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); gsap.killTweensOf(cursor); cursor.removeAttribute("style"); };
    });

    const refresh = () => { if (alive) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    const images = [...document.images];
    images.forEach(image => image.addEventListener("load", refresh));
    return () => {
      alive = false;
      media.revert(); if (tick) gsap.ticker.remove(tick); lenis?.destroy();
      reduce.removeEventListener("change", configureScroll); desktop.removeEventListener("change", configureScroll);
      window.removeEventListener("load", refresh); images.forEach(image => image.removeEventListener("load", refresh));
    };
  }, []);
  return <div className="custom-cursor" aria-hidden="true" />;
}
