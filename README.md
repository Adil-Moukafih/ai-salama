[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

<p align="center">
  <img src="logo.png" alt="SALAMA Logo" width="50%">
</p>

# [🔴 SALAMA] - Safety Assurance with Live AI Monitoring & Alerts 🚦🤖

> **🚧 Development Status**: This is an early-stage prototype, and the code is not guaranteed to work. Currently, the functionality is limited to adding a camera, utilizing the **Camera Prompt** feature, and performing one detection cycle using YOLO11 and LLaMA 3.2 Vision models. Additional features and capabilities are under active development. 🛠️ Contributions and feedback are welcome to help improve the project! 🚀

> **🏆 Award-Winning Innovation**: [2nd Prize Winner, TrainRail Hackathon Africa 2024 🌍](https://www.linkedin.com/posts/institut-de-formation-ferroviaire_the-trainrail-hackathon-africa-the-final-activity-7266778666125201410-ULww?utm_source=share&utm_medium=member_desktop)

SALAMA is an AI prototype designed to improve surveillance systems with intelligent monitoring and alerts. By combining YOLO11's fast detection capabilities with LLaMA 3.2 Vision's contextual understanding, it aims to enhance railway safety by identifying risks in real-time and enabling proactive safety measures. Currently in its prototype phase, SALAMA represents a step towards smarter and safer railway operations.

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

# 🌟 Get Involved

SALAMA is a collaborative project in its prototype stage, and we welcome contributions from the community. Here's how you can get involved:

- **Star** this repository to show your support.
- **Fork** the project to experiment and propose enhancements.
- **Open Issues** for any bugs or feature suggestions.
- **Collaborate** by submitting pull requests.

If you'd like to support our work, consider making a donation:

<p align="left">
<a href="https://www.paypal.com/paypalme/AdilMoukafih">
  <img src="Donate.png" alt="Donate with PayPal" width="25%" />
</a>
</p>

We deeply appreciate the generosity of our supporters and donors! Your contributions make our mission possible.  
**Donors and Supporters:**  

- [Your Name Here]  
- [Your Name Here]  
- [Your Name Here]  

*Want to see your name here? Donate today and support our efforts!* 🚀

Together, let's innovate and make railway systems safer through advanced AI technologies! 🚅

---

## 📜 License

This project is licensed under the Apache License, Version 2.0 - see the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) for details.

