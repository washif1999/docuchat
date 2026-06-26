# DocMind AI 🧠

DocMind AI is a modern, full-stack RAG (Retrieval-Augmented Generation) application that lets you upload any PDF and instantly have natural language conversations about its content. 

![DocMind AI Demo]

<img width="2940" height="1622" alt="D04E4ADA-D963-48F0-9E87-C301CBCA769C_1_206_a" src="https://github.com/user-attachments/assets/7172ee62-1f1c-42cc-a829-4bfb16eb453f" />

<img width="800" height="441" alt="ScreenRecording2026-06-26at4 27 06PM-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/03ecd089-5421-43b0-8bc0-f3ce4ca01e23" />

## ✨ Features
- **Upload & Chat**: Upload any PDF document and get instant, accurate answers.
- **Source Citations**: Every answer includes the exact file and page number the information was pulled from.
- **Previous Sessions**: Automatically lists existing uploaded documents so you don't have to re-upload.
- **Premium Dark UI**: Built with React & MUI, featuring a beautiful dark-mode interface with glassmorphism and subtle animations.
- **Local AI Privacy**: Powered by local Ollama models (`nomic-embed-text` for embeddings and `llama3.2:3b` for chat), ensuring your documents stay completely private.

## 🚀 Tech Stack
- **Frontend**: React, Vite, Material UI (MUI), TypeScript
- **Backend**: FastAPI, Python
- **AI / RAG**: LangChain, ChromaDB, Ollama

## 🛠️ Installation & Setup

### Prerequisites
1. Install [Python 3.10+](https://www.python.org/downloads/)
2. Install [Node.js](https://nodejs.org/en)
3. Install [Ollama](https://ollama.com/) and pull the necessary models:
   ```bash
   ollama pull llama3.2:3b
   ollama pull nomic-embed-text
   ```

### 1. Start the Backend Server
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start the server (runs on http://localhost:8000)
uvicorn main:app --reload
```

### 2. Start the Frontend App
Open a new terminal window:
```bash
cd frontend
npm install

# Start the Vite dev server (runs on http://localhost:5173)
npm run dev
```

## 🧹 Clearing Memory
To completely wipe the AI's memory and delete all uploaded PDFs from the database, simply click the red **Clear Cache** icon in the top right corner of the chat window.

---
*Built with ❤️ by Muhammad Washif*
