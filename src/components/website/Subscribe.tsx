"use client"
import React, {useState} from "react";
import { AlertCircle, ArrowRightIcon, CheckCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { on } from "events";

type formData = {
  email: string;
}

const Subscribe = () => {
  const { register, handleSubmit, formState: {errors}, reset} = useForm<formData>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted]= useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (data: formData) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/coming-soon",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if(result.success){
        reset();
        setIsSubmitted(true);
      } else {
        setErrorMessage(result.message || "Something went wrong. Please try again.");
      }

    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to subscribe. Please try again.");
    }
    finally{
      setIsLoading(false);
    }
  }
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

            <form className="mt-8 flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:items-center" aria-label="Email subscription form" onSubmit={handleSubmit(onSubmit)}>
              <label className="sr-only" htmlFor="subscribe-email">
                Email address
              </label>
              <input
                id="subscribe-email"
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required", pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address"} })}
                className={`w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-base text-white/80 placeholder:text-white/40 shadow-inner shadow-black/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition ${errors.email ? "!border-destructive" : ""}`}
              />
              <Button disabled={isLoading} variant="outline" className="w-full sm:w-auto max-w-xs btn-grad hover:text-white !py-6 !px-8 rounded-full text-base md:text-xl font-medium font-geist-sans">
              {isLoading ? <div className="flex items-center justify-center gap-1"> <Loader2 className="w-4 h-4 animate-spin" /> Subscribing</div> : "Subscribe"}
            </Button>
            </form>
            {isSubmitted ? (
          <div className="text-center mt-2 opacity-80">
            <p className="font-geist-sans text-xs text-green-500 flex items-center justify-start">
              {/* Check your email for confirmation.  */}
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Thank you for subscribing!
            </p>
          </div>
        ) : (errorMessage && (
          <div className="text-center mt-2 opacity-80">
            <p className="font-geist-sans text-xs text-destructive flex items-center justify-start">
              <AlertCircle className="w-4 h-4 mr-1 text-destructive" /> Oops! {errorMessage ? errorMessage : "Something went wrong. Please try again."}
            </p>
          </div>
        ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;