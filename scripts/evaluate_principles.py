#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "src"))

from spatial_foundation.cli import main  # noqa: E402


raise SystemExit(main(["evaluate", *sys.argv[1:]]))
