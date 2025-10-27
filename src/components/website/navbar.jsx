"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  // const pathname = usePathname();
  
  // // Hide navbar on home page
  // if (pathname === '/') {
  //   return null;
  // }
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background fixed inset-0">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <nav className="w-full mx-auto flex items-center justify-between font-geist-sans py-4 fixed top-0 left-0 right-0 z-50 bg-background px-4 md:px-6 lg:px-10">
      <Link href={"/"} className="flex items-center justify-center ">
        <figure>
          <Image
            src={"/logo.svg"}
            alt="my forex firms logo"
            width={44}
            height={44}
          />
        </figure>
        <h1 className="text-primary font-semibold text-2xl tracking-tight">
          My Forex Firms
        </h1>
      </Link>

      <div className="text-xl flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <Button variant="outline" className="btn-grad hover:text-white">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button
              variant="outline"
              className="text-primary hover:text-primary"
            >
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div onClick={() => router.push("/profile")} className="relative cursor-pointer">
            {user?.imageUrl ? (
              <Image
                src={user?.imageUrl}
                alt={user?.fullName || "Profile"}
                width={44}
                height={44}
                className="rounded-full object-cover border-4 border-background shadow-lg"
              />
            ) : (
              <Avatar className="h-11 w-11 border-4 border-background shadow-lg">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="text-2xl font-semibold">
                  {user?.firstName?.charAt(0) ||
                    user?.emailAddresses?.[0]?.emailAddress?.charAt(0) ||
                    "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </SignedIn>
        {/* <Button variant="ghost" className="text-white cursor-pointer">
          Log in
        </Button>
        <Button className="btn-grad cursor-pointer">Sign Up</Button>
        <Button variant="ghost" size="icon-lg" className="cursor-pointer">
          <Menu className="text-white" />
        </Button> */}
      </div>
    </nav>
  );
};

export default Navbar;
