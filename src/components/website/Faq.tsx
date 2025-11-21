"use client";

import { useEffect } from "react";
import { CustomAccordion } from "@/components/ui/custom-accordion";
import { useFaqList } from "@/stores/faqStore";

const Faq = () => {
  const { accordionItems, isLoading, error, hasFaqs, fetchFaqs } = useFaqList();

  useEffect(() => {
    // Fetch FAQs from General category
    fetchFaqs("General");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="w-full bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="flex w-full flex-col gap-10 btn-grad rounded-[32px] py-10 sm:py-16 px-6 sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl text-center text-wrap">
            Frequently Asked Questions
          </h2>
          <div className="relative font-geist-sans w-full md:max-w-4xl mx-auto">
            {isLoading ? (
              <div className="text-center py-8 text-foreground/60">
                Loading FAQs...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                {error}
              </div>
            ) : !hasFaqs ? (
              <div className="text-center py-8 text-foreground/60">
                No FAQs available at the moment.
              </div>
            ) : (
              <CustomAccordion
                items={accordionItems}
                defaultOpenIndex={accordionItems.length > 0 ? 0 : undefined}
                allowMultiple={false}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
