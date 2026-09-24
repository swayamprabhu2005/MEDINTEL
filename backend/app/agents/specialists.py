import time
from typing import Dict, Any, List
from backend.app.core.config import settings
from backend.app.agents.llm_client import llm_client

class VisionAnalystAgent:
    """Interprets raw Computer Vision probabilities and Grad-CAM hot regions."""
    ROLE = "Vision Analyst Agent"
    
    def run(self, vision_data: Dict[str, Any]) -> Dict[str, Any]:
        start = time.time()
        findings = vision_data.get("findings", [])
        top_detected = [f"{f['pathology']} ({f['percentage']}%)" for f in findings if f.get("detected")]
        
        prompt = (
            f"Image status: {vision_data.get('status')}\n"
            f"Detected pathologies: {', '.join(top_detected) if top_detected else 'None above threshold'}\n"
            f"Top pathology: {vision_data.get('top_finding', {}).get('pathology')} "
            f"({vision_data.get('top_finding', {}).get('percentage')}%)\n\n"
            "Provide a concise, objective radiologic report interpreting these findings and the Grad-CAM localization."
        )
        
        system_msg = "You are a Board-Certified Radiologist acting as the Vision Analyst Agent. State observations clearly without over-diagnosing."
        response = llm_client.generate(prompt, system_instruction=system_msg, model_name=settings.VISION_ANALYST_MODEL)
        
        return {
            "agent": self.ROLE,
            "model_used": settings.VISION_ANALYST_MODEL if settings.NVIDIA_API_KEY else "clinical_baseline",
            "latency_ms": int((time.time() - start) * 1000),
            "output": response
        }

class ClinicalContextAgent:
    """Extracts and synthesizes clinical patient context from uploaded documents and symptoms."""
    ROLE = "Clinical Context Agent"
    
    def run(self, symptoms: str, retrieved_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        start = time.time()
        context_text = "\n".join([f"- [{c.get('filename')}]: {c.get('content')}" for c in retrieved_chunks[:3]])
        
        prompt = (
            f"Patient Reported Symptoms: {symptoms or 'No acute symptoms reported.'}\n\n"
            f"Retrieved Clinical Documents:\n{context_text if context_text else 'No prior medical documents uploaded.'}\n\n"
            "Synthesize the relevant clinical background, chronicity, and baseline risks."
        )
        
        system_msg = "You are an Internal Medicine Physician acting as the Clinical Context Agent. Ground all statements strictly in the provided text."
        response = llm_client.generate(prompt, system_instruction=system_msg, model_name=settings.ORCHESTRATOR_MODEL)
        
        return {
            "agent": self.ROLE,
            "model_used": settings.ORCHESTRATOR_MODEL if settings.NVIDIA_API_KEY else "clinical_baseline",
            "latency_ms": int((time.time() - start) * 1000),
            "output": response
        }

class EvidenceResearcherAgent:
    """Evaluates PubMed search findings and clinical guidelines."""
    ROLE = "Evidence Researcher Agent"
    
    def run(self, query: str, articles: List[Dict[str, Any]]) -> Dict[str, Any]:
        start = time.time()
        lit_text = "\n".join([f"- PMID {a['pmid']}: {a['title']} ({a['journal']}, {a['pub_date']}) - {a['evidence_level']}" for a in articles[:3]])
        
        prompt = (
            f"Clinical Query: {query}\n\n"
            f"Retrieved Biomedical Literature:\n{lit_text}\n\n"
            "Summarize the evidence-based consensus, recommended diagnostic criteria, and standard treatment pathways."
        )
        
        system_msg = "You are a Medical Evidence Specialist. Cite specific PMIDs and evidence levels for every claim."
        response = llm_client.generate(prompt, system_instruction=system_msg, model_name=settings.RESEARCHER_MODEL)
        
        return {
            "agent": self.ROLE,
            "model_used": settings.RESEARCHER_MODEL if settings.NVIDIA_API_KEY else "clinical_baseline",
            "latency_ms": int((time.time() - start) * 1000),
            "output": response
        }

class ReasoningSynthesisAgent:
    """Assembles all findings into a unified clinical decision-support report."""
    ROLE = "Reasoning & Synthesis Agent"
    
    def run(self, vision_out: str, context_out: str, evidence_out: str) -> Dict[str, Any]:
        start = time.time()
        prompt = (
            f"Vision Analysis:\n{vision_out}\n\n"
            f"Clinical Context:\n{context_out}\n\n"
            f"Biomedical Evidence:\n{evidence_out}\n\n"
            "Synthesize an integrated differential diagnosis, risk stratification, and suggested clinical next steps."
        )
        
        system_msg = "You are the Lead Clinical Synthesizer. Present a cohesive diagnostic impression with explicit rationale."
        response = llm_client.generate(prompt, system_instruction=system_msg, model_name=settings.ORCHESTRATOR_MODEL)
        
        return {
            "agent": self.ROLE,
            "model_used": settings.ORCHESTRATOR_MODEL if settings.NVIDIA_API_KEY else "clinical_baseline",
            "latency_ms": int((time.time() - start) * 1000),
            "output": response
        }

class SkepticVerifierAgent:
    """Audits claims against evidence, detects contradictions, and scores certainty."""
    ROLE = "Skeptic / Verifier Agent"
    
    def run(self, synthesis_text: str, vision_data: Dict[str, Any], evidence_articles: List[Dict[str, Any]]) -> Dict[str, Any]:
        start = time.time()
        top_detected = [f['pathology'] for f in vision_data.get("findings", []) if f.get("detected")]
        
        prompt = (
            f"Draft Synthesis:\n{synthesis_text}\n\n"
            f"Ground Truth Vision Findings: {', '.join(top_detected) if top_detected else 'Normal'}\n"
            f"Ground Truth Evidence PMIDs: {[a['pmid'] for a in evidence_articles]}\n\n"
            "Audit the synthesis. Answer:\n"
            "1. Are all claims supported by the vision output and evidence?\n"
            "2. Are there any hallucinations or contradictions?\n"
            "3. Assign an audit score between 0.00 and 1.00."
        )
        
        system_msg = "You are a Chief Medical Auditor and Quality Verifier. Be rigorous, critical, and conservative."
        response = llm_client.generate(prompt, system_instruction=system_msg, model_name=settings.VERIFIER_MODEL)
        
        # Calculate verification confidence score
        score = 0.95
        verification_status = "VERIFIED"
        if "contradiction" in response.lower() or "unsupported" in response.lower():
            score = 0.65
            verification_status = "REQUIRES_REVIEW"
        if "hallucination" in response.lower() or "critical error" in response.lower():
            score = 0.40
            verification_status = "FLAGGED_INCONSISTENT"
            
        return {
            "agent": self.ROLE,
            "model_used": settings.VERIFIER_MODEL if settings.NVIDIA_API_KEY else "clinical_baseline",
            "latency_ms": int((time.time() - start) * 1000),
            "verification_status": verification_status,
            "confidence_score": score,
            "output": response
        }
