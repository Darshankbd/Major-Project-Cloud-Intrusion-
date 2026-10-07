import os
import sys
import subprocess
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    python_exe = os.path.join(root_dir, "venv", "Scripts", "python.exe")
    if not os.path.exists(python_exe):
        python_exe = sys.executable

    print("================================================================")
    print(" Cloud Intrusion Detection System - Enterprise Launcher")
    print("================================================================")
    
    # 1. Start Backend Server
    backend_cmd = [python_exe, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    print("[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(backend_cmd, cwd=root_dir)

    time.sleep(3)

    # 2. Start Frontend Server
    frontend_dir = os.path.join(root_dir, "frontend")
    print("[2/2] Starting React Vite Frontend on http://localhost:5173 ...")
    frontend_cmd = ["cmd.exe", "/c", "npm run dev"]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    print("\n----------------------------------------------------------------")
    print(" Both Backend and Frontend services are running!")
    print(" - Backend REST & WS API: http://127.0.0.1:8000 / http://127.0.0.1:8000/docs")
    print(" - Enterprise App Dashboard: http://localhost:5173")
    print(" Press Ctrl+C to terminate both servers.")
    print("----------------------------------------------------------------\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down CloudGuard servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
