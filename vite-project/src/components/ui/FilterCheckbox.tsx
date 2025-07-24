import { useState } from "react";

export default function FilterCheckbox() {
  const [filters, setFilters] = useState({
    assignee: true,
    priority: true,
    deadline: true,
  });

  const handleChange = (field: string) => {
    setFilters({ ...filters, [field]: !filters[field as keyof typeof filters] });
  };

  return (
    <div className="border p-3 rounded flex space-x-4 items-center">
      <label>
        <input
          type="checkbox"
          checked={filters.assignee}
          onChange={() => handleChange("assignee")}
        />{" "}
        Assignee
      </label>
      <label>
        <input
          type="checkbox"
          checked={filters.priority}
          onChange={() => handleChange("priority")}
        />{" "}
        Priority
      </label>
      <label>
        <input
          type="checkbox"
          checked={filters.deadline}
          onChange={() => handleChange("deadline")}
        />{" "}
        Deadline
      </label>
    </div>
  );
}
