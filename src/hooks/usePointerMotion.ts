"use client";
import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { motion } from "@/animations/config";

export function pointerMotionEnabled() {
  return matchMedia(motion.finePointer).matches;
}

/** Clear pointer transforms when a device switches to touch, a compact layout, or reduced motion. */
export function usePointerMotion<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const element = ref.current;
    const media = gsap.matchMedia();
    media.add(motion.finePointer, () => () => {
      if (element) {
        gsap.killTweensOf(element);
        gsap.set(element, { clearProps: "transform" });
      }
    });
    return () => media.revert();
  }, [ref]);
}
