"use client";

import { useState } from "react";

export function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
    setResponseMessage(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponseMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/detect-ev/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process the image.");
      }

      const data = await response.json();
      setResponseMessage(data.message);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white shadow-md rounded-md">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Upload Image"}
      </button>

      {error && <p className="mt-4 text-red-500 text-sm">Error: {error}</p>}

      {responseMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md text-sm">
          <h3>{responseMessage}</h3>
        </div>
      )}
    </div>
  );
}
