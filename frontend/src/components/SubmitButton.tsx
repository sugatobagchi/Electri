"use client";

interface SubmitButtonProps {
  loading: boolean;
}

export function SubmitButton({ loading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
    >
      {loading ? "Processing..." : "Upload Image"}
    </button>
  );
}
