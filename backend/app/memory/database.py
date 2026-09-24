import sqlite3
import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from backend.app.core.config import settings

logger = logging.getLogger("medintel.memory.database")

def get_db_connection():
    conn = sqlite3.connect(str(settings.DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initializes the SQLite schema for trajectories and learned policies."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trajectories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id TEXT UNIQUE NOT NULL,
            timestamp TEXT NOT NULL,
            modality TEXT,
            domain TEXT,
            complexity TEXT,
            agents_invoked TEXT,
            models_used TEXT,
            retrieval_strategy TEXT,
            search_query TEXT,
            evidence_pmids TEXT,
            verification_status TEXT,
            verifier_confidence REAL,
            failure_type TEXT,
            raw_payload TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS learned_policies (
            policy_key TEXT PRIMARY KEY,
            policy_value TEXT,
            last_updated TEXT
        );
    """)
    conn.commit()
    conn.close()

def record_case_trajectory(record: Dict[str, Any]):
    """Persists a single case execution trajectory."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO trajectories (
                case_id, timestamp, modality, domain, complexity,
                agents_invoked, models_used, retrieval_strategy,
                search_query, evidence_pmids, verification_status,
                verifier_confidence, failure_type, raw_payload
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record["case_id"],
            datetime.utcnow().isoformat(),
            record.get("case_profile", {}).get("modality", "unknown"),
            record.get("case_profile", {}).get("domain", "chest_radiology"),
            record.get("case_profile", {}).get("complexity", "moderate"),
            json.dumps(record.get("agents_invoked", [])),
            json.dumps(record.get("models_used", [])),
            record.get("retrieval_strategy", "hybrid"),
            record.get("search_query", ""),
            json.dumps(record.get("evidence_pmids", [])),
            record.get("verification_status", "VERIFIED"),
            record.get("verifier_confidence", 0.95),
            record.get("failure_type", "None"),
            json.dumps(record)
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Failed to record trajectory: {e}")

def get_recent_trajectories(limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieves recent trajectories."""
    init_database()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trajectories ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "case_id": r["case_id"],
            "timestamp": r["timestamp"],
            "modality": r["modality"],
            "domain": r["domain"],
            "complexity": r["complexity"],
            "agents_invoked": json.loads(r["agents_invoked"]) if r["agents_invoked"] else [],
            "models_used": json.loads(r["models_used"]) if r["models_used"] else [],
            "retrieval_strategy": r["retrieval_strategy"],
            "search_query": r["search_query"],
            "evidence_pmids": json.loads(r["evidence_pmids"]) if r["evidence_pmids"] else [],
            "verification_status": r["verification_status"],
            "verifier_confidence": r["verifier_confidence"],
            "failure_type": r["failure_type"]
        })
    conn.close()
    return results

# Initialize DB at import time
init_database()
