# 🚀 Job Portal Backend System (Spring Boot)

A scalable and production-ready **Job Portal Backend System** built using **Java Spring Boot** that enables candidates to search and apply for jobs while allowing recruiters to post and manage job listings.

This project demonstrates real-world backend development skills including **REST API design, authentication, database management, and scalable architecture**.

---

## 📌 Features

### 🔐 Authentication & Authorization

* User Registration & Login
* JWT-based Authentication
* Role-Based Access Control (CANDIDATE / RECRUITER / ADMIN)

### 💼 Job Management

* Create, update, delete job postings (Recruiter)
* View all jobs
* Advanced job filtering (location, role, salary)

### 📥 Job Application System

* Apply to jobs
* Track application status (APPLIED / REJECTED / SELECTED)
* Recruiters can view applicants

### 🔍 Search & Pagination

* Keyword-based job search
* Pagination & sorting for large datasets

### 📄 Resume Upload

* Upload and manage resumes (PDF)
* File handling support

### ⚠️ Error Handling & Validation

* Global exception handling using `@ControllerAdvice`
* Input validation using annotations (`@NotBlank`, `@Email`, etc.)

### 📊 API Documentation

* Swagger UI for testing APIs

---

## 🛠 Tech Stack

| Category    | Technology                  |
| ----------- | --------------------------- |
| Backend     | Java 17, Spring Boot        |
| Security    | Spring Security, JWT        |
| Database    | PostgreSQL                  |
| ORM         | Spring Data JPA (Hibernate) |
| Build Tool  | Maven                       |
| API Testing | Postman,                    |
           

---

## 🧱 Project Architecture

The project follows a **layered architecture**:

Controller → Service → Repository → Database

* **Controller Layer** → Handles HTTP requests
* **Service Layer** → Business logic
* **Repository Layer** → Database interaction
* **DTO Layer** → Data transfer & validation

---

## 📂 Project Structure

```
src/main/java/com/jobportal
│
├── controller
├── service
├── repository
├── entity
├── dto
├── config
├── exception
└── security
```

---

## 🔗 API Endpoints (Sample)

### 🔐 Auth APIs

* `POST /api/auth/register`
* `POST /api/auth/login`

### 💼 Job APIs

* `POST /api/jobs` → Create job
* `GET /api/jobs` → Get all jobs
* `GET /api/jobs/search` → Search jobs
* `PUT /api/jobs/{id}` → Update job
* `DELETE /api/jobs/{id}` → Delete job

### 📥 Application APIs

* `POST /api/applications/apply/{jobId}`
* `GET /api/applications/user`
* `GET /api/applications/job/{jobId}`

---

## 🚀 Getting Started

### 🔧 Prerequisites

* Java 17+
* Maven
* PostgreSQL

### ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/job-portal-backend.git

# Navigate to project
cd job-portal-backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

---

## 🧠 Skills Demonstrated

* REST API Development
* Spring Boot Backend Engineering
* JWT Authentication & Security
* Database Design & Integration
* Clean Code & Layered Architecture
* Scalable Backend Systems


