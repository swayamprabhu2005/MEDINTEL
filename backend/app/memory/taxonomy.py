FAILURE_TAXONOMY = {
    "VISION_CLASSIFICATION_ERROR": "Misidentification or false positive/negative in pathology classifier.",
    "LOCALIZATION_ERROR": "Grad-CAM or segmentation heatmap focused on incorrect anatomical region.",
    "INSUFFICIENT_IMAGE_QUALITY": "Artifacts, underexposure, or rotation hindering diagnostic validity.",
    "CLINICAL_CONTEXT_EXTRACTION_FAILURE": "Omission or misinterpretation of documented prior clinical history.",
    "DOCUMENT_RETRIEVAL_FAILURE": "RAG retriever failed to surface relevant clinical document chunks.",
    "TEMPORAL_RETRIEVAL_FAILURE": "Failed to resolve longitudinal changes between prior and current scans.",
    "POOR_SEARCH_QUERY_FORMULATION": "PubMed query too broad, too narrow, or missing key MeSH terms.",
    "LOW_QUALITY_SOURCE_SELECTION": "Evidence sourced from unverified or low-impact publications.",
    "EVIDENCE_CONTRADICTION_MISSED": "Synthesis accepted claim directly conflicting with cited guideline.",
    "UNSUPPORTED_CLAIM_HALLUCINATION": "Statement generated without grounding in images, documents, or PubMed.",
    "INCORRECT_EVIDENCE_MAPPING": "Citing an article that does not actually substantiate the claim.",
    "AGENT_ROUTING_FAILURE": "Orchestrator failed to invoke a required specialist agent.",
    "WRONG_MODEL_SELECTION": "Sub-optimal model assigned to a complex clinical reasoning task.",
    "OVER_COMPUTATION_UNNECESSARY_AGENTS": "Invoking extensive multi-agent pipelines for simple, clear cases."
}
