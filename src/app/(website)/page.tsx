"use client";
import Image from "next/image";

export default function page() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <section className="min-h-screen w-full bg-background flex flex-col items-center justify-between pt-10 pb-5 px-10">
      <h1 className="text-primary text-shadow-primary font-mont  text-4xl font-semibold text-center tracking-tighter">
        My Forex Firms
      </h1>
      <div className=" flex flex-col items-center justify-center">
        <Image src="/images/coming-soon/coming-bg.png" alt="coming soon" width={450} height={450} />
        <p className="font-mont text-2xl font-semibold text-center mt-1 tracking-[44px] uppercase text-primary text-shadow-primary">Coming Soon</p>
      </div>

      <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
        <p className="font-geist-sans text-2xl font-semibold text-center mt-2 text-foreground">
          Get Notified When It’s <span className="text-primary">Live</span>
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <input type="email" placeholder="Enter your email" className="input-field" required />
          <button className="btn-grad">Get Notified</button>
        </div>
      </form>

      <footer className="flex flex-row items-center justify-center w-full gap-3">
        <div className="flex items-center justify-center gap-3">
          <a href="https://www.facebook.com/myforexfirms" target="_blank" rel="noopener noreferrer">
            <Image src="/images/social-brands/instagram.png" alt="instagram" width={24} height={24} />
          </a>
          <a href="https://www.instagram.com/myforexfirms" target="_blank" rel="noopener noreferrer">
            <Image src="/images/social-brands/twitter.png" alt="twitter" width={24} height={24} />
          </a>
        </div>
        <div className="h-4 w-[1px] bg-foreground/20 mx-4"></div>
        <p className="font-geist-sans text-xs font-light text-foreground/50">© 2025 My Forex Firms. All rights reserved.</p>
      </footer>
    </section>
  );
}
