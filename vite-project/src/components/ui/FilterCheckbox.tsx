type FilterKeys = "assignee" | "priority" | "deadline";

type Props = {
  filters: Record<FilterKeys, boolean>;
  setFilters: React.Dispatch<React.SetStateAction<Record<FilterKeys, boolean>>>;
};

export default function FilterCheckbox({ filters, setFilters }: Props) {
  const handleChange = (field: FilterKeys) => {
    setFilters((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="border p-3 rounded flex space-x-4 items-center">
      {(["assignee", "priority", "deadline"] as FilterKeys[]).map((key) => (
        <label key={key}>
          <input
            type="checkbox"
            checked={filters[key]}
            onChange={() => handleChange(key)}
          />{" "}
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </label>
      ))}
    </div>
  );
}
