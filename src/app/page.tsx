'use client';

import { AuthGuard } from "@/components/auth-guard";

export default function Home() {
  return (
    <AuthGuard>
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8">
          <h1 className="text-3xl font-semibold">Manage ALI</h1>
          <p className="text-sm text-gray-600">
            Conga Agreement Line Item management
          </p>
        </div>
      </main>
    </AuthGuard>
  );
}
