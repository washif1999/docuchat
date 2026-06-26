from fastapi import APIRouter
from core.state import state
import shutil, os

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok"}

@router.delete("/reset")
def reset():
    state.vectorstore = None
    state.qa_chain = None
    state.chat_history = []
    if os.path.exists("./chroma_db"):
        shutil.rmtree("./chroma_db")
    return {"message": "✅ Reset successful"}