import React, { useEffect, useState } from "react";
import axios from "axios";

const Todos = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "", completed: false });
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/tasks/");
      setTodoItems(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/tasks/", newTodo);
      setTodoItems([...todoItems, response.data]);
      setNewTodo({ title: "", description: "", completed: false });
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/tasks/${editTodo.id}/`, editTodo);
      setTodoItems(todoItems.map((item) => (item.id === editTodo.id ? response.data : item)));
      setEditTodo(null);
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`);
      setTodoItems(todoItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>My Tasks</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
        />
        <button onClick={handleCreate}>Add</button>
      </div>

      <ul>
        {todoItems.map((todo) => (
          <li key={todo.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}>
            {editTodo?.id === todo.id ? (
              <div>
                <input
                  value={editTodo.title}
                  onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
                />
                <input
                  value={editTodo.description}
                  onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditTodo(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{todo.title}</strong>: {todo.description}
                <div>
                  <button onClick={() => setEditTodo(todo)}>Edit</button>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;