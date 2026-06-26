from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings
from core.state import state

EMBED_MODEL = "nomic-embed-text"
CHROMA_DIR = "./chroma_db"

def ingest_pdf(file_path: str, filename: str) -> int:
    # Load PDF
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    # Tag each chunk with source filename
    for doc in docs:
        doc.metadata["source_file"] = filename

    # Chunk
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_documents(docs)

    # Embed & store in ChromaDB
    embeddings = OllamaEmbeddings(model=EMBED_MODEL)
    state.vectorstore = Chroma.from_documents(
        chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DIR
    )

    return len(chunks)