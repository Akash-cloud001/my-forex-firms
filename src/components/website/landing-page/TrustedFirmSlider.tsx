const logos = [
  "/website/firm/5s1.png",
  "/website/firm/alpha1.png",
  "/website/firm/e81.png",
  "/website/firm/fundingPips2.png",
  "/website/firm/Group.png",
];

export default function TrustedFirmSlider() {
  return (
    <div className="mt-0 pt-0">
      <div className="flex flex-col justify-center items-center ">
        <h3 className="font-semibold text-[24px] text-primary text-shadow-white">
          Industry
        </h3>

        <h3 className="font-[Geist] font-semibold text-[24px] leading-[100%] tracking-[-0.05em] bg-linear-to-b from-[#FFFFFF] to-[#999999] bg-clip-text text-transparent drop-shadow-[0_4px_4px_#FFFFFF26]">
          Most Trusted Firms
        </h3>
      </div>
      <div className="w-full py-12 overflow-hidden relative">
        <div className="flex gap-12 animate-scroll ">
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 "
            >
              <img
                src={logo}
                alt={`Prop Firm ${(index % logos.length) + 1}`}
                className="h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>

        <style jsx>{`
          .animate-scroll {
            animation: scroll 30s linear infinite;
            width: fit-content;
          }

          .animate-scroll:hover {
            animation-play-state: paused;
          }
          .text-shadow-white {
            text-shadow: 0px 4px 4px #ffffff26;
          }

          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% / 3));
            }
          }
        `}</style>
      </div>
    </div>
  );
}
