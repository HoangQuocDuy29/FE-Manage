// src/components/FilterBar.tsx

import { useState } from 'react';

const FilterBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: sau này có thể tích hợp thêm chức năng lọc theo trạng thái, deadline, v.v.
  return (
    <div className="mb-4 flex items-center justify-between">
      <input
        type="text"
        placeholder="Tìm kiếm công việc..."
        className="border px-3 py-2 rounded-md w-full md:w-1/2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default FilterBar;
