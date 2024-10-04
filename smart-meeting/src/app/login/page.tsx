"use server";

import LoginForm from "@/app/components/ui/login/LoginForm";

export default async function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-1/3">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-8">Smart Meeting</h1>
        <h2 className="text-xl font-semibold mb-6 text-center">ログイン</h2>
        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
