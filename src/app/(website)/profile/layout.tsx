import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - My Account Settings",
  description: "Manage your account settings, personal information, security preferences, and notification settings.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/profile",
    siteName: "My Forex Firms",
    title: "Profile - My Account Settings",
    description: "Manage your account settings and preferences.",
  },
  alternates: {
    canonical: "/profile",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

