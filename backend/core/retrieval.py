from langchain_ollama import OllamaLLM
from langchain_classic.chains import create_retrieval_chain, create_history_aware_retriever
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from core.state import state

LLM_MODEL = "llama3.2:3b"

def build_chain(filename: str = None):
    llm = OllamaLLM(model=LLM_MODEL)
    search_kwargs = {"k": 3}
    if filename:
        search_kwargs["filter"] = {"source_file": filename}
    retriever = state.vectorstore.as_retriever(search_kwargs=search_kwargs)

    # Rewrite question using chat history
    contextualize_prompt = ChatPromptTemplate.from_messages([
        ("system", "Rewrite the question as a standalone question using chat history."),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_prompt
    )

    # Answer prompt
    answer_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful AI assistant for a document. "
                   "If the user says they uploaded a document, look at the chat history for their pending request (e.g., 'summarize') and fulfill it using the context. "
                   "If the user asks to summarize, provide a comprehensive summary of the context. "
                   "If the user greets you (e.g. 'hi'), respond politely. "
                   "Always answer based on the context below. Be concise.\n\nContext: {context}"),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    question_answer_chain = create_stuff_documents_chain(llm, answer_prompt)
    state.qa_chain = create_retrieval_chain(
        history_aware_retriever,
        question_answer_chain
    )

def get_answer(question: str) -> dict:
    if not state.qa_chain:
        q_lower = question.lower().strip()
        if q_lower in ["hi", "hi!", "hello", "hey", "what can you do?", "how do i upload a file?"]:
            answer = "Hi there! 👋 I'm DocMind AI. You can upload a PDF file from the panel on the left, and I'll be happy to answer any questions you have about it!"
        else:
            answer = "Please upload a PDF first so I can assist you with your document."
            
        state.chat_history.extend([
            HumanMessage(content=question),
            AIMessage(content=answer)
        ])
        return {"answer": answer, "sources": []}

    result = state.qa_chain.invoke({
        "input": question,
        "chat_history": state.chat_history
    })

    answer = result["answer"]
    sources = [
        {
            "file": doc.metadata.get("source_file", "unknown"),
            "page": doc.metadata.get("page", "?"),
            "content": doc.page_content[:200]
        }
        for doc in result["context"]
    ]

    # Update chat history
    state.chat_history.extend([
        HumanMessage(content=question),
        AIMessage(content=answer)
    ])

    return {"answer": answer, "sources": sources}