#!/usr/bin/env bash
set -euo pipefail
(cd backend && npm install && npm run lint && npm test && npm run build)
(cd frontend && npm install && npm run lint && npm run build)
