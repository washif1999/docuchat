import { useState, useRef, useEffect } from "react";
import {
  Box, Typography, Button, IconButton, Tooltip, CircularProgress, Chip,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { askQuestion, resetStore, uploadPDF, clearCache, getFiles, selectPDF } from "./api/ragApi";
import type { Message } from "./types";

const STEPS = [
  {
    num: "01",
    title: "Upload your PDF",
    desc: "Drop any PDF document — reports, papers, contracts, books.",
  },
  {
    num: "02",
    title: "Ask in plain language",
    desc: "Type any question naturally. No keywords needed.",
  },
  {
    num: "03",
    title: "Get cited answers",
    desc: "Receive precise answers with source page references.",
  },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getFiles().then(setExistingFiles).catch(console.error);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadPDF(file);
      setUploadedName(file.name);
      setPdfLoaded(true);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      // reset input so same file can be re-selected
      e.target.value = "";
      // Refresh file list
      getFiles().then(setExistingFiles).catch(console.error);
    }
  };

  const handleSelectFile = async (filename: string) => {
    setUploading(true);
    try {
      await selectPDF(filename);
      setUploadedName(filename);
      setPdfLoaded(true);
      setMessages([]);
    } catch (err: any) {
      alert(`Failed to load file: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async (question: string) => {
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);
    try {
      const res = await askQuestion(question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.answer, sources: res.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    await resetStore();
    setMessages([]);
    setPdfLoaded(false);
    setUploadedName(null);
  };

  const handleClearCache = async () => {
    if (!window.confirm("Are you sure you want to completely clear the cache? This deletes all uploaded PDFs and their AI memory from the server.")) return;
    
    try {
      setLoading(true);
      await clearCache();
      setMessages([]);
      setPdfLoaded(false);
      setUploadedName(null);
      setExistingFiles([]);
      alert("Cache cleared successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#0f172a",
        overflow: "hidden",
      }}
    >
      {/* ─── LEFT PANEL ─── */}
      <Box
        sx={{
          width: { xs: "100%", md: "380px" },
          flexShrink: 0,
          display: { xs: pdfLoaded ? "none" : "flex", md: "flex" },
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(160deg, #13111c 0%, #0f172a 60%, #150f25 100%)",
          p: 4,
        }}
      >
        {/* Decorative glowing orb */}
        <Box
          className="orb-float"
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 60,
            left: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 6, position: "relative" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(124,58,237,0.5)",
            }}
          >
            <AutoAwesomeIcon sx={{ color: "white", fontSize: 22 }} />
          </Box>
          <Typography fontWeight={700} fontSize="1.1rem" color="text.primary">
            DocMind AI
          </Typography>
        </Box>

        {/* Hero */}
        <Box sx={{ position: "relative", mb: 5 }}>
          <Typography
            variant="h3"
            fontWeight={800}
            mb={2}
            sx={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            Chat with your{" "}
            <Box component="span" className="gradient-text">
              PDFs
            </Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Upload any PDF and have a real conversation with its content.
            Get precise, cited answers in seconds — powered by RAG AI.
          </Typography>
        </Box>

        {/* How it works */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="overline"
            sx={{ color: "primary.light", letterSpacing: "0.15em", fontWeight: 700, mb: 2.5, display: "block" }}
          >
            How it works
          </Typography>

          {STEPS.map((step, i) => (
            <Box key={step.num}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                {/* Step number badge */}
                <Box
                  sx={{
                    minWidth: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography fontSize="0.8rem" fontWeight={700} color="primary.light">
                    {step.num}
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight={600} color="text.primary" mb={0.3}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {step.desc}
                  </Typography>
                </Box>
              </Box>
              {i < STEPS.length - 1 && <Box className="step-connector" />}
            </Box>
          ))}
        </Box>

        {/* Upload CTA */}
        <Box sx={{ mt: "auto" }}>
          {uploadedName && (
            <Chip
              icon={<TaskAltIcon sx={{ fontSize: 16 }} />}
              label={uploadedName}
              onDelete={handleReset}
              sx={{ mb: 2, maxWidth: "100%", "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }}
            />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            hidden
            onChange={handleFileChange}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            className="glow-btn"
            startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <UploadFileIcon />}
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            sx={{ py: 1.8, borderRadius: "14px", fontSize: "1rem" }}
          >
            {uploading ? "Please wait…" : pdfLoaded ? "Upload Another PDF" : "Upload a New PDF"}
          </Button>

          {existingFiles.length > 0 && !pdfLoaded && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="overline" color="text.secondary" fontWeight={600} display="block" mb={1.5}>
                Or Select Existing
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: "200px", overflowY: "auto", pr: 1 }}>
                {existingFiles.map((file) => (
                  <Button
                    key={file}
                    variant="outlined"
                    disabled={uploading}
                    onClick={() => handleSelectFile(file)}
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      color: "text.primary",
                      borderColor: "rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.02)",
                      "&:hover": {
                        background: "rgba(124,58,237,0.1)",
                        borderColor: "rgba(124,58,237,0.3)",
                      }
                    }}
                  >
                    <Typography variant="body2" noWrap sx={{ width: "100%", textAlign: "left" }}>
                      📄 {file}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ─── RIGHT PANEL ─── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          background: "#0f172a",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <Box
          className="glass"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 1.5,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: pdfLoaded ? "#22c55e" : "#64748b",
                boxShadow: pdfLoaded ? "0 0 8px #22c55e" : "none",
                transition: "all 0.4s ease",
              }}
            />
            <Typography variant="body2" color={pdfLoaded ? "text.primary" : "text.secondary"} fontWeight={500}>
              {pdfLoaded ? uploadedName ?? "PDF Ready" : "No document loaded"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {pdfLoaded && (
              <Tooltip title="New conversation">
                <IconButton
                  size="small"
                  onClick={handleReset}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "primary.light", background: "rgba(124,58,237,0.12)" },
                  }}
                >
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Clear entire cache & databases">
              <IconButton
                size="small"
                onClick={handleClearCache}
                sx={{
                  color: "error.light",
                  opacity: 0.8,
                  "&:hover": { color: "error.main", background: "rgba(239,68,68,0.12)", opacity: 1 },
                }}
              >
                <DeleteSweepIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Chat area */}
        <ChatWindow messages={messages} loading={loading} pdfLoaded={pdfLoaded} onSend={handleSend} />

        {/* Input area */}
        <Box
          className="glass"
          sx={{
            px: 3,
            py: 2.5,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          <ChatInput onSend={handleSend} disabled={loading} />
        </Box>
      </Box>
    </Box>
  );
}