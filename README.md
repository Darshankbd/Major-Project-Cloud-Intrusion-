# Cloud Intrusion Detection System (Cloud-IDS) using Machine Learning

[![Version](https://img.shields.io/badge/Release-v2.5.0-blue.svg)](https://github.com/)
[![License](https://img.shields.io/badge/License-Academic-green.svg)](https://github.com/)
[![Tech](https://img.shields.io/badge/Stack-Python%20%7C%20Flask%20%7C%20Scikit--Learn%20%7C%20React%2018%20%7C%20Tailwind-cyan.svg)](https://github.com/)

**Department of Information Science & Engineering (ISE), SKIT (2026–2027)**  
*Project Code: BIS786*

---

## 📌 Project Overview

**Cloud-IDS ML** is an intelligent, high-performance cybersecurity operations platform engineered to monitor high-throughput virtualized cloud environments, inspect live packet telemetry flows, and accurately classify network activity into benign traffic or multi-class threats (**Denial of Service (DoS)**, **Port Probes**, **Remote-to-Local (R2L)**, and **User-to-Root (U2R)**) with ultra-low false alarm rates (&lt;0.4%).

---

## 🚀 Key Features & Modules

1. **Live Security Operations Center (SOC) Dashboard**: Real-time packet telemetry graphs, threat distribution breakdown, active security alerts queue, and automated mitigation rule synthesis.
2. **Multi-Model ML Training Suite**: Side-by-side evaluation of **Random Forest** (100 estimator trees, bagging), **Decision Tree** (Gini impurity split), **Support Vector Machine**, **KNN**, and **Naive Bayes**.
3. **Downloadable Serialized Model (.joblib)**: Direct web export of trained models for edge deployment.
4. **Zero-Day Exploit Sandbox**: Interactive red-team simulation lab allowing operators to craft raw network packet vectors and test real-time AI classification response.
5. **Dataset Management & Profiling**: Preloaded with **NSL-KDD**, **CICIDS2017**, and **UNSW-NB15** standardized benchmark datasets, plus custom CSV dataset upload with automated data cleaning and profiling.
6. **Evaluation & Convergence Analytics**: 50-Epoch Training Loss & Validation curves (Loss: 0.182, Val Loss: 0.431, Acc: 97.2%, Val Acc: 91.2%), class distribution charts, and multi-class Confusion Matrix.
7. **Explainable AI (Detection Inspector)**: Drill-down inspection into individual packet feature vectors with Gini/tree feature importance attribution.
8. **Automated Firewall & Cloud Mitigation**: Instant synthesis of Linux `iptables` rules and AWS Security Group JSON policies for active threat containment.
9. **Executive PDF & CSV Reports**: Dynamic compilation of downloadable executive PDF audit reports using Python ReportLab engine.
10. **Role-Based Access Control (RBAC)**: Distinct permissions for System Administrators and Security Analysts.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend Runtime** | Python 3.14+ |
| **REST Controller** | Flask, Flask-CORS |
| **Machine Learning Engine** | Scikit-Learn, Pandas, NumPy, Joblib |
| **Database & Persistence** | SQLite 3 |
| **Document Generation** | ReportLab (PDF Engine) |
| **Frontend Platform** | React 18, Vite, Tailwind CSS, Lucide Icons |

---

## ⚡ Quick Start Guide

### 1. Start the Python Flask Backend
```bash
cd backend
python app.py
```
*Backend will initialize the SQLite database, train the default ML models, and listen on `http://127.0.0.1:5000`.*

### 2. Start the React Frontend
```bash
cd frontend
npm run dev
```
*Frontend will launch on `http://localhost:3000`.*

---

## 👤 Default Credentials
- **Administrator**: `admin` / `admin123` (Full system configuration and ML tuning)
- **Security Analyst**: `analyst` / `analyst123` (Alert triage, packet inspection, report generation)
