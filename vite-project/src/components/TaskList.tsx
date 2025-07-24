import { useTaskStore } from "@/store/taskStore";

export default function TaskList() {
  const tasks = useTaskStore((state) => state.tasks);

  if (tasks.length === 0)
    return <p className="text-gray-500 italic">Chưa có công việc nào.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Priority</th>
            <th className="border px-4 py-2">Assignee</th>
            <th className="border px-4 py-2">Option</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="text-center hover:bg-gray-50">
              <td className="border px-4 py-2">{task.title}</td>
              <td className="border px-4 py-2">{task.priority}</td>
              <td className="border px-4 py-2">{task.assignee}</td>
              <td className="border px-4 py-2 space-x-2">
                <button className="bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded">Read</button>
                <button className="bg-orange-100 hover:bg-orange-200 px-2 py-1 rounded">Delete</button>
                <button className="bg-green-100 hover:bg-green-200 px-2 py-1 rounded">Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
