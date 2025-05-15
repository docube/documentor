# app/ingestion/vectorstore.py

import os
from typing import List
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from app.config.settings import get_settings
import faiss
import pickle
import numpy as np

settings = get_settings()

class VectorStoreManager:
    def __init__(self, base_path: str = "vectorstore/"):
        self.base_path = base_path
        os.makedirs(self.base_path, exist_ok=True)
        self.embedding_model = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)

    def save_vectorstore(self, embeddings: List[List[float]], texts: List[str], document_name: str):
        """
        Save a FAISS index and corresponding text chunks to disk.
        """
        if not embeddings or not texts:
            raise ValueError("Embeddings and texts must not be empty.")
    
        if len(embeddings) != len(texts):
            raise ValueError("Embeddings and texts must be the same length.")
    
        vectors = np.array(embeddings).astype("float32")
        dim = vectors.shape[1]
        
        # Create a simple L2 FAISS index
        index = faiss.IndexFlatL2(dim)
        index.add(vectors)

        doc_folder = os.path.join(self.base_path, document_name)
        os.makedirs(doc_folder, exist_ok=True)

        # Save FAISS index
        index_path = os.path.join(doc_folder, "index.faiss")
        faiss.write_index(index, index_path)

        # Save associated texts (you can extend this to include metadata if needed)
        metadata_path = os.path.join(doc_folder, "index.pkl")
        with open(metadata_path, "wb") as f:
            pickle.dump(texts, f)

    def save_from_texts(self, texts: List[str], document_name: str):
        """
        Uses LangChain to embed and save vectorstore from texts.
        """
        doc_folder = os.path.join(self.base_path, document_name)
        os.makedirs(doc_folder, exist_ok=True)

        vectorstore = FAISS.from_texts(texts, embedding=self.embedding_model)
        vectorstore.save_local(doc_folder)
