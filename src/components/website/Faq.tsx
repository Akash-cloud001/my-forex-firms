"use client";

import { CustomAccordion } from "@/components/ui/custom-accordion";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_DATA: FaqItem[] = [
  {
    question: "What does myforexfirms do?",
    answer:
      "myforexfirms curates trusted proprietary trading firms and lets traders compare evaluations, funding rules, and payout reliability in one place. We review firms so you can focus on trading, not research."
  },
  {
    question: "How do you select the firms that appear on the platform?",
    answer:
      "Our team verifies each firm against community feedback, payout history, and transparency standards. We combine manual research with automated monitoring to keep the list current and trustworthy."
  },
  {
    question: "Do you charge traders for using the platform?",
    answer:
      "No. myforexfirms is free for traders. We may partner with firms, but every recommendation follows our review policy so rankings stay unbiased and helpful."
  },
  {
    question: "Can I submit a review or report an issue?",
    answer:
      "Absolutely. Traders can share their experiences directly through our review portal. We surface verified issues to keep the community informed and help firms improve."
  },
  {
    question: "How often is the information updated?",
    answer:
      "Key metrics, program changes, and trust signals are reviewed weekly. Urgent updates—like payout concerns—are flagged and published as soon as they are verified."
  }
];

const Faq = () => {
  return (
    <section className="w-full bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="flex w-full flex-col gap-10 btn-grad rounded-[32px] py-10 sm:py-16 px-6 sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl text-center text-wrap">
            Frequently Asked Questions
          </h2>
          <div className="relative font-geist-sans w-full  md:max-w-4xl mx-auto">
            <CustomAccordion
              items={FAQ_DATA}
              defaultOpenIndex={1}
              allowMultiple={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
