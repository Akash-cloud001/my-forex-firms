"use client";

import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full flex-5 max-w-xl gap-8 flex items-center justify-center mx-auto">
          {/* Right Side - Sign In Form */}
                  {/* Clerk Sign In */}
                  <div className="space-y-4 text-white">
                    <SignIn 
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "bg-transparent shadow-none border-none p-0",
                          socialButtonsBlockButton: "w-full h-12 bg-background border-border hover:border-primary/50 hover:bg-background/80 transition-all duration-200 rounded-xl font-medium",
                          formButtonPrimary: "btn-grad w-full h-12 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]",
                          footerActionLink: "!text-primary hover:text-primary/80 font-medium transition-colors",
                          identityPreviewText: "text-foreground",
                          formFieldInput: "!flex !h-10 !w-full !rounded-sm !border !border-input !bg-background !px-3 !py-2 !text-sm !text-foreground !placeholder:text-muted-foreground !focus:outline-none !focus:ring-2 !focus:ring-ring !focus:border-ring",
                          formFieldLabel: "text-foreground font-medium text-sm",
                          dividerLine: "bg-[#ffffff]",
                          dividerText: "text-sm",
                          footerActionText: "text-muted-foreground text-sm",
                          formFieldSuccessText: "!text-green-500 !text-xs",
                          formFieldErrorText: "!text-destructive !text-xs",
                          alertText: "!text-destructive !text-xs",
                          formResendCodeLink: "text-primary hover:text-primary/80 text-sm",
                          otpCodeFieldInput: "!flex !h-10 !w-full !rounded-sm !border !border-input !bg-background !px-3 !py-2 !text-sm !text-foreground !placeholder:text-muted-foreground !focus:outline-none !focus:ring-2 !focus:ring-ring !focus:border-ring !text-center",
                          formFieldHintText: "text-muted-foreground text-xs",
                          formHeaderTitle: "text-foreground font-semibold text-lg",
                          formHeaderSubtitle: "text-muted-foreground",
                          socialButtonsProviderIcon__google: "w-5 h-5",
                          socialButtonsProviderIcon__github: "w-5 h-5",
                          socialButtonsProviderIcon__apple: "w-5 h-5",
                        },
                        layout: {
                          socialButtonsPlacement: "top",
                          socialButtonsVariant: "blockButton",
                        },
                        variables: {
                          colorPrimary: "hsl(var(--primary))",
                          colorBackground: "hsl(var(--background))",
                          colorInputBackground: "hsl(var(--background))",
                          colorInputText: "hsl(var(--foreground))",
                          colorText: "hsl(var(--foreground))",
                          colorTextSecondary: "hsl(var(--muted-foreground))",
                          colorDanger: "hsl(var(--destructive))",
                          colorSuccess: "hsl(142, 76%, 36%)",
                          borderRadius: "0.75rem",
                          fontFamily: "var(--font-geist-sans)",
                        }
                      }}
                    />
                  </div>
        </div>
      </div>
    </div>
  );
}