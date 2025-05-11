"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Testimonials", href: "#" },
  { name: "Pricing", href: "#" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleHomepage = () => {
    router.push("/home");
  };

  return (
    <header className="sticky bg-white/30 backdrop-blur-lg inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8 lg:py-4"
      >
        <div className="flex lg:flex-1">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
            HOLTEX AI
          </h1>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm/6 hover:text-gray-500 text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <SignedOut>
            <SignInButton>
              <button className="-mx-3 flex justify-start items-center gap-1 w-fit  text-gray-900 rounded-lg px-3 py-1 text-base/7   hover:bg-gray-50">
                <p>Log in</p>
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <button
              className="px-4 py-1 border border-purple-500 text-purple-700 rounded-md hover:bg-purple-50 transition-colors"
              onClick={handleHomepage}
            >
              Home
            </button>
          </SignedIn>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                HOLTEX AI
              </h1>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <SignedOut>
                  <SignInButton>
                    <button className="-mx-3 flex justify-start items-center gap-1 w-24  text-gray-900 rounded-lg px-3 py-1 text-base/7   hover:bg-gray-50">
                      <p>Log in</p>
                      <ArrowRightIcon aria-hidden="true" className="size-4" />
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <button
                    className="px-4 py-1 border border-purple-500 text-purple-700 rounded-md hover:bg-purple-50 transition-colors"
                    onClick={handleHomepage}
                  >
                    Home
                  </button>
                </SignedIn>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
