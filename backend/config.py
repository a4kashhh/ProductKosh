import os

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    SOURCE_DOCS_DIR: str = os.getenv("SOURCE_DOCS_DIR", "mock_corpus/source_documents")
    INPUT_PRODUCTS_FILE: str = os.getenv("INPUT_PRODUCTS_FILE", "mock_corpus/input_products.json")
    CHROMA_PERSIST_DIR: str = os.getenv("CHROMA_PERSIST_DIR", "mock_corpus/chroma_db")
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.80"))

settings = Settings()
