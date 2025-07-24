import HomePage from "@/pages/HomePage";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import FilterBar from "@/components/FilterBar";



function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
        Task Manager App
      </h1>
      <HomePage />
    </div>
  );
}

export default App;
