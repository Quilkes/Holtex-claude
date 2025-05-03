import Lookup from "../constants/Lookup";
import React, { useContext, useState } from "react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { useRouter } from "next/navigation";
import StripeCheckoutButton from "./StripeCheckoutButton";
import { CheckCircle } from "lucide-react";

function PricingModel() {
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  return (
    <div className="max-w-6xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Lookup.PRICING_OPTIONS.map((pricing, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border ${
              index === 2
                ? "border-blue-200"
                : "border-gray-100 dark:border-gray-500"
            }`}
          >
            {/* Icon and plan name */}
            <div className="p-6">
              <div className="mb-4">
                <div className="w-10 h-10 mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    className="text-gray-800 dark:text-gray-400"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path
                      d="M12 7V5"
                      stroke="green"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 9l1.5-1.5"
                      stroke="red"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M19 13h2"
                      stroke="green"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 17l1.5 1.5"
                      stroke="red"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 19v2"
                      stroke="green"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 17l-1.5 1.5"
                      stroke="purple"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5 13H3"
                      stroke="purple"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 9L6.5 7.5"
                      stroke="purple"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-800 dark:text-gray-400">
                  {pricing.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {pricing.desc}
                </p>
              </div>

              {/* Price */}
              <div className="my-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-800 dark:text-gray-400">
                    ${pricing.price}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">/ month</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {pricing.tokens} tokens
                </p>
              </div>

              {/* CTA Button */}
              <div className="mt-6">
                {userDetail ? (
                  <StripeCheckoutButton
                    priceId={pricing.priceId}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-center ${
                      index === 2
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  />
                ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-center ${
                      index === 2
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Login to Purchase
                  </button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-500"></div>

            {/* Features */}
            <div className="p-6">
              <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                {index === 0
                  ? "Basic features:"
                  : index === 1
                    ? "Everything in Free, plus:"
                    : "Everything in Pro, plus:"}
              </p>
              <ul className="space-y-3">
                {[
                  pricing.support1,
                  pricing.support2,
                  pricing.support3,
                  pricing.support4,
                  pricing.support5,
                ]
                  .filter(Boolean)
                  .map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500  mt-0.5 flex-shrink-0" />
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      {!userDetail && (
        <div className="mt-8 text-sm text-center text-gray-500">
          Prices shown do not include applicable tax. Usage limits may apply.
        </div>
      )}
    </div>
  );
}

export default PricingModel;
