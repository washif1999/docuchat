import { useState } from "react";
import { Box, TextField, IconButton, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  onSend: (question: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        maxWidth: "760px",
        mx: "auto",
        width: "100%",
        alignItems: "flex-end",
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder={disabled ? "Please wait..." : "Ask anything..."}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={disabled}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            "& fieldset": { border: "none" },
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.07)",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(124,58,237,0.08)",
              boxShadow: "0 0 0 2px rgba(124,58,237,0.4)",
            },
            "&.Mui-disabled": {
              opacity: 0.4,
            },
          },
          "& .MuiInputBase-input": {
            color: "#f1f5f9",
            fontSize: "0.95rem",
            py: 1.4,
            px: 0.5,
            "&::placeholder": { color: "#64748b" },
          },
        }}
      />

      <Tooltip title={disabled ? "Please wait" : "Send (Enter)"}>
        <span>
          <IconButton
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: disabled || !value.trim()
                ? "rgba(255,255,255,0.06)"
                : "linear-gradient(135deg, #7c3aed, #ec4899)",
              color: disabled || !value.trim() ? "#475569" : "white",
              flexShrink: 0,
              transition: "all 0.2s ease",
              boxShadow: disabled || !value.trim() ? "none" : "0 4px 14px rgba(124,58,237,0.45)",
              "&:hover": {
                background: "linear-gradient(135deg, #6d28d9, #db2777)",
                boxShadow: "0 6px 20px rgba(124,58,237,0.6)",
              },
              "&.Mui-disabled": {
                background: "rgba(255,255,255,0.05)",
                color: "#334155",
              },
            }}
          >
            <SendIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}