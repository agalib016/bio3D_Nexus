import os
import sys

# Ensure root workspace directory is in the sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import app

# Export the WSGI application for Vercel
app = app
