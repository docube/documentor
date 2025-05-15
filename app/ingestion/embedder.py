# app/ingestion/embedder.py

from typing import List
from langchain_openai import OpenAIEmbeddings

class TextEmbedder:
    def __init__(self, model: str = "text-embedding-ada-002"):
        """
        Initialize the embedder with a specific model.
        """
        self.model_name = model
        self.embedder = OpenAIEmbeddings(model=model)

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """
        Embed a list of text chunks and return their vector representations.
        """
        embeddings = self.embedder.embed_documents(texts)
        return embeddings
