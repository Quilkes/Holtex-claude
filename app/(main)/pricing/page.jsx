"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import PricingModel from "@/app/components/PricingModel";
import Lookup from "@/app/constants/Lookup";
import { CheckCircle } from "lucide-react";
import React, { useContext } from "react";

function page() {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-700 tracking-tight">Pricing</h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-gray-400">
            {Lookup.PRICING_DESC}
          </p>
        </div>

        {/* Token Status Card */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <CheckCircle className="text-green-500" />
              </div>
              <div className="ml-6">
                <h2 className="text-lg font-medium text-gray-700">
                  Available Balance
                </h2>
                <p className="text-3xl font-bold text-red-700">
                  {userDetail?.token}{" "}
                  <span className="text-gray-500 text-lg font-normal">
                    Tokens
                  </span>
                </p>
              </div>
            </div>

            <div className="text-center md:text-right bg-blue-50 py-4 px-6 rounded-xl">
              <h2 className="font-medium text-gray-800 text-lg">
                Need more tokens?
              </h2>
              <p className="text-blue-600 font-medium">
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
