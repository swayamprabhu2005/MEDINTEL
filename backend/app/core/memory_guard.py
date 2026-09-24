import os
import gc
import psutil
import logging
from backend.app.core.config import settings

logger = logging.getLogger("medintel.memory_guard")

def get_process_memory_mb() -> float:
    """Returns current process RSS memory in megabytes."""
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / (1024 * 1024)

def check_memory_guard():
    """Checks current RAM usage and invokes GC if approaching threshold."""
    mem_mb = get_process_memory_mb()
    if mem_mb > settings.MAX_MEMORY_MB:
        logger.warning(f"Memory threshold exceeded: {mem_mb:.1f} MB > {settings.MAX_MEMORY_MB} MB. Triggering garbage collection.")
        gc.collect()
        new_mem = get_process_memory_mb()
        logger.info(f"Post-collection memory: {new_mem:.1f} MB")
    return mem_mb
