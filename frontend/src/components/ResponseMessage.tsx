"use client";

interface EVDetectionResult {
  EV: string;
  confidence: number;
  ocr_text: string;
}

interface APIResponse {
  status: string;
  message: EVDetectionResult[] | string;
}

interface ResponseMessageProps {
  error: string | null;
  responseData: APIResponse | null;
}

export function ResponseMessage({ error, responseData }: ResponseMessageProps) {
  if (error) {
    return <p className="mt-4 text-red-500 text-sm">Error: {error}</p>;
  }

  if (responseData) {
    console.log(responseData);
    if (responseData.status === "success") {
      return (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md text-sm">
          <h3 className="font-bold mb-2">Detection Results:</h3>
          {(responseData.message as EVDetectionResult[]).map(
            (result, index) => (
              <div key={index} className="mb-2">
                <p>EV Detected: {result.EV}</p>
                <p>Confidence: {result.confidence}%</p>
                <p>OCR Text: {result.ocr_text}</p>
              </div>
            )
          )}
        </div>
      );
    } else if (responseData.status === "error") {
      return (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md text-sm">
          <h3 className="font-bold mb-2">Error:</h3>
          <p>{responseData.message as string}</p>
        </div>
      );
    }
  }

  return null;
}
