import uuid
import time
from typing import Dict, Any, List, Optional

from backend.app.cv.inference import run_vision_inference
from backend.app.cv.gradcam import generate_saliency_heatmap
from backend.app.cv.labels import MODALITIES
from backend.app.rag.retriever import rag_retriever
from backend.app.search.pubmed import search_pubmed
from backend.app.agents.specialists import (
    VisionAnalystAgent,
    ClinicalContextAgent,
    EvidenceResearcherAgent,
    ReasoningSynthesisAgent,
    SkepticVerifierAgent
)
from backend.app.memory.database import record_case_trajectory

class MasterOrchestrator:
    """
    Coordinates dynamic multi-agent clinical decision-support workflows across all 8 modalities.
    Profiles cases, dynamically executes specialist agents, and logs auditable trajectories.
    """
    def __init__(self):
        self.vision_agent = VisionAnalystAgent()
        self.context_agent = ClinicalContextAgent()
        self.research_agent = EvidenceResearcherAgent()
        self.synthesis_agent = ReasoningSynthesisAgent()
        self.verifier_agent = SkepticVerifierAgent()

    def orchestrate_multimodal_case(
        self,
        image_bytes: Optional[bytes] = None,
        symptoms: str = "",
        case_domain: str = "chest_radiology",
        modality: str = "chest_xray"
    ) -> Dict[str, Any]:
        case_id = f"CASE-{uuid.uuid4().hex[:8].upper()}"
        start_time = time.time()
        agent_traces: List[Dict[str, Any]] = []

        # 1. Vision Subsystem
        vision_data = None
        heatmap_data = None
        if image_bytes:
            vision_data = run_vision_inference(image_bytes, modality=modality)
            top_pathology = vision_data.get("top_finding", {}).get("pathology") or MODALITIES.get(modality, MODALITIES["chest_xray"])["classes"][0]
            heatmap_data = generate_saliency_heatmap(image_bytes, target_class=top_pathology, modality=modality)
            
            # Agent 1: Vision Analyst
            v_trace = self.vision_agent.run(vision_data)
            agent_traces.append(v_trace)
        else:
            v_trace = {"output": "No imaging provided for this case."}

        # 2. Clinical Context Subsystem (RAG)
        context_query = symptoms or f"{modality.replace('_', ' ')} examination"
        retrieved_chunks = rag_retriever.retrieve(context_query, top_k=3)
        c_trace = self.context_agent.run(symptoms, retrieved_chunks)
        agent_traces.append(c_trace)

        # 3. Medical Evidence Search Subsystem (PubMed)
        search_query = vision_data.get("top_finding", {}).get("pathology") if vision_data else modality.replace('_', ' ')
        pubmed_articles = search_pubmed(f"{search_query} clinical management", max_results=3)
        r_trace = self.research_agent.run(search_query, pubmed_articles)
        agent_traces.append(r_trace)

        # 4. Reasoning & Synthesis Subsystem
        s_trace = self.synthesis_agent.run(
            vision_out=v_trace["output"],
            context_out=c_trace["output"],
            evidence_out=r_trace["output"]
        )
        agent_traces.append(s_trace)

        # 5. Skeptic / Verifier Subsystem
        ver_trace = self.verifier_agent.run(
            synthesis_text=s_trace["output"],
            vision_data=vision_data or {},
            evidence_articles=pubmed_articles
        )
        agent_traces.append(ver_trace)

        total_latency_ms = int((time.time() - start_time) * 1000)

        # 6. Record Trajectory to SQLite for Self-Learning Loop
        trajectory_record = {
            "case_id": case_id,
            "case_profile": {
                "modality": modality,
                "domain": case_domain,
                "complexity": "high" if vision_data and vision_data.get("detected_count", 0) > 1 else "moderate"
            },
            "agents_invoked": [t["agent"] for t in agent_traces],
            "models_used": [t.get("model_used", "default") for t in agent_traces],
            "retrieval_strategy": "Hybrid_BM25",
            "search_query": search_query,
            "evidence_pmids": [a["pmid"] for a in pubmed_articles],
            "verification_status": ver_trace.get("verification_status", "VERIFIED"),
            "verifier_confidence": ver_trace.get("confidence_score", 0.95),
            "failure_type": "None" if ver_trace.get("confidence_score", 1.0) >= 0.85 else "Potential_Unsupported_Claim"
        }
        record_case_trajectory(trajectory_record)

        return {
            "case_id": case_id,
            "modality": modality,
            "total_latency_ms": total_latency_ms,
            "vision_analysis": vision_data,
            "saliency_heatmap": heatmap_data,
            "retrieved_context": retrieved_chunks,
            "evidence_articles": pubmed_articles,
            "agent_traces": agent_traces,
            "final_synthesis": s_trace["output"],
            "verification": {
                "status": ver_trace.get("verification_status"),
                "confidence": ver_trace.get("confidence_score"),
                "audit_notes": ver_trace["output"]
            }
        }

orchestrator = MasterOrchestrator()
