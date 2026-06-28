"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-50 mx-auto w-full transition-all duration-500",
        scrolled ? "pt-2 px-4" : "pt-4 px-4"
      )}
    >
      <header
        className={cn(
          "mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 transition-all duration-500 glass-navbar",
          scrolled ? "glass-navbar-scrolled h-14" : "h-16"
        )}
      >
        {children}
      </header>
    </div>
  );
}
