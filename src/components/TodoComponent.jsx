import React from "react";
import {
  Box,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const TodoComponent = ({
  todo,
  nodeRef,
  isEditing,
  editingText,
  onToggle,
  onDelete,
  onStartEditing,
  onSaveEditing,
  onChangeEditingText,
}) => {
  return (
    <>
      <Box
        ref={nodeRef}
        className={`todo-item ${todo.completed ? "completed" : ""}`}
        display="flex"
        alignItems="center"
        gap={1}
        mb={1}
      >
        <div className={`check-wrapper ${todo.completed ? "completed" : ""}`}>
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
        </div>

        <Box flexGrow={1}>
          {isEditing ? (
            <TextField
              fullWidth
              value={editingText}
              onChange={(e) => onChangeEditingText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSaveEditing(todo.id)}
              onBlur={() => onSaveEditing(todo.id)}
              autoFocus
            />
          ) : (
            <>
              <Typography
                variant="body1"
                className={todo.completed ? "todo-text completed" : "todo-text"}
              >
                {todo.text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(todo.createdAt).toLocaleString()}
              </Typography>
            </>
          )}
        </Box>

        {isEditing ? (
          <IconButton
            color="primary"
            onClick={() => onSaveEditing(todo.id)}
            aria-label="save todo"
          >
            <SaveIcon />
          </IconButton>
        ) : (
          <IconButton
            color="primary"
            onClick={() => onStartEditing(todo.id, todo.text)}
            aria-label="edit todo"
          >
            <EditIcon />
          </IconButton>
        )}

        <IconButton
          color="error"
          onClick={() => onDelete(todo.id)}
          aria-label="delete todo"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default TodoComponent;
