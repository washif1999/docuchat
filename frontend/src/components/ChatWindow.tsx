import { useEffect, useRef } from "react";
import { Box, Typography, Chip } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MessageBubble from "./MessageBubble";
import type { Message } from "../types";

interface Props {
  messages: Message[];
  loading: boolean;
  pdfLoaded: boolean;
  onSend: (question: string) => void;
}

export default function ChatWindow({ messages, loading, pdfLoaded, onSend }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isEmpty = messages.length === 0;

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        px: { xs: 2, md: 4 },
        py: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Empty state */}
      {isEmpty && (
        <Box
          className="animate-fade-in"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            textAlign: "center",
            opacity: 0.7,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "18px",
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <AutoAwesomeIcon sx={{ color: "primary.light", fontSize: 30 }} />
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {pdfLoaded ? "Ready to answer your questions" : "Upload a PDF to get started"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
            {pdfLoaded
              ? "Ask anything about your document — summaries, details, comparisons, and more."
              : "Use the panel on the left to upload your document, then start chatting."}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", mt: 3, maxWidth: 500 }}>
            {(pdfLoaded
              ? ["Can you summarize the document?", "What are the key points?", "Explain the main topic.", "Hi!"]
              : ["Hi!", "What can you do?", "How do I upload a file?"]
            ).map((suggestion, i) => (
              <Chip
                key={i}
                label={suggestion}
                onClick={() => onSend(suggestion)}
                sx={{
                  background: "rgba(255,255,255,0.05)",
                  color: "text.secondary",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(124,58,237,0.15)",
                    color: "primary.light",
                    borderColor: "rgba(124,58,237,0.3)",
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Messages */}
      {!isEmpty && (
        <Box sx={{ maxWidth: "760px", width: "100%", mx: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
          {messages.map((msg, i) => (
            <Box
              key={i}
              className="animate-slide-up"
              sx={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s`, opacity: 0, animationFillMode: "forwards" }}
            >
              <MessageBubble message={msg} />
            </Box>
          ))}

          {/* Typing indicator */}
          {loading && (
            <Box className="animate-slide-up" sx={{ display: "flex", gap: 1.5, alignItems: "flex-end", mb: 2, opacity: 0, animationFillMode: "forwards" }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  background: "rgba(124,58,237,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 16, color: "primary.light" }} />
              </Box>
              <Box
                sx={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px 18px 18px 4px",
                  px: 2.5,
                  py: 1.8,
                }}
              >
                <Box className="typing-dots">
                  <span /><span /><span />
                </Box>
              </Box>
            </Box>
          )}

          <div ref={bottomRef} />
        </Box>
      )}
    </Box>
  );
}