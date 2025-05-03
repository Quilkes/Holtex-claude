"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import PricingModel from "@/app/components/PricingModel";
import Lookup from "@/app/constants/Lookup";
import { CheckCircle } from "lucide-react";
import React, { useContext } from "react";

function page() {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl tracking-tight text-gray-700 dark:text-gray-400">
            Pricing
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-base text-gray-400">
            {Lookup.PRICING_DESC}
          </p>
        </div>

        {/* Token Status Card */}
        <div className="mb-16">
          <div className="flex flex-col items-center justify-between gap-6 p-8 bg-white border border-gray-100 shadow-md dark:border-gray-500 dark:bg-gray-900 rounded-2xl md:flex-row">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-gray-800">
                <CheckCircle className="text-green-500" />
              </div>
              <div className="ml-6">
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-400">
                  Available Balance
                </h2>
                <p className="text-3xl font-bold text-red-700">
                  {userDetail?.token}{" "}
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                    Tokens
                  </span>
                </p>
              </div>
            </div>

            <div className="px-6 py-4 text-center md:text-right bg-blue-50 dark:bg-gray-800 rounded-xl">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-400">
                Need more tokens?
              </h2>
              <p className="font-medium text-blue-600">
                Upgrade your plan below
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Model Component */}
        <PricingModel />
      </div>
    </div>
  );
}

export default page;
