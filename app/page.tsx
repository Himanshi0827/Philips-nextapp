'use client';

import { login } from "@/src/api/api";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-6 p-8">
        <h1 className="text-3xl font-semibold">Manage ALI</h1>
        <p className="text-sm text-gray-600">
          Conga Agreement Line Item management
        </p>
        <button
          type="button"
          onClick={() => login()}
          className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Sign in
        </button>
      </div>
    </main>
  );
}
