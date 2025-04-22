import { CheckCircle, Circle, Loader2 } from "lucide-react";
import useFiles from "../store/useFiles";

export function StepsList({ steps }) {
  const { currentStep, setCurrentStep } = useFiles();

  return (
    <div className="rounded-lg h-fit">
      <div className="sticky top-0 left-0 z-10 flex items-center justify-center h-16 shadow-sm bg-white/95 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-gray-800 ">Build Steps</h2>
      </div>
      <div className="h-full p-4 overflow-auto scrollbar-hide">
        <div className="space-y-4">
          {Array.isArray(steps) &&
            steps.length > 0 &&
            steps.map((step) => (
              <div
                key={step.id}
                className={`p-1 rounded-lg cursor-pointer transition-colors ${
                  currentStep === step.id
                    ? "bg-gray-50 border border-gray-300"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="flex items-center justify-center gap-2">
                  {step.status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : step.status === "in-progress" ? (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                  )}
                  {/* Truncate Step Title */}
                  <h3 className="w-full overflow-hidden font-medium text-gray-800 truncate text-ellipsis whitespace-nowrap">
                    {step.title}
                  </h3>
                </div>
                {/* Truncate Description (Multi-line) */}
                <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                  {step.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
