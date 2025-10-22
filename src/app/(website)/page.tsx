"use client";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
// Removed unused Button and Clerk imports
type formData = {
  email: string;
}
export default function Page() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<formData>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (data: formData) => {
    setIsLoading(true);
    setErrorMessage(""); // Clear any previous errors
    try {
      const response = await fetch("/api/coming-soon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        reset();
        setIsSubmitted(true);
      } else {
        setErrorMessage(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-background flex flex-col items-center justify-between pt-6 md:pt-10 pb-5 px-4 sm:px-6 md:px-10">
      <div className="hidden items-center justify-center gap-3 max-w-7xl mx-auto w-full">
        {/* <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-[#F66435] to-[#903B1F] font-mont text-2xl sm:text-3xl md:text-4xl font-semibold text-center tracking-tighter flex gap-3 items-center justify-center">
          <Image src="/logo.svg" alt="my forex firms logo" height={50} width={50} /> My Forex Firms
        </h1> */}
        {/* <div className="flex gap-1">
        <SignedOut>
          <SignInButton>
            <Button variant="outline" className="btn-grad hover:text-white">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="outline" className="text-primary hover:text-primary">
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        </div> */}
      </div>
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/images/coming-soon/coming-bg.png"
          alt="coming soon"
          width={450}
          height={450}
          className="w-[280px] sm:w-[350px] md:w-[450px] h-auto"
        />
        <p className="font-mont text-base sm:text-xl md:text-2xl font-semibold text-center mt-1 tracking-[16px] sm:tracking-[28px] md:tracking-[44px] uppercase text-primary text-shadow-primary">
          Coming Soon
        </p>
      </div>

      <form className="flex flex-col items-center justify-center w-full max-w-2xl px-4" onSubmit={handleSubmit(onSubmit)}>
        {isSubmitted ? (
          <div className="text-center">
            <p className="font-geist-sans text-xl sm:text-xl md:text-2xl font-semibold text-primary mb-2">
              Thank You! 🎉
            </p>
            <p className="font-geist-sans text-sm sm:text-base text-foreground/80">
              {/* Check your email for confirmation.  */}
              We&apos;ll notify you when we launch!
            </p>
          </div>
        ) : errorMessage ? (
          <div className="text-center">
            <p className="font-geist-sans text-xl sm:text-xl md:text-2xl font-semibold text-destructive mb-2">
              Oops! ⚠️
            </p>
            <p className="font-geist-sans text-sm sm:text-base text-foreground/80 mb-4">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="btn-grad px-6 py-2"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <p className="font-geist-sans text-lg sm:text-xl md:text-2xl font-semibold text-center mt-2 text-foreground">
              Get Notified When {`It's`} <span className="text-primary">Live</span>
            </p>
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`input-field w-full sm:w-auto ${errors.email ? "!border-destructive" : ""}`}
                {...register("email", { required: true })}
              />
              <button type="submit" className="btn-grad w-full sm:w-auto max-w-xs" disabled={isLoading}>
                {isLoading ? <div className="flex items-center justify-center gap-1"> <Loader2 className="w-4 h-4 animate-spin" /> Sending...</div> : "Get Notified"}
              </button>
            </div>
          </>
        )}
      </form>

      <footer className="flex flex-col sm:flex-row items-center justify-center w-full gap-3 sm:gap-4 mt-8 sm:mt-0">
        <div className="flex items-center justify-center gap-3">
          <a href="https://www.instagram.com/myforexfirms?igsh=eWdydHMyNmN5aTFk" target="_blank" rel="noopener noreferrer">
            <Image src="/images/social-brands/instagram.png" alt="instagram" width={24} height={24} />
          </a>
          <a href="https://x.com/Myforexfirms?t=sSgEgazE7haqqWME_vQ_yQ&s=09" target="_blank" rel="noopener noreferrer">
            <Image src="/images/social-brands/twitter.png" alt="twitter" width={24} height={24} />
          </a>
        </div>
        <div className="hidden sm:block h-4 w-[1px] bg-foreground/20 mx-4"></div>
        <p className="font-geist-sans text-xs font-light text-foreground/50 text-center">
          © 2025 My Forex Firms. All rights reserved.
        </p>
      </footer>
    </section>
  );
}
