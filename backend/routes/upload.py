from fastapi import APIRouter, UploadFile, File, HTTPException
from core.ingestion import ingest_pdf
from core.retrieval import build_chain
import shutil, os

router = APIRouter()
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        chunks = ingest_pdf(file_path, file.filename)
        build_chain(file.filename)

        return {
            "message": f"✅ {file.filename} processed",
            "chunks": chunks
        }
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/clear")
async def clear_cache():
    from core.state import state
    try:
        # Clear uploads
        if os.path.exists(UPLOAD_DIR):
            shutil.rmtree(UPLOAD_DIR)
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        
        # Clear chromadb safely without locking
        import chromadb
        if hasattr(chromadb.api.client.SharedSystemClient, 'clear_system_cache'):
            chromadb.api.client.SharedSystemClient.clear_system_cache()
            
        chroma_dir = "./chroma_db"
        if os.path.exists(chroma_dir):
            try:
                shutil.rmtree(chroma_dir)
            except Exception:
                pass
            
        # Reset state
        state.vectorstore = None
        state.qa_chain = None
        state.chat_history = []
        
        return {"message": "Cache cleared successfully"}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files")
async def get_files():
    try:
        files = []
        if os.path.exists(UPLOAD_DIR):
            files = [f for f in os.listdir(UPLOAD_DIR) if f.endswith(".pdf")]
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel

class SelectRequest(BaseModel):
    filename: str

@router.post("/select")
async def select_file(request: SelectRequest):
    try:
        filename = request.filename
        file_path = f"{UPLOAD_DIR}/{filename}"
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        from core.state import state
        if state.vectorstore is None:
            # Re-initialize vectorstore from disk
            from langchain_community.vectorstores import Chroma
            from langchain_ollama import OllamaEmbeddings
            embeddings = OllamaEmbeddings(model="nomic-embed-text")
            state.vectorstore = Chroma(
                persist_directory="./chroma_db",
                embedding_function=embeddings
            )
        
        build_chain(filename)

        return {"message": f"✅ {filename} selected"}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))