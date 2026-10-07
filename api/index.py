import sys
import os

# Add root directory to sys.path for serverless environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app
