[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

# [🔴 SALAMA] - Safety Assurance with Live AI Monitoring & Alerts 🚦🤖

> **🚧 Development Status**: This is an early-stage prototype, and the code is not guaranteed to work as intended in all scenarios. Currently, the functionality is limited to adding a camera, utilizing the **Camera Prompt** feature, and performing one detection cycle using YOLO11 and LLaMA 3.2 Vision models. Additional features and capabilities are under active development. 🛠️ Contributions and feedback are welcome to help improve the project! 🚀

> **🏆 Award-Winning Innovation**: 2nd Prize Winner, TrainRail Hackathon Africa 2024 🌍

SALAMA is a groundbreaking AI prototype transforming surveillance systems through intelligent monitoring and alerts. Leveraging the unparalleled detection speed of **YOLO11** and the advanced contextual understanding of **LLaMA 3.2 Vision**, SALAMA enhances railway safety by detecting risks in real-time and ensuring proactive safety measures.

---

## 🚀 Introduction

In the realm of railway safety, the need for intelligent, real-time monitoring systems is paramount. Traditional surveillance often relies on manual oversight, leading to delayed responses and human error. SALAMA addresses these challenges by integrating state-of-the-art AI technologies to create a proactive safety net.

### The Vision

Imagine a surveillance system capable of instantaneously detecting potential hazards and making context-aware decisions to prevent incidents. By harnessing the swift object detection capabilities of **YOLO11** and the sophisticated visual reasoning of **LLaMA 3.2 Vision**, SALAMA sets a new standard for intelligent monitoring systems.

### How SALAMA Transforms Surveillance

- **YOLO11** provides lightning-fast object detection, processing video feeds at **100 FPS** to identify people, objects, and potential hazards in real-time.
- **LLaMA 3.2 Vision** offers advanced contextual analysis, interpreting detections within their environment to trigger intelligent actions and reduce false positives.
- The synergy of these technologies enables SALAMA to deliver proactive alerts, ensuring safety operators can respond swiftly to emerging risks.

---

## ⚡ Prototype Features

1. **Real-Time Object Detection**
   - Swiftly detects hazards, unauthorized access, and unattended objects using YOLO11.
2. **Contextual Understanding**
   - Employs LLaMA 3.2 Vision for context-aware analysis, reducing false alarms and improving response accuracy.
3. **Proactive Alerts**
   - Notifies operators via audio, visual, and dashboard alerts for immediate action.
4. **Scalability**
   - Designed to support multiple camera feeds and scalable deployments.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.8+
- **PostgreSQL** database

### Deployment Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/salama.git
   cd salama
   ```

2. **Backend Setup**

   - Navigate to the backend directory:

     ```bash
     cd salama-backend
     ```

   - Create a virtual environment and activate it:

     ```bash
     python -m venv venv
     source venv/bin/activate
     ```

   - Install dependencies:

     ```bash
     pip install -r requirements.txt
     ```

   - Configure environment variables in `.env`:

     ```env
     DATABASE_URL=postgresql://user:password@localhost/salama
     ```

   - Start the backend server:

     ```bash
     uvicorn app.main:app --reload
     ```

3. **Frontend Setup**

   - Navigate to the frontend directory:

     ```bash
     cd ../salama-app
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Configure environment variables in `.env.local`:

     ```env
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

   - Start the development server:

     ```bash
     npm run dev
     ```

   - Access the frontend at `http://localhost:3000`.

---

## 🌟 Get Involved

SALAMA is a collaborative project in its prototype stage, and we welcome contributions from the community. Here's how you can get involved:

- **Star** this repository to show your support.
- **Fork** the project to experiment and propose enhancements.
- **Open Issues** for any bugs or feature suggestions.
- **Collaborate** by submitting pull requests.

Together, let's innovate and make railway systems safer through advanced AI technologies! 🚅

---

## 📜 License

This project is licensed under the Apache License, Version 2.0 - see the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) for details.

