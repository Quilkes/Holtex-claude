import Lookup from "../constants/Lookup";
import React, { useContext, useState } from "react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { useRouter } from "next/navigation";
import StripeCheckoutButton from "./StripeCheckoutButton";
import { CheckCircle } from "lucide-react";

function PricingModel() {
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="max-w-8xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl text-gray-700 sm:text-4xl">
          Choose Your Token Package
        </h1>
        <p className="mt-4 text-base text-gray-500 max-w-2xl mx-auto">
          Select the token package that works best for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Lookup.PRICING_OPTIONS.map((pricing, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-lg transition-all duration-300 ${
              hoveredCard === index ? "transform -translate-y-2" : ""
            }`}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="p-8 border-b border-gray-100">
              <div className="flex flex-col items-center justify-between mb-4">
                <h2 className="text-2xl text-gray-700">{pricing.name}</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                  {pricing.tokens} tokens
                </span>
              </div>
              <p className="text-gray-600 text-base mb-6">{pricing.desc}</p>
              <div className="flex items-baseline justify-center mt-8 mb-6">
                <span className="text-5xl font-bold text-gray-700">
                  ${pricing.price}
                </span>
                <span className="ml-1 text-xl text-gray-500">USD</span>
              </div>
            </div>

            <div className="p-6">
              <ul className="mb-8 space-y-4">
                {pricing.support1 && (
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500" />
                    <span className="ml-3 text-gray-700">
                      {pricing.support1}
                    </span>
                  </li>
                )}
                {pricing.support2 && (
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500" />
                    <span className="ml-3 text-gray-700">
                      {pricing.support2}
                    </span>
                  </li>
                )}
                {pricing.support3 && (
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500" />
                    <span className="ml-3 text-gray-700">
                      {pricing.support3}
                    </span>
                  </li>
                )}
                {pricing.support4 && (
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500" />
                    <span className="ml-3 text-gray-700">
                      {pricing.support4}
                    </span>
                  </li>
                )}
                {pricing.support5 && (
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500" />
                    <span className="ml-3 text-gray-700">
                      {pricing.support5}
                    </span>
                  </li>
                )}
              </ul>

              <div className="mt-6">
                {userDetail ? (
                  <StripeCheckoutButton priceId={pricing.priceId} />
                ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full px-6 py-3 bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Login to Purchase
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!userDetail && (
        <div className="mt-10 text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-700">Please log in to purchase tokens</p>
        </div>
      )}
    </div>
  );
}

export default PricingModel;
