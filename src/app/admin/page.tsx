"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "humaaftab_4@yahoo.com" && password === "huma") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center px-4 sm:px-6" style={{ backgroundImage: "url('/nike-logo.png')" }}>
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>
        
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 sm:p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={email}
        />
        
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 sm:p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={password}
        />
        
        <button
          type="submit"
          className="bg-red-500 text-white px-5 py-3 rounded-lg w-full transition duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Login
        </button>
      </form>
    </div>
  );
}
