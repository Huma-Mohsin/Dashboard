"use client"
import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/protected/page";
import { Bar } from 'react-chartjs-2';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartItems: { productName: string; image: string }[] | null;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChart, setActiveChart] = useState<string | null>(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          zipCode,
          total,
          discount,
          orderDate,
          status,
          cartItems[]->{
            productName,
            image
          }
        }`
      )
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  useEffect(() => {
    const pendingCount = orders.filter((order) => order.status === "pending").length;
    setPendingOrdersCount(pendingCount);
  }, [orders]);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#3182ce",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client
        .patch(orderId)
        .set({ status: newStatus })
        .commit();
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (newStatus === "dispatch") {
        Swal.fire("Dispatch", "The order is now dispatched.", "success");
      } else if (newStatus === "success") {
        Swal.fire("Success", "The order has been completed.", "success");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire("Error!", "Something went wrong while updating the status.", "error");
    }
  };

  // Prepare data for charts
  const orderStats = orders.reduce(
    (stats, order) => {
      if (order.status === "pending") {
        stats.pendingCount += 1;
        stats.pendingRevenue += order.total;
      } else if (order.status === "dispatch") {
        stats.dispatchCount += 1;
        stats.dispatchRevenue += order.total;
      } else if (order.status === "success") {
        stats.completedCount += 1;
        stats.completedRevenue += order.total;
      }
      return stats;
    },
    {
      pendingCount: 0,
      dispatchCount: 0,
      completedCount: 0,
      pendingRevenue: 0,
      dispatchRevenue: 0,
      completedRevenue: 0,
    }
  );

  const chartData = {
    labels: ["Pending", "Dispatched", "Completed"],
    datasets: [
      {
        label: "Order Count",
        data: [orderStats.pendingCount, orderStats.dispatchCount, orderStats.completedCount],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Revenue ($)",
        data: [orderStats.pendingRevenue, orderStats.dispatchRevenue, orderStats.completedRevenue],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col sm:flex-row h-screen">
        <div
          className={`bg-slate-800 text-white w-full sm:w-64 p-6 transition-all ease-in-out duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
          style={{ height: "100vh" }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">Admin Dashboard</h2>
          <ul className="space-y-4">
            <li>
              <button
                className="w-full py-2 px-4 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition ease-in-out duration-200"
                onClick={() => setActiveChart('orderCountChart')}
              >
                Order Count Chart
              </button>
            </li>
            <li>
              <button
                className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition ease-in-out duration-200"
                onClick={() => setActiveChart('revenueChart')}
              >
                Revenue Chart
              </button>
            </li>
            
            <li>
              <button
                className="w-full py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition ease-in-out duration-200"
                onClick={() => setFilter("All")}
              >
                All Orders
              </button>
            </li>
            <li>
              <button
                className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition ease-in-out duration-200"
                onClick={() => setFilter("pending")}
              >
                Pending Orders{" "}
                {pendingOrdersCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition ease-in-out duration-200"
                onClick={() => setFilter("dispatch")}
              >
                Dispatched Orders
              </button>
            </li>
            <li>
              <button
                className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition ease-in-out duration-200"
                onClick={() => setFilter("success")}
              >
                Completed Orders
              </button>
            </li>
          </ul>
        </div>

        <div className="flex-1 bg-amber-100 overflow-x-auto" style={{ height: "100vh" }}>
          <nav className="bg-blue-600 text-white p-4 shadow-lg flex justify-between sm:hidden">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="text-white"
            >
              ☰
            </button>
            <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
          </nav>

          <div className="p-6 space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <span className="text-3xl font-bold">{orderStats.pendingCount}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Pending Orders</h3>
                  <p className="text-sm text-amber-500">Orders yet to be processed</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
                <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
                  <span className="text-3xl font-bold">{orderStats.dispatchCount}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Dispatched Orders</h3>
                  <p className="text-sm text-amber-500">Orders dispatched for delivery</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <span className="text-3xl font-bold">{orderStats.completedCount}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Completed Orders</h3>
                  <p className="text-sm text-amber-500">Orders completed and delivered</p>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Customer Name</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">Total</th>
                    <th className="py-2 px-4 border-b text-left">Status</th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-2 px-4 border-b">{order.firstName} {order.lastName}</td>
                      <td className="py-2 px-4 border-b">{order.email}</td>
                      <td className="py-2 px-4 border-b">${order.total}</td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`py-1 px-3 rounded-full ${
                            order.status === "pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : order.status === "dispatch"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b space-x-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg"
                          onClick={() => handleStatusChange(order._id, "dispatch")}
                        >
                          Dispatch
                        </button>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg"
                          onClick={() => handleStatusChange(order._id, "success")}
                        >
                          Complete
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg"
                          onClick={() => handleDelete(order._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-amber-500 hover:bg-amber-600 text-white py-1 px-3 rounded-lg"
                          onClick={() => toggleOrderDetails(order._id)}
                        >
                          {selectedOrderId === order._id ? "Hide Details" : "Show Details"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             

              {/* Order Details Modal */}
              {selectedOrderId && (
                <div className="mt-4 p-4 bg-amber-100 rounded-lg">
                  <h3 className="text-xl font-semibold">Order Details</h3>
                  <div className="space-y-2">
                    {orders
                      .filter((order) => order._id === selectedOrderId)
                      .map((order) => (
                        <div key={order._id}>
                          <p><strong>Address:</strong> {order.address}, {order.city}, {order.zipCode}</p>
                          <p><strong>Phone:</strong> {order.phone}</p>
                          <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                          <p><strong>Cart Items:</strong></p>
                          <ul className="list-disc ml-6">
                          {order.cartItems && order.cartItems.length > 0 ? (
  order.cartItems.map((item, index) => (
    item && item.productName ? (
      <div key={index}>
        <h3>{item.productName}</h3>
        <Image src={urlFor(item.image).url()} alt={item.productName} width={100} height={100} />
      </div>
    ) : (
      <p key={index}>Item data is invalid.</p>
    )
  ))
) : (
  <p>No items in the cart.</p>
)}


                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="chart-container">
  {activeChart === 'orderCountChart' && (
    <div>
      <h3>Order Count Chart</h3>
      <Bar data={chartData} />
    </div>
  )}
  {activeChart === 'revenueChart' && (
    <div>
      <h3>Revenue Chart</h3>
      <Bar data={chartData} />
    </div>
  )}
</div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
