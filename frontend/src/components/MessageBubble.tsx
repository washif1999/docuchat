import { Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonIcon from "@mui/icons-material/Person";
import type { Message } from "../types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 1.5,
        mb: 3,
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "10px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isUser
            ? "linear-gradient(135deg, #7c3aed, #ec4899)"
            : "rgba(124,58,237,0.18)",
          border: isUser ? "none" : "1px solid rgba(124,58,237,0.3)",
          boxShadow: isUser ? "0 4px 12px rgba(124,58,237,0.35)" : "none",
        }}
      >
        {isUser
          ? <PersonIcon sx={{ fontSize: 16, color: "white" }} />
          : <AutoAwesomeIcon sx={{ fontSize: 16, color: "primary.light" }} />
        }
      </Box>

      {/* Bubble + sources */}
      <Box sx={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: 1, alignItems: isUser ? "flex-end" : "flex-start" }}>
        <Paper
          elevation={0}
          sx={{
            px: 2.5,
            py: 1.8,
            background: isUser
              ? "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)"
              : "rgba(255,255,255,0.05)",
            border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            boxShadow: isUser
              ? "0 8px 24px rgba(124,58,237,0.35)"
              : "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.7,
              color: isUser ? "rgba(255,255,255,0.95)" : "text.primary",
              fontSize: "0.95rem",
              whiteSpace: "pre-wrap",
            }}
          >
            {message.content}
          </Typography>
        </Paper>

        {/* Sources accordion */}
        {message.sources && message.sources.length > 0 && (
          <Accordion
            disableGutters
            elevation={0}
            sx={{
              background: "rgba(124,58,237,0.07)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "12px !important",
              width: "100%",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "primary.light", fontSize: 18 }} />}
              sx={{ minHeight: 40, "& .MuiAccordionSummary-content": { my: 0.5 } }}
            >
              <Typography variant="caption" fontWeight={600} color="primary.light">
                📚 {message.sources.length} source{message.sources.length > 1 ? "s" : ""} cited
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 1.5, px: 2 }}>
              {message.sources.map((src, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 1.5,
                    p: 1.5,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Typography variant="caption" fontWeight={700} color="secondary.light" display="block" mb={0.5}>
                    {src.file} — Page {src.page}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", lineHeight: 1.6, display: "block" }}
                  >
                    "{src.content}…"
                  </Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </Box>
  );
}