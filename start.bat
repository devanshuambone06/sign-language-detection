@echo off
cd /d "%~dp0"
title AI Sign Language Translator Pro
echo =======================================================
echo Starting AI Sign Language Translator Pro...
echo =======================================================

REM Detect Python executable
set PYTHON_EXE=python
if exist "%~dp0.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%~dp0.venv\Scripts\python.exe"
) else if exist "%~dp0venv\Scripts\python.exe" (
    set "PYTHON_EXE=%~dp0venv\Scripts\python.exe"
)

echo Using Python: %PYTHON_EXE%

echo Starting Backend Server on port 8000...
start "ASL Backend Server (Port 8000)" cmd /k "cd /d ""%~dp0backend"" && ""%PYTHON_EXE%"" main.py"

echo Starting Frontend Server on port 5173...
start "ASL Frontend Server (Port 5173)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo =======================================================
echo Waiting 4 seconds, then opening browser...
timeout /t 4 >nul
start http://localhost:5173/
