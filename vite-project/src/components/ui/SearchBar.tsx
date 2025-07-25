import type { ChangeEvent } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export default function SearchBar({ value, onChange, onSearch, onClear }: Props) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="border rounded px-3 py-2"
        placeholder="Search by ID or Assignee..."
        value={value}
        onChange={handleInputChange}
      />
      <button onClick={onSearch} className="bg-blue-500 text-white px-3 py-2 rounded">
        🔍
      </button>
      <button onClick={onClear} className="bg-gray-300 text-black px-2 py-2 rounded">
        ❌
      </button>
    </div>
  );
}
