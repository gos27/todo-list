import { useState, useEffect, useRef, createRef } from "react";
import TodoComponent from "./components/TodoComponent";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.css";

// TodoItem Component
function TodoItem({
  todo,
  nodeRef,
  isEditing,
  editingText,
  onToggle,
  onDelete,
  onStartEditing,
  onSaveEditing,
  onChangeEditingText,
}) {
  return (
    <TodoComponent
      todo={todo}
      nodeRef={nodeRef}
      isEditing={isEditing}
      editingText={editingText}
      onToggle={onToggle}
      onDelete={onDelete}
      onStartEditing={onStartEditing}
      onSaveEditing={onSaveEditing}
      onChangeEditingText={onChangeEditingText}
    />
  );
}

// Main App Component
function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const pageTitle = "Todo List.";

  // 🔒 Keep consistent refs for CSSTransition
  const refs = useRef({});

  // Load todos
  useEffect(() => {
    document.title = pageTitle;

    setTimeout(() => {
      const saved = localStorage.getItem("todos");
      if (saved) setTodos(JSON.parse(saved));
      setLoading(false);
    }, 500);
  }, []);

  // Save todos
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, loading]);

  const addTodo = () => {
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos([...todos, newTodo]);
    setInput("");
  };

  const toggleTodo = (id) =>
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

  const deleteTodo = (id) => setTodos(todos.filter((todo) => todo.id !== id));

  const clearAllTodos = () => {
    if (window.confirm("Are you sure you want to clear the list?")) {
      setTodos([]);
    }
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEditing = (id) => {
    if (!editingText.trim()) {
      setEditingId(null);
      setEditingText("");
      return;
    }
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editingText.trim() } : todo
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const completeCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "Active") return !todo.completed;
    if (filter === "Completed") return todo.completed;
    return true;
  });

  // Ensure refs exist
  filteredTodos.forEach((todo) => {
    if (!refs.current[todo.id]) refs.current[todo.id] = createRef();
  });

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 4, height: "100vh", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid #6d7fe6ff",
          borderRadius: 3,
        }}
      >
        Todo List
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Completed: {completeCount}/{totalCount}
          </Typography>

          {/* Input */}
          <Box display="flex" gap={1} mb={2}>
            <TextField
              fullWidth
              label="Add a new todo"
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
            />
            <Button variant="contained" onClick={addTodo}>
              Add
            </Button>
            <Button variant="outlined" color="error" onClick={clearAllTodos}>
              Reset
            </Button>
          </Box>

          {/* Filters */}
          <Box display="flex" gap={1} mb={2}>
            {["All", "Active", "Completed"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "contained" : "outlined"}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </Box>

          {/* Todo List */}
          <Box sx={{ textTransform: "capitalize" }}>
            <TransitionGroup>
              {filteredTodos.map((todo) => (
                <CSSTransition
                  key={todo.id}
                  timeout={300}
                  classNames="todo"
                  nodeRef={refs.current[todo.id]}
                >
                  <TodoItem
                    todo={todo}
                    nodeRef={refs.current[todo.id]}
                    isEditing={editingId === todo.id}
                    editingText={editingText}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onStartEditing={startEditing}
                    onSaveEditing={saveEditing}
                    onChangeEditingText={setEditingText}
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </Box>
        </>
      )}
    </Container>
  );
}

export default App;
