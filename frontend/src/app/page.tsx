"use client";

import { EVDetectionForm } from "@/components/EVDetectionForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">EV Detection</h1>
      <EVDetectionForm />
    </div>
  );
}
