"use client";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Clear the stored prompt since it can only be used once
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="fixed top-80 right-4 lg:top-auto lg:bottom-6 z-10 bg-gradient-to-r from-[#2c313a] to-[#2e333d] text-white border border-[rgba(59,130,246,0.4)] dark:bg-[#014751]/80 rounded-full lg:rounded-lg p-2.5 lg:px-4 lg:py-2.5 flex items-center justify-center gap-3 max-w-sm cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-md shadow-[0_3px_15px_rgba(59,130,246,0.12)] text-sm font-medium hover:text-gray-200 hover:border-[rgba(59,130,246,0.7)] hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(59,130,246,0.2)]"
        title="Install Geomatic Connect as PWA"
        aria-label="Install Geomatic Connect as PWA"
      >
        <span className="dark:bg-[#014751]/80 rounded-full p-1">
          <Download className="text-white" />
        </span>
        <span className="hidden lg:flex lg:flex-col items-start">
          <span className="block text-sm">Install Geomatic Connect </span>
          <span className="text-xs block">Quick access to Placements</span>
        </span>
        <span className="bg-[#014751] w-fit py-1.5 rounded-md px-2.5 text-white hidden lg:block">
          Install
        </span>
      </button>
    </>
  );
};
