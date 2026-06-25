"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Wait for the new route's DOM to mount
    const timer = setTimeout(() => {
      document.documentElement.classList.add("reveal-ready");
      const nodes = Array.from(document.querySelectorAll(".animate-on-scroll:not(.animate-in)"));

      if (!("IntersectionObserver" in window)) {
        nodes.forEach((node) => node.classList.add("animate-in"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
      );

      nodes.forEach((node) => observer.observe(node));
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
