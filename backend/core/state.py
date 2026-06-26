from langchain_core.messages import BaseMessage
from typing import Optional

class AppState:
    vectorstore = None
    qa_chain = None
    chat_history: list[BaseMessage] = []

state = AppState()