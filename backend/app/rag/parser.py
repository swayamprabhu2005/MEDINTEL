import io
import re

def parse_document_text(filename: str, content_bytes: bytes) -> str:
    """Parses plain text, markdown, or PDF files into clean clinical text."""
    lower_name = filename.lower()
    
    if lower_name.endswith((".txt", ".md", ".csv", ".json")):
        try:
            return content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            return content_bytes.decode("latin-1", errors="ignore")
            
    elif lower_name.endswith(".pdf"):
        # Simple native stream parser for text in PDF without heavy binary libraries
        try:
            raw = content_bytes.decode("latin-1", errors="ignore")
            # Extract text blocks between BT and ET
            matches = re.findall(r"BT[\s\S]*?ET", raw)
            extracted = []
            for m in matches:
                # Find strings inside parentheses
                strings = re.findall(r"\((.*?)\)", m)
                if strings:
                    extracted.append(" ".join(strings))
            text = "\n".join(extracted)
            if len(text.strip()) > 30:
                return text
        except Exception:
            pass
        # Fallback raw character extraction
        printable = "".join([chr(b) if 32 <= b < 127 or b in [10, 13] else " " for b in content_bytes])
        return re.sub(r"\s+", " ", printable).strip()
        
    else:
        return content_bytes.decode("utf-8", errors="ignore")
