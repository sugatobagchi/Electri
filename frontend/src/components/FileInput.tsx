"use client";

interface FileInputProps {
  onChange: (file: File | null) => void;
}

export function FileInput({ onChange }: FileInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleChange}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 mb-4"
    />
  );
}
