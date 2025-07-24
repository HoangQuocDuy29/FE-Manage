export default function CreateButton() {
  const handleClick = () => {
    alert("Tạo mới thành công!");
    // TODO: mở form thêm mới task
  };

  return (
    <button
      className="bg-red-100 border border-red-400 text-red-700 font-semibold px-4 py-2 rounded"
      onClick={handleClick}
    >
      Create
    </button>
  );
}
