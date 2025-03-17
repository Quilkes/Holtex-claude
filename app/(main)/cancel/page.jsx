"use client";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Payment Cancelled
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Your payment was cancelled. No charges were made.
        </p>
        <div className="mt-10">
          <button
            onClick={() => router.push("/pricing")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Return to Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
