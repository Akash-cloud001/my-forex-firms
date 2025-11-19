import React from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";

const Subscribe = () => {
  return (
    <section className="w-full bg-background px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[48px] border border-white/10 bg-linear-to-br from-black/80 via-neutral-900/80 to-black/70 px-3 py-12 sm:px-12 sm:py-16 lg:px-24 lg:py-20 flex flex-col items-center text-center shadow-[0_15px_55px_rgba(0,0,0,0.65)]">
          {/* Glow accents */}
          <div className="absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-black/60 pointer-events-none" />
          <div className="absolute -left-24 top-6 h-60 w-60 rounded-full bg-[#F66435]/20 blur-[120px]" />
          <div className="absolute -right-24 bottom-6 h-60 w-60 rounded-full bg-[#F66435]/25 blur-[120px]" />

          <div className="relative z-10 flex flex-col items-center">
            <p className="gradient-text text-2xl sm:text-4xl font-semibold ">
              Subscribe for latest
            </p>
            <p className="gradient-text text-2xl sm:text-4xl font-semibold mt-1">
              Updates &amp; News
            </p>

            <form className="mt-8 flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:items-center" aria-label="Email subscription form">
              <label className="sr-only" htmlFor="subscribe-email">
                Email address
              </label>
              <input
                id="subscribe-email"
                type="email"
                placeholder="Email"
                className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-base text-white/80 placeholder:text-white/40 shadow-inner shadow-black/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              />
              <Button variant="outline" className="w-full sm:w-auto max-w-xs btn-grad hover:text-white !py-6 !px-10 rounded-full text-base md:text-xl font-medium font-geist-sans">
                Notify Me
            </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;