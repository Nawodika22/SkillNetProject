# SkillNet Microservices Deployment Guide (Docker, Jenkins & Hosting)

This guide explains how to build, run, and host the complete SkillNet project using **Docker**, **Docker Compose**, and **Jenkins CI/CD**.

---

## 🏗️ Architecture Overview

The system runs 5 isolated containers connected via an internal bridge network (`skillnet-net`):

| Container Name | Service | Port (Host:Container) | Description |
|---|---|---|---|
| `skillnet-mysql` | MySQL 8.0 | `3306:3306` | Central persistent database (`skillnet_db`) |
| `skillnet-user-service` | User Service | `8081:8081` | Worker & HR authentication, profiles |
| `skillnet-vacancy-service` | Vacancy Service | `8082:8082` | Corporate vacancy management |
| `skillnet-matching-service` | Matching Service | `8083:8083` | Matching engine & notifications |
| `skillnet-frontend` | React + Nginx | `5173:80` | Modern SPA web application |

---

## 🐳 Option 1: Run with Docker Compose (Local or Cloud Server)

### Prerequisites:
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or Docker Engine (Linux).

### Step 1: Start All Services
Open a terminal in the root folder (`c:\Users\tharu\Desktop\SkilNetProjectNew`):
```bash
docker compose up -d --build
```

### Step 2: Check Container Status
```bash
docker compose ps
```
You should see all 5 containers with status `Up` (or `Up (healthy)`).

### Step 3: Access the Application
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **User Service API**: [http://localhost:8081](http://localhost:8081)
- **Vacancy Service API**: [http://localhost:8082](http://localhost:8082)
- **Matching Service API**: [http://localhost:8083](http://localhost:8083)

### To Stop the Containers:
```bash
docker compose down
```

---

## 🔄 Option 2: Automated CI/CD with Jenkins

### Step 1: Install & Start Jenkins
If running Jenkins locally via Docker:
```bash
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v /var/run/docker.sock:/var/run/docker.sock -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```
Open [http://localhost:8080](http://localhost:8080) and complete initial setup.

### Step 2: Create a Pipeline Job
1. In Jenkins dashboard, click **"New Item"**.
2. Enter name: `SkillNet-Pipeline` and select **"Pipeline"**, then click **OK**.
3. Scroll down to the **Pipeline** section:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/Nawodika22/SkillNetProject.git`
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`
4. Click **Save**.

### Step 3: Trigger the Build
Click **"Build Now"**. Jenkins will automatically:
1. Pull latest code from GitHub `main` branch.
2. Build all Docker images using multi-stage builds.
3. Launch all microservices and frontend via Docker Compose.
4. Perform health checks and report status!

---

## 🌐 Option 3: Cloud Hosting (AWS EC2 / DigitalOcean / VPS)

To host SkillNet online on a live server:

1. **Launch an Ubuntu Linux Server** (e.g. AWS EC2 t3.medium or DigitalOcean Droplet).
2. **Install Docker and Git**:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
   sudo systemctl enable --now docker
   sudo usermod -aG docker $USER
   ```
3. **Clone the Repository**:
   ```bash
   git clone https://github.com/Nawodika22/SkillNetProject.git
   cd SkillNetProject
   ```
4. **Deploy the System**:
   ```bash
   docker compose up -d --build
   ```
5. **Configure Inbound Security Group / Firewall**:
   Open inbound ports `5173` (or `80`), `8081`, `8082`, `8083`.
6. Visit `http://<YOUR_SERVER_PUBLIC_IP>:5173` in your browser!
