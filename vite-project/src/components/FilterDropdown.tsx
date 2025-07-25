import React from "react";
import { ChevronDown } from "lucide-react"; // Chỉ sử dụng mũi tên xuống

type FilterKeys = "assignee" | "priority" | "deadline";

type Props = {
  filters: Record<FilterKeys, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<FilterKeys, string>>>;
  assignees: string[];
};

export default function FilterDropdown({ filters, setFilters, assignees }: Props) {
  const handleChange = (field: FilterKeys, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="border p-4 rounded-lg shadow-md grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Assignee Dropdown */}
      <div className="flex flex-col items-center">
        <label htmlFor="assignee-select" className="block mb-2 font-medium text-gray-700 flex items-center">
          Assignee 
          
        </label>
        <div className="relative w-full">
          <select
            id="assignee-select"
            value={filters.assignee}
            onChange={(e) => handleChange("assignee", e.target.value)}
            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition ease-in-out"
            title="Chọn người nhận công việc"
          >
            <option value="">Chọn người nhận</option>
            {assignees.length === 0 ? (
              <option disabled>No assignees available</option>
            ) : (
              assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Priority Dropdown */}
      <div className="flex flex-col items-center">
        <label htmlFor="priority-select" className="block mb-2 font-medium text-gray-700 flex items-center">
          Priority 
          
        </label>
        <div className="relative w-full">
          <select
            id="priority-select"
            value={filters.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition ease-in-out"
            title="Chọn mức độ ưu tiên"
          >
            <option value="">Chọn mức ưu tiên</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Deadline Input */}
      <div className="flex flex-col items-center">
        <label htmlFor="deadline-input" className="block mb-2 font-medium text-gray-700 flex items-center">
          Deadline
          
        </label>
        <div className="relative w-full">
          <input
            type="date"
            id="deadline-input"
            value={filters.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition ease-in-out"
            title="Chọn ngày deadline"
            placeholder="Chọn ngày hạn chót"
          />
        </div>
      </div>
    </div>
  );
}
