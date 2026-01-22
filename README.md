# OC DevOps Project 2: Test and Improve an Existing Application

**EtuBibliothèque Application** – Student Library Subscription Management.

---

## 📋 Prerequisites

### Back-end
- **Java**: Version 21 or higher
- **Maven**: Version 3.9+
- **Docker**

### Front-end
- **Node.js**: Version 22 (LTS recommended)

---

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Toka69/OC_DEVOPS_P2.git
   cd OC_DEVOPS_P2
   ```

2. **Initialize dependencies**:
   ```bash
   make init
   ```
   *(Installs back-end dependencies with Maven and front-end dependencies with npm.)*

3. **Start the application**:
   ```bash
   make start
   ```
    - Back-end runs on `http://localhost:8181`
    - Front-end is accessible on `http://localhost:4200`

---

## 🛠 Makefile Commands

| Command               | Description                                      |
|-----------------------|--------------------------------------------------|
| `make init`           | Install dependencies (back-end + front-end)      |
| `make start`          | Start the entire application                     |
| `make stop`           | Stop back-end and front-end services             |
| `make restart`        | Restart the application                          |
| `make logs`           | Display logs (back-end + front-end)              |
| `make backend-logs`   | Display back-end logs only                      |
| `make frontend-logs`  | Display front-end logs only                      |
| `make restart-logs`   | Restart and display logs                         |

---

## 🧪 Testing and Coverage

### Back-end (Java)
- **Run tests**:
  ```bash
  cd backend
  mvn test
  ```
- **Coverage report**:
  Open `backend/target/site/jacoco/index.html` in your browser.

### Front-end (Angular)
- **Unit/functional tests (Jest)**:
  ```bash
  cd frontend
  npm run test:coverage
  ```
  *(Report generated in `frontend/coverage/index.html`.)*

- **E2E tests (Cypress)**:
  ```bash
  npm run start:coverage
  ```
  and inside another terminal
  ```bash
  npm run cyp:coverage:html
  ```

  *(Report generated in `frontend/coverage/e2e/index.html`.)*

---

## 📂 Project Structure

```
OC_DEVOPS_P2/
├── backend/          # Java code (Spring Boot)
├── frontend/         # Angular code
├── Makefile          # Useful commands
└── README.md         # This file
```

---
**Author**: Matthias LEROUX
