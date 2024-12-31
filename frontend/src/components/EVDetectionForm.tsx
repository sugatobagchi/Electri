"use client";

import { useState } from "react";
import { FileInput } from "./FileInput";
import { SubmitButton } from "./SubmitButton";
import { ResponseMessage } from "./ResponseMessage";

interface EVDetectionResult {
  EV: string;
  confidence: number;
  ocr_text: string;
}

interface APIResponse {
  status: string;
  message: EVDetectionResult[];
}

export function EVDetectionForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<APIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setResponseData(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponseData(null);

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

      const data: APIResponse = await response.json();
      setResponseData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-4 bg-white shadow-md rounded-md"
    >
      <FileInput onChange={handleFileChange} />
      <SubmitButton loading={loading} />
      <ResponseMessage error={error} responseData={responseData} />
    </form>
  );
}
