Job Portal (LinkedIn Clone)

A full-stack LinkedIn-like Job Portal built using Java Spring Boot (backend) and React + TypeScript (frontend).
This application allows users to authenticate, create posts, connect, and interact in a social professional network.

📌 Features
🔐 JWT Authentication & OAuth 2.0 (Google Login)
👤 User Registration & Login
📝 Create & Manage Posts
🤝 Connection / Networking System
💬 Real-time Messaging (WebSocket based)
📧 Email Testing using Mailhog
📊 Scalable REST API Architecture
🐳 Dockerized Backend Services
⚡ CI/CD using GitHub Actions
🛠 Tech Stack
Backend
Java 17
Spring Boot
Spring Security
JWT Authentication
Hibernate / JPA
MySQL
WebSocket (Real-time messaging)
Gradle
Frontend
React.js (TypeScript)
Vite
SCSS Modules
Axios
DevOps & Tools
Docker & Docker Compose
GitHub Actions (CI/CD)
Mailhog (Email Testing)

🧠 Architecture

The backend follows a layered architecture:

Controller → Handles API requests
Service → Business logic
Repository → Database access
DTO → Data transfer objects
Configuration → Security & app configs

Frontend follows a feature-based modular structure:

authentication
feed
messaging
networking
profile
⚙️ Running the Project Locally
🔹 Prerequisites
Node.js (v22+)
npm (v10+)
Java JDK (v21)
Docker (v24+)
🖥 Backend Setup
cd backend
Run Docker containers (MySQL + Mailhog)
docker-compose up
Build the project

Windows:

gradlew.bat build -t -x test

Mac/Linux:

./gradlew build -t -x test
Optional: OAuth Setup

Windows:

set OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
set OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret

Mac/Linux:

export OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
export OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
Run Backend

Windows:

gradlew.bat bootRun

Mac/Linux:

./gradlew bootRun
🌐 Frontend Setup
cd frontend
Setup environment variables

Windows:

copy .env.example .env

Mac/Linux:

cp .env.example .env
Install dependencies
npm install
Run frontend
npm run dev
🔗 Application URLs
Backend → http://localhost:8080
Frontend → http://localhost:5173
Mailhog UI → http://localhost:8025
🗄 Database Configuration
Host: 127.0.0.1
Port: 3306
Username: root
Password: root
⚙️ CI/CD (GitHub Actions)

To test workflows locally using act:

Create a file event.json:

{
  "repository": {
    "default_branch": "main"
  },
  "push": {
    "base_ref": "refs/heads/main",
    "commits": [
      {
        "modified": ["frontend/some-file.js", "backend/some-file.java"]
      }
    ]
  }
}

Run:

act -e event.json
🎯 Future Improvements
Add notifications system
Improve microservices architecture
Add caching (Redis)
Deploy on cloud (AWS/Azure)
Enhance UI/UX

