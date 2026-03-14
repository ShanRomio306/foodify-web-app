import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { Badge } from "../../../components/ui/badge";

interface Order {

  _id: string;
  amount: number;
  quantity: number;
  createdAt: string;

}

export function OrderManagement() {

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {

    const res = await api.get("/orders");

    setOrders(res.data);

  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Order Management
      </h1>

      <div className="space-y-4">

        {orders.map((order) => (

          <div
            key={order._id}
            className="bg-white rounded-xl p-6 shadow-sm border flex justify-between"
          >

            <div>

              <p className="font-bold">
                Order #{order._id}
              </p>

              <p className="text-gray-600">
                Amount ₹{order.amount}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>

            </div>

            <Badge>
              {order.quantity} Items
            </Badge>

          </div>

        ))}

      </div>

    </div>

  );

}