import { useState } from "react";

export default function SearchBar({ onSearch, onClear }: {
  onSearch: (keyword: string) => void;
  onClear: () => void;
}) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch(keyword.trim());
  };

  const handleClear = () => {
    setKeyword("");
    onClear();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="border rounded px-3 py-2"
        placeholder="Search by ID or Assignee..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-3 py-2 rounded">
        🔍
      </button>
      <button onClick={handleClear} className="bg-gray-300 text-black px-2 py-2 rounded">
        ❌
      </button>
    </div>
  );
}
