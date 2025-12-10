import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const Blogs = () => {
  return (
    <section className="w-full bg-background py-16 sm:py-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-center mb-10 w-full  ">
          <h1 className="font-geist-sans font-semibold text-4xl leading-[100%] tracking gradient-text text-center relative">
            Firms Reviewed Blogs
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-foreground/80 to-transparent rounded-3xl shadow-md"></div>
          </h1>
        </div>
      <div className="hidden lg:grid grid-cols-3 md:grid-cols-3 grid-rows-4 md:grid-rows-5 gap-2 md:gap-8 m-4">
        <Link href="/blogs/funding-pips-review" className="col-start-1 row-start-1 col-span-3 md:col-start-1 md:row-start-1 md:col-span-2 md:row-span-3 card-custom-grad rounded-md  relative overflow-hidden">
          <Image src="/website/blog-1-bg.png" alt="Blog 1" fill className="absolute top-0 left-0 w-full h-full object-cover object-center" />

          <div className="relative z-[1] h-full w-full pt-6 px-6 pb-4">
            <h3 className="text-3xl md:text-6xl lg:text-8xl text-primary font-extrabold font-geist-sans tracking-tight text-left">
              B-1
            </h3>
            <div className="mt-8">
                <p className="text-lg md:text-2xl xl:text-3xl 2xl:text-4xl font-geist-sans font-semibold first-letter:uppercase leading-tight text-white whitespace-normal tracking-tight">
                    Funding Pips Review 2025
                </p>
                <p className="mt-1 text-lg 2xl:text-2xl font-geist-sans font-light leading-tight text-white/80 whitespace-normal line-clamp-3">
                    Is Funding Pips really a trader‑friendly prop firm, or just another hype-driven evaluation company? After researching their rules, payout structure, trader feedback, risk parameters, and comparing them with top prop firms in 2025, this is the most honest, complete, and data-based Funding Pips review you&apos;ll read this year. 
                </p>
                <Button className="mt-4 text-primary/80 hover:text-primary duration-300 ease-in-out float-right" variant="ghost" >
                    <span className="text-primary/80 hover:text-primary duration-300 ease-in-out">Read More</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
            </div>
          </div>
        </Link>
        <Link href="/blogs/the5ers-review" className="col-start-1 row-start-2 col-span-3 md:col-start-1 md:row-start-4 md:col-span-2 md:row-span-2 card-custom-grad rounded-md relative">
          <Image src="/website/blog-3-bg.png" alt="Blog 2" fill className="absolute top-0 left-0 w-full h-full object-cover object-center" />
          <div className="relative z-[1] h-full w-full pt-6 px-6 pb-4">
            <h3 className="text-3xl md:text-6xl lg:text-7xl text-primary font-extrabold font-geist-sans tracking-tight text-left">
              B-3
            </h3>
            <div className="mt-2">
                <p className="text-lg md:text-2xl xl:text-3xl 2xl:text-4xl font-geist-sans font-semibold first-letter:uppercase leading-tight text-white whitespace-normal tracking-tight">
                    The5ers Review 2025
                </p>
                <p className="mt-1 text-lg 2xl:text-2xl font-geist-sans font-light leading-tight text-white/80 whitespace-normal line-clamp-1">
                Before calling The5ers trader-friendly or hype-driven, it made sense to break down their rules, payouts, trader experiences, and risk model. After comparing all of that with the leading prop firms of 2025, this review turned out to be one of the most honest and data-backed takes you&apos;ll read this year.
                </p>
                <Button className="mt-2 mb-2 text-primary/80 hover:text-primary duration-300 ease-in-out float-right" variant="ghost">
                    <span className="text-primary/80 hover:text-primary duration-300 ease-in-out">Read More</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
            </div>
          </div>
        </Link>
        <Link href="/blogs/maven-review" className="col-start-1 row-start-3 col-span-3 md:col-start-3 md:row-start-1 md:col-span-1 md:row-span-2 card-custom-grad rounded-md relative">
          <Image src="/website/blog-2-bg.png" alt="Blog 3" fill className="absolute top-0 left-0 w-full h-full object-cover object-center" />
          <div className="relative z-[1] h-full w-full pt-6 px-6 pb-4">
            <h3 className="text-3xl md:text-6xl lg:text-7xl text-primary font-extrabold font-geist-sans tracking-tight text-left">
              B-2
            </h3>
            <div className="mt-2">
                <p className="text-lg md:text-2xl xl:text-3xl 2xl:text-4xl font-geist-sans font-semibold first-letter:uppercase leading-tight text-white whitespace-normal tracking-tight">
                    Maven Review 2025
                </p>
                <p className="mt-1 text-lg 2xl:text-2xl font-geist-sans font-light leading-tight text-white/80 whitespace-normal line-clamp-1">
                Before judging whether Maven is genuinely a trader-friendly prop firm or just another hype-driven evaluation company, I took a deep look at their rules, payout system, trader feedback, and risk model. After comparing all of that with the leading prop firms of 2025, this turned into one of the most straightforward and data-driven Maven reviews you&apos;ll read this year.
                </p>
                <Button className="mt-0 text-primary/80 hover:text-primary duration-300 ease-in-out float-right" variant="ghost">
                    <span className="text-primary/80 hover:text-primary duration-300 ease-in-out">Read More</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
            </div>
          </div>
        </Link>
        <Link href="/blogs/funded-next-review" className="col-start-1 row-start-4 col-span-3 md:col-start-3 md:row-start-3 md:col-span-1 md:row-span-3 card-custom-grad rounded-md relative">
          <Image src="/website/blog-4-bg.png" alt="Blog 4" fill className="absolute top-0 left-0 w-full h-full object-cover object-center" />
          <div className="relative z-[1] h-full w-full pt-6 px-6 pb-4">
            <h3 className="text-3xl md:text-6xl lg:text-7xl text-primary font-extrabold font-geist-sans tracking-tight text-left">
              B-4
            </h3>
            <div className="mt-8">
                <p className="text-lg md:text-2xl xl:text-3xl 2xl:text-4xl font-geist-sans font-semibold first-letter:uppercase leading-tight text-white whitespace-normal tracking-tight">
                    Funded Next Review 2025
                </p>
                <p className="mt-1 text-lg 2xl:text-2xl font-geist-sans font-light leading-tight text-white/80 whitespace-normal line-clamp-3">
                Is Funded Trader Markets LTD really a trader‑friendly prop firm, or just another hype-driven evaluation company? After researching their rules, payout structure, trader feedback, risk parameters, and comparing them with top prop firms in 2025, this is the most honest, complete, and data-based Funded Next review you&apos;ll read this year.
                </p>
                <Button className="mt-4 text-primary/80 hover:text-primary duration-300 ease-in-out float-right" variant="ghost">
                    <span className="text-primary/80 hover:text-primary duration-300 ease-in-out">Read More</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
            </div>
          </div>
        </Link>
      </div>

    {/* Mobile View */}
    <div className="grid lg:hidden grid-cols-1 grid-rows-4  gap-6 m-4">
        <Link href="/blogs/funding-pips-review" className="relative overflow-hidden card-custom-grad rounded-md pt-4 px-4 pb-2">
            <Image src="/website/blog-1-bg.png" alt="Blog 1" fill className="absolute top-0 left-0 w-full h-full object-cover object-center" />
            <div className="relative z-[1] h-full w-full">
                <h3 className="text-3xl md:text-6xl lg:text-7xl text-primary font-extrabold font-geist-sans tracking-tight text-left">
                    B-1
                </h3>
                <p className="mt-4 text-lg md:text-2xl lg:text-4xl font-geist-sans font-semibold first-letter:uppercase leading-tight text-white whitespace-normal tracking-tight">
                    Funding Pips Review 2025
                </p>
                <p className="mt-2 text-base font-geist-sans font-light leading-tight text-white/80 whitespace-normal line-clamp-3">
                    Is Funding Pips really a trader‑friendly prop firm, or just another hype-driven evaluation company? After researching their rules, payout structure, trader feedback, risk parameters, and comparing them with top prop firms in 2025, this is the most honest, complete, and data-based Funding Pips review you&apos;ll read this year.
                </p>
                <Button className="mt-4 text-primary/80 hover:text-primary duration-300 ease-in-out float-right" variant="ghost">
                    <span className="text-primary/80 hover:text-primary duration-300 ease-in-out">Read More</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
            </div>

        </Link>
        <Link href="/blogs/maven-review" className="relative overflow-hidden card-custom-grad rounded-md pt-4 px-4 pb-2">
            <Image src="/website/blog-2-bg.png" alt="Blog 2" fill className="absolute top-0 left-0 w-full h-full object-cover object-center" />
            <div className="relative z-[1] h-full w-full">
                <h3 className="text-3xl md:text-6xl lg:text-7xl text-primary font-extrabold font-geist-sans tracking-tight text-left">
                    B-2
                </h3>
                <p className="mt-4 text-lg md:text-2xl lg:text-4xl font-geist-sans font-semibold first-letter:uppercase leading-tight text-white whitespace-normal tracking-tight">
                    Maven Review 2025
                </p>
                <p className="mt-2 text-base font-geist-sans font-light leading-tight text-white/80 whitespace-normal line-clamp-3">
                    Before judging whether Maven is genuinely a trader-friendly prop firm or just another hype-driven evaluation company, I took a deep look at their rules, payout system, trader feedback, and risk model. After comparing all of that with the leading prop firms of 2025, this turned into one of the most straightforward and data-driven Maven reviews you&apos;ll read this year.
                </p>
                <Button className="mt-4 text-primary/80 hover:text-primary duration-300 ease-in-out float-right" variant="ghost">
                    <span className="text-primary/80 hover:text-primary duration-300 ease-in-out">Read More</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
            </div>
        </Link>
        <Link href="/blogs/the5ers-review" className="relative overflow-hidden card-custom-grad rounded-md pt-4 px-4 pb-2">
            <Image src="/website/blog-3-bg.png" alt="Blog 3" fill className="absolute top-0 left-0 w-full h-full object-cover object-center" />
            <div className="relative z-[1] h-full w-full">
                <h3 className="text-3xl md:text-6xl lg:text-7xl text-primary font-extrabold font-geist-sans tracking-tight text-left">
                    B-3
                </h3>
                <p className="mt-4 text-lg md:text-2xl lg:text-4xl font-geist-sans font-semibold first-letter:uppercase leading-tight text-white whitespace-normal tracking-tight">
                    The5ers Review 2025
                </p>
                <p className="mt-2 text-base font-geist-sans font-light leading-tight text-white/80 whitespace-normal line-clamp-3">
                    Before calling The5ers trader-friendly or hype-driven, it made sense to break down their rules, payouts, trader experiences, and risk model. After comparing all of that with the leading prop firms of 2025, this review turned out to be one of the most honest and data-backed takes you&apos;ll read this year.
                </p>
                <Button className="mt-4 text-primary/80 hover:text-primary duration-300 ease-in-out float-right" variant="ghost">
                    <span className="text-primary/80 hover:text-primary duration-300 ease-in-out">Read More</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
            </div>
        </Link>
        <Link href="/blogs/funded-next-review" className="relative overflow-hidden card-custom-grad rounded-md pt-4 px-4 pb-2">
            <Image src="/website/blog-4-bg.png" alt="Blog 4" fill className="absolute top-0 left-0 w-full h-full object-cover object-center" />
            <div className="relative z-[1] h-full w-full">
                <h3 className="text-3xl md:text-6xl lg:text-7xl text-primary font-extrabold font-geist-sans tracking-tight text-left">
                    B-4
                </h3>
                <p className="mt-4 text-lg md:text-2xl lg:text-4xl font-geist-sans font-semibold first-letter:uppercase leading-tight text-white whitespace-normal tracking-tight">
                    Funded Next Review 2025
                </p>
                <p className="mt-2 text-base font-geist-sans font-light leading-tight text-white/80 whitespace-normal line-clamp-3">
                    Is Funded Trader Markets LTD really a trader‑friendly prop firm, or just another hype-driven evaluation company? After researching their rules, payout structure, trader feedback, risk parameters, and comparing them with top prop firms in 2025, this is the most honest, complete, and data-based Funded Next review you&apos;ll read this year.
                </p>
                <Button className="mt-4 text-primary/80 hover:text-primary duration-300 ease-in-out float-right" variant="ghost">
                    <span className="text-primary/80 hover:text-primary duration-300 ease-in-out">Read More</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
            </div>
        </Link>
    </div>
    </section>
  );
};

export default Blogs;
