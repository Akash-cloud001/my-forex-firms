"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogOut } from 'lucide-react';
import {SignOutButton} from '@clerk/nextjs';
import { Button } from '../ui/button';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutConfirmation({ isOpen, onClose }: LogoutConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-white">
            <LogOut className="h-5 w-5 text-white" />
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to sign out? You will need to sign in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-white cursor-pointer">Cancel</AlertDialogCancel>
          <SignOutButton>
            <Button variant="destructive" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </SignOutButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
