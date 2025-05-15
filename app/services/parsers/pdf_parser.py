# app/services/parsers/pdf_parser.py

import pdfplumber

def parse_pdf(file_path: str) -> str:
    """
    Extracts text (including tables) from a PDF file using pdfplumber.
    """
    extracted_text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            # Extract normal page text
            page_text = page.extract_text() or ""
            extracted_text += page_text + "\n"

            # Extract tables
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    row_text = " | ".join(cell if cell else "" for cell in row)
                    extracted_text += row_text + "\n"
                    
            extracted_text += "\n"  # Add a small separator between pages

    return extracted_text.strip()
