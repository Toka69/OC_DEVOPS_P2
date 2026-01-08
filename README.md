# EtuBibliothèque - Student Library Subscriber Management

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![JUnit5](https://img.shields.io/badge/JUnit5-25A162?style=for-the-badge&logo=junit5&logoColor=white)
![Mockito](https://img.shields.io/badge/Mockito-4EA94B?style=for-the-badge)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)

**Project 2 - DevOps Expert Path - OpenClassrooms**

---

## 📌 Project Description
EtuBibliothèque is a full-stack (Java/Angular) application designed to manage student subscribers in a library. This project focuses on **improving the existing application** by:
- Fixing the authentication API on the back-end.
- Implementing the authentication interface on the front-end.
- Adding **unit, integration, and end-to-end tests** to ensure code quality and maintainability.

---

## 🛠 Prerequisites
- **Back-end**:
    - Java 21+
    - Maven 3.9
    - Database (e.g., MySQL, PostgreSQL)
- **Front-end**:
    - Node.js 22
    - Angular 19
- **Testing Tools**:
    - JUnit 5, Mockito (back-end)
    - Jest, Cypress (front-end)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/etu-bibliotheque.git
cd etu-bibliotheque
```

### 2. Set Up the Back-end
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Configure the database in `src/main/resources/application.properties`.
3. Install dependencies and start the server:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### 3. Set Up the Front-end
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular application:
   ```bash
   ng serve
   ```

---

## 🧪 Testing

### Back-end (Java)
- **Unit tests**: `mvn test`
- **Coverage reports**: `mvn jacoco:report`
  (Minimum threshold: **80%**)

### Front-end (Angular)
- **Unit tests**: `ng test`
- **End-to-end tests (Cypress)**: `ng e2e`
- **Coverage reports**: `ng test --code-coverage`

---

## 📂 Project Structure
```
etu-bibliotheque/
├── backend/          # Java code (Spring Boot)
│   ├── src/
│   │   ├── main/      # Source code
│   │   └── test/      # Unit and integration tests
│   └── pom.xml        # Maven dependencies
│
├── frontend/         # Angular code
│   ├── src/
│   │   ├── app/       # Components and services
│   │   └── assets/    # Static resources
│   ├── cypress/       # E2E tests
│   └── package.json   # npm dependencies
│
├── documentation/    # Specifications and reports
└── README.md          # This file
```

---

## 🎯 Added Features
- **Authentication**:
    - Fixed `/api/auth` API (back-end).
    - Implemented login interface (front-end).
- **Tests**:
    - 80%+ coverage for both back-end and front-end.
    - E2E tests for critical user journeys.

---

## 📊 Reports
- [Back-end coverage report](backend/target/site/jacoco/index.html)
- [Front-end coverage report](frontend/coverage/index.html)
- [Cypress test report](frontend/cypress/reports/)

---

## 🤝 Contribution
1. Fork the project.
2. Create a branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m "Add my feature"`).
4. Push the branch (`git push origin feature/my-feature`).
5. Open a Pull Request.

---

## 📄 License
This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## 📬 Contact
Matthias LEROUX - [contact@matthias-leroux.fr](mailto:matthias.leroux@example.com)
Project completed as part of the **DevOps Expert Path** - OpenClassrooms.