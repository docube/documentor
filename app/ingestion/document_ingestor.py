# app/ingestion/document_ingestor.py

import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.services.parsers.dynamic_parser import parse_document
from app.ingestion.embedder import TextEmbedder
from app.ingestion.vectorstore import VectorStoreManager

class DocumentIngestor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        self.embedder = TextEmbedder()
        self.vectorstore_manager = VectorStoreManager()

    def ingest(self, file_path: str) -> str:
        """
        Ingest a document: parse, chunk, embed, and store vectors.
        """
        try:
            # 1. Parse document text
            raw_text = parse_document(file_path)
            if not raw_text:
                raise ValueError("Parsed document is empty.")

            # 2. Split into chunks
            chunks = self.text_splitter.split_text(raw_text)

            # 3. Embed the chunks
            embeddings = self.embedder.embed_texts(chunks)

            # 4. Save to vectorstore
            doc_name = os.path.splitext(os.path.basename(file_path))[0]
            self.vectorstore_manager.save_vectorstore(embeddings, chunks, doc_name)

            return f"Document '{doc_name}' successfully ingested with {len(chunks)} chunks."
        except Exception as e:
            raise RuntimeError(f"Failed to ingest document '{file_path}': {str(e)}")
