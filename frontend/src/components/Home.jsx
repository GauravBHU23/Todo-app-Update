import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchtodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4001/todo/fetch", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setTodos(response.data.todos);
        setError(null);
      } catch (error) {
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };
    fetchtodos();
  }, []);

  const todoCreate = async () => {
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(
        "http://localhost:4001/todo/create",
        {
          text: newTodo,
          completed: false,
        },
        { withCredentials: true }
      );
      setTodos([...todos, response.data.newTodo]);
      setNewTodo("");
    } catch (error) {
      setError("Failed to create todo");
    }
  };

  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      const response = await axios.put(
        `http://localhost:4001/todo/update/${id}`,
        { ...todo, completed: !todo.completed },
        { withCredentials: true }
      );
      setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
    } catch (error) {
      setError("Failed to update todo status");
    }
  };

  const todoDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (error) {
      setError("Failed to delete todo");
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:4001/user/logout", {
        withCredentials: true,
      });
      toast.success("User logged out successfully");
      navigateTo("/login");
      localStorage.removeItem("jwt");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          Todo App
        </h1>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row mb-4 gap-2">
          <input
            type="text"
            placeholder="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && todoCreate()}
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={todoCreate}
            className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-800 duration-300"
          >
            Add
          </button>
        </div>

        {/* Loading / Error / Todo List */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">{error}</div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo, index) => (
              <li
                key={todo._id || index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-md border"
              >
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => todoStatus(todo._id)}
                    className="w-5 h-5"
                  />
                  <span
                    className={`text-base ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (todo.completed) {
                      todoDelete(todo._id);
                    } else {
                      toast.error("Please complete the task before deleting it.");
                    }
                  }}
                  
                  className={`text-sm duration-300 ${
                    todo.completed
                      ? "text-red-600 hover:text-red-800"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-700">
          {remainingTodos} remaining {remainingTodos === 1 ? "task" : "tasks"}
        </p>

        <button
          onClick={logout}
          className="mt-6 w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-700 duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
