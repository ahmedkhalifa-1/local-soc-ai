# 🛡️ SOC AI Assistant

A local, offline AI-powered SOC (Security Operations Center) chatbot built with Flask + Ollama. Supports **Arabic & English** out of the box.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-3.x-black?logo=flask)
![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-orange)
![Model](https://img.shields.io/badge/Model-qwen2.5-purple)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📸 Preview

> Dark-themed chat UI with sidebar history, typing animation, RTL Arabic support, and offline mode.

---

## ✨ Features

- 💬 Chat with a local AI specialized in SOC & Cybersecurity
- 🌐 Bilingual: responds in Arabic or English based on your input
- 🕵️ Covers: SIEM, IDS/IPS, Log Analysis, Threat Detection, Incident Response
- 💾 Chat history saved in browser (localStorage)
- 🎨 Animated dark UI with sidebar, typing indicator, copy button
- 🔌 Fully offline — no API keys, no internet needed after setup
- 🔗 Easy to integrate with future SOC projects (Wazuh, Shuffle, etc.)

---

## 🗂️ Project Structure

```
local-soc-ai/
├── app.py              # Flask backend
├── llm.py              # Ollama LLM connector
├── requirements.txt    # Python dependencies
├── static/
│   ├── style.css       # Dark SOC-themed UI
│   └── script.js       # Chat logic + animations
└── templates/
    └── index.html      # Main chat interface
```

---

## ⚙️ Setup & Run

### 1. Install Ollama
Download from [https://ollama.com](https://ollama.com) and install it.

### 2. Pull the AI Model
```bash
ollama pull qwen2.5
```

### 3. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/local-soc-ai.git
cd local-soc-ai
```

### 4. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 5. Run the app
```bash
python app.py
```

### 6. Open in browser
```
http://127.0.0.1:5000
```

---

## 🔧 Configuration

To change the AI model, edit `llm.py`:
```python
"model": "qwen2.5"   # Change to any Ollama model you have
```

To change the assistant's behavior, edit the `SYSTEM_PROMPT` in `app.py`.

---

## 🔗 Integration Roadmap

This project is designed to integrate with upcoming SOC tools:

- [ ] **Wazuh SIEM** — query alerts directly from chat
- [ ] **Shuffle SOAR** — trigger playbooks via natural language
- [ ] **VirusTotal / AbuseIPDB** — IP/hash lookup from chat
- [ ] **Sigma Rules** — explain and generate detection rules

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python / Flask |
| LLM | Ollama (qwen2.5) |
| Frontend | HTML / CSS / Vanilla JS |
| Storage | Browser localStorage |

---

## 👤 Author

**Ahmed Khalifa**  
SOC Analyst & Cybersecurity Engineer  
[GitHub](https://github.com/ahmedkhalifa-1) • [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)

---

## 📄 License

MIT License — free to use and modify.