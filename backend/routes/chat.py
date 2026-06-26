from fastapi import APIRouter
from pydantic import BaseModel
from core.retrieval import get_answer

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/chat")
def chat(request: QuestionRequest):
    return get_answer(request.question)

@router.delete("/reset")
def reset_chat():
    from core.state import state
    state.chat_history = []
    # Note: we don't clear vectorstore here, just the chat history
    # so the user can start a new conversation with the same PDF
    return {"message": "Chat history reset"}