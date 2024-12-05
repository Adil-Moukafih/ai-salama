[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

<p align="center">
  <img src="logo.png" alt="SALAMA Logo" width="50%">
</p>

# [🔴 SALAMA] - Safety Assurance with Live AI Monitoring & Alerts 🚦🤖

> **🚧 Development Status**: This is an early-stage prototype, and the code is not guaranteed to work. Currently, the functionality is limited to adding a camera, utilizing the **Camera Prompt** feature, and performing one detection cycle using YOLO11 and the LLaMA 3.2 Vision model through [OpenRouter](https://openrouter.ai/).  Most of the code has been AI-generated using [Cline](https://github.com/cline/cline), the generated code still requires polishing and refinement to ensure reliability and scalability. 🛠️ Contributions and feedback are welcome to help improve the project! 🚀

> **🏆 Award-Winning Innovation**: [2nd Prize Winner, TrainRail Hackathon Africa 2024 🌍](https://www.linkedin.com/posts/institut-de-formation-ferroviaire_the-trainrail-hackathon-africa-the-final-activity-7266778666125201410-ULww?utm_source=share&utm_medium=member_desktop)

SALAMA is an AI Safety System designed to improve surveillance systems with intelligent AI monitoring and alerts. By combining [YOLO11](https://github.com/ultralytics/ultralytics)'s fast detection capabilities with [LLaMA 3.2 Vision](https://ollama.com/blog/llama3.2-vision)'s contextual understanding, it aims to enhance railway safety by identifying risks in real-time and enabling proactive safety measures. Currently in its prototype phase, SALAMA represents a step towards smarter and safer railway operations.

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

- ⭐ **Star** this repository to show your support.  
- 🍴 **Fork** the project to experiment and propose enhancements.  
- 🐞 **Open Issues** for any bugs or feature suggestions.  
- 🤝 **Collaborate** by submitting pull requests.
  
If you'd like to support our work, consider making a donation:

<p align="left">
<a href="https://www.paypal.com/paypalme/AdilMoukafih">
  <img src="Donate.png" alt="Donate with PayPal" width="25%" />
</a>
</p>

We deeply appreciate the generosity of our supporters and donors! Your contributions make our mission possible.  

**List of Donors and Supporters:**  

- *Your Name Could Be Here!* - $[Amount]  
- *Become a supporter and be featured in this list.*  
- *Support us today to make a difference!* 🚀

*Want to see your name here? Donate today and support our efforts!* 🚀

Together, let's innovate and make railway systems safer through advanced AI technologies! 🚅

---

## Meet the Hackathon Red Team

SALAMA was developed during the [2nd TrainRail Hackathon 2024-2025](https://uic.org/events/2nd-train-rail-hackathon-2024-2025#Train-Rail-Hackathon), an international event organized by the **UIC Talent and Expertise Development Platform (TEDP)**. This prestigious hackathon brings together creative minds from around the world to address global railway challenges. 

Our team participated in the **African Regional Hackathon**, held at the **Institut de Formation Ferroviaire (IFF)** from **22 to 24 November 2024**, where we proudly secured the [2nd Prize Winner](https://www.linkedin.com/posts/institut-de-formation-ferroviaire_the-trainrail-hackathon-africa-the-final-activity-7266778666125201410-ULww?utm_source=share&utm_medium=member_desktop). Competing alongside innovative teams from across the continent, we developed an AI-driven prototype for enhancing railway safety.

Our collaborative team played distinct roles in making the project a success:

- **[Adil Moukafih](https://www.linkedin.com/in/adel-moukafih-0997a8bb/):** Idea Initiator, Team Leader, and AI Integration Lead
- **[Imane Kaab](https://www.linkedin.com/in/imane-kaab-577345146/):** Researcher on Cost Study and Safety Impact Analysis
- **[Fatine Bitar](https://www.linkedin.com/in/fatine-bitar-0a2001250/):** Presentation Lead (Speech and Delivery)
- **[Youssef Bertal](https://www.linkedin.com/in/youssef-bertal-7a581b271/):** Backend Support Developer
- **[Oumaima Tayyarat](https://www.linkedin.com/in/oumaima-tayyarat-7766071b7/):** Frontend Support Developer.

### Hackathon Coach  
- **[Asmaa Benghabrit](https://www.linkedin.com/in/asmaa-benghabrit-013a05103/):** Associate Professor and Researcher in AI,

Together, we combined our skills and creativity to deliver an innovative solution for railway safety, standing out among the best in Africa. 🚅

---

## 📜 License

This project is licensed under the Apache License, Version 2.0 - see the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) for details.

