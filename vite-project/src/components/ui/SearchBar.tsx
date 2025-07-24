import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useTaskStore } from "@/store/taskStore";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const setSearchQuery = useTaskStore((state) => state.setSearchQuery);

  const handleSearch = () => {
    setSearchQuery(query); // gửi query vào store
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-3 py-2 rounded w-64"
      />
      <button onClick={handleSearch} title="Tìm kiếm">
        <FiSearch className="text-xl" />
      </button>
    </div>
  );
}
