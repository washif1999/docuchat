import { useState } from "react";
import { Box, Button, Typography, CircularProgress, Chip } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { uploadPDF } from "../api/ragApi";

interface Props {
  onUploaded: (filename: string) => void;
}

export default function PDFUploader({ onUploaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      await uploadPDF(file);
      setUploaded(file.name);
      onUploaded(file.name);
    } catch (err) {
      alert("Upload failed. Make sure PDF is not password protected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {uploaded && (
        <Chip
          label={uploaded}
          color="success"
          variant="outlined"
          onDelete={() => setUploaded(null)}
          sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', fontWeight: 500, borderColor: 'transparent' }}
        />
      )}
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadFileIcon />}
        disabled={loading}
        sx={{ 
          borderRadius: '20px', 
          px: 3, 
          background: 'linear-gradient(45deg, #4f46e5, #ec4899)',
          color: 'white',
          boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(236, 72, 153, 0.5)',
          }
        }}
      >
        {loading ? <CircularProgress size={18} color="inherit" /> : "Upload PDF"}
        <input type="file" accept=".pdf" hidden onChange={handleFile} />
      </Button>
    </Box>
  );
}