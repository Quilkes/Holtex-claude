"use client";

import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import Lookup from "@/app/constants/Lookup";

export default function SuccessPage() {
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const [message, setMessage] = useState("Processing your payment...");
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (!userDetail) {
      router.push("/");
      return;
    }

    const updateUserTokens = async () => {
      if (processed) return; // Prevent duplicate processing

      const selectedPlanId = sessionStorage.getItem("selectedPlan");
      console.log("Retrieved selectedPlanId:", selectedPlanId);

      if (!selectedPlanId) {
        setMessage("No plan information found. Please contact support.");
        return;
      }

      const selectedPlan = Lookup.PRICING_OPTIONS.find(
        (option) => option.priceId === selectedPlanId
      );

      console.log("Found plan:", selectedPlan);

      if (selectedPlan) {
        try {
          const tokens =
            Number(userDetail?.token || 0) + Number(selectedPlan.value);
          console.log("Updating tokens to:", tokens);

          const result = await UpdateTokens({
            token: tokens,
            userId: userDetail?._id,
          });

          console.log("Update result:", result);

          // Clear the stored plan
          sessionStorage.removeItem("selectedPlan");
          setMessage(
            "Payment successful! Your tokens have been added to your account."
          );
          setProcessed(true);
        } catch (error) {
          console.error("Error updating tokens:", error);
          setMessage(
            "There was an error processing your payment. Please contact support."
          );
        }
      } else {
        setMessage("Selected plan not found. Please contact support.");
      }
    };

    updateUserTokens();
  }, [userDetail, UpdateTokens, processed]);

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Thank You for Your Purchase!
        </h1>
        <p className="mt-4 text-xl text-gray-500">{message}</p>
        <div className="mt-10">
          <button
            onClick={() => router.push("/home")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
