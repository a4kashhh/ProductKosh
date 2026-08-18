import os
import glob
import re
from typing import List, Dict, Any
from backend.config import settings

class RetrievalService:
    def __init__(self):
        self.chunks: List[Dict[str, Any]] = []
        self.is_indexed = False
        self.vectorizer = None
        self.tfidf_matrix = None

    def ingest_corpus(self, docs_dir: str = None) -> int:
        target_dir = docs_dir or settings.SOURCE_DOCS_DIR
        doc_files = glob.glob(os.path.join(target_dir, "*.md")) + glob.glob(os.path.join(target_dir, "*.txt"))
        
        self.chunks = []
        chunk_idx = 0
        
        for file_path in doc_files:
            file_name = os.path.basename(file_path)
            doc_title = file_name.replace(".md", "").replace(".txt", "")
            
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Split document into logical sections by headers
            sections = re.split(r'\n(?=##?\s)', content)
            
            for section in sections:
                cleaned = section.strip()
                if not cleaned:
                    continue
                
                chunk_id = f"{doc_title}_chunk_{chunk_idx}"
                self.chunks.append({
                    "chunk_id": chunk_id,
                    "doc_name": doc_title,
                    "file_path": file_path,
                    "text": cleaned,
                    "metadata": {
                        "source": doc_title,
                        "file_name": file_name
                    }
                })
                chunk_idx += 1
                
        # Build Vector Search Index using TF-IDF / Cosine Similarity
        if self.chunks:
            try:
                from sklearn.feature_extraction.text import TfidfVectorizer
                corpus_texts = [c["text"] for c in self.chunks]
                self.vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
                self.tfidf_matrix = self.vectorizer.fit_transform(corpus_texts)
            except Exception as e:
                print(f"[RetrievalService] Error building vectorizer: {e}")
                
        self.is_indexed = True
        return len(self.chunks)

    def retrieve_candidate_chunks(self, product_name: str, known_attributes: Dict[str, Any] = None, top_k: int = 4) -> List[Dict[str, Any]]:
        if not self.is_indexed or not self.chunks:
            self.ingest_corpus()

        if not self.chunks:
            return []

        # Construct semantic query
        query_parts = [product_name]
        if known_attributes:
            for k, v in known_attributes.items():
                query_parts.append(f"{k} {v}")
        query_text = " ".join(query_parts)

        # Vector similarity search
        if self.vectorizer is not None and self.tfidf_matrix is not None:
            try:
                from sklearn.metrics.pairwise import cosine_similarity
                import numpy as np
                
                query_vec = self.vectorizer.transform([query_text])
                scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
                
                top_indices = np.argsort(scores)[::-1][:top_k]
                
                results = []
                for idx in top_indices:
                    score = float(scores[idx])
                    chunk = self.chunks[idx].copy()
                    chunk["similarity_score"] = round(score, 4)
                    results.append(chunk)
                return results
            except Exception as e:
                print(f"[RetrievalService] Vector search error: {e}")

        # Fallback keyword scoring
        scored_chunks = []
        tokens = set(re.findall(r'\w+', query_text.lower()))
        for chunk in self.chunks:
            text_lower = chunk["text"].lower()
            matches = sum(1 for t in tokens if len(t) > 2 and t in text_lower)
            score = round(matches / max(len(tokens), 1), 4)
            c = chunk.copy()
            c["similarity_score"] = score
            scored_chunks.append(c)

        scored_chunks.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored_chunks[:top_k]

retrieval_service = RetrievalService()
