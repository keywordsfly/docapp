import json
from pathlib import Path
from datetime import datetime
from typing import Any, Dict, List

DATA_FILE = Path("data.json")

class Storage:
    def __init__(self, path: Path = DATA_FILE):
        self.path = path
        self.path.touch(exist_ok=True)

    def _load(self) -> Dict[str, Any]:
        if self.path.stat().st_size == 0:
            return {"doctors": [], "patients": [], "appointments": [], "availability": []}
        with self.path.open("r", encoding="utf-8") as fh:
            return json.load(fh)

    def _save(self, data: Dict[str, Any]):
        with self.path.open("w", encoding="utf-8") as fh:
            json.dump(data, fh, default=str, indent=2)

    def get_data(self) -> Dict[str, Any]:
        return self._load()

    def save_data(self, data: Dict[str, Any]):
        self._save(data)
