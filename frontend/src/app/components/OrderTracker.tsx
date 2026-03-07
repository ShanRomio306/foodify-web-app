import { Check } from "lucide-react";

interface Order {
  _id: string;
  status: string;
  updatedAt?: string;
}

interface OrderTrackerProps {
  order: Order;
}

const orderSteps = [
  { id: "placed", label: "Order Placed" },
  { id: "accepted", label: "Accepted" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready for Pickup" },
  { id: "completed", label: "Completed" },
];

export function OrderTracker({ order }: OrderTrackerProps) {

  const currentStepIndex = orderSteps.findIndex(
    (step) => step.id === order.status
  );

  return (

    <div className="bg-white rounded-xl p-6 border border-gray-200">

      <h3 className="font-bold text-gray-900 mb-6">
        Order Status
      </h3>

      <div className="relative">

        {orderSteps.map((step, index) => {

          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (

            <div
              key={step.id}
              className="relative pb-8 last:pb-0"
            >

              {/* Connector Line */}

              {index < orderSteps.length - 1 && (

                <div
                  className={`absolute left-4 top-8 w-0.5 h-full -ml-px ${
                    isCompleted
                      ? "bg-orange-600"
                      : "bg-gray-200"
                  }`}
                />

              )}

              {/* Step */}

              <div className="relative flex items-center gap-4">

                {/* Circle */}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isCompleted
                      ? "bg-orange-600 border-orange-600"
                      : "bg-white border-gray-300"
                  }`}
                >

                  {isCompleted && (
                    <Check className="w-5 h-5 text-white" />
                  )}

                </div>

                {/* Label */}

                <div className="flex-1">

                  <p
                    className={`font-medium ${
                      isCurrent
                        ? "text-orange-600"
                        : isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>

                  {isCurrent && (
                    <p className="text-sm text-gray-500 mt-1">
                      In progress...
                    </p>
                  )}

                </div>

                {/* Time */}

                {isCompleted && order.updatedAt && (

                  <span className="text-sm text-gray-500">

                    {new Date(order.updatedAt).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}

                  </span>

                )}

              </div>

            </div>

          );

        })}

      </div>

      {/* Cancelled Status */}

      {order.status === "cancelled" && (

        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">

          <p className="text-red-700 font-medium">
            Order Cancelled
          </p>

          <p className="text-sm text-red-600 mt-1">
            Your order has been cancelled.
          </p>

        </div>

      )}

    </div>

  );

}