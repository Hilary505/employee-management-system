# Employee Management System

A full-stack Employee Management System built with **Spring Boot** (backend) and **HTML/CSS/JavaScript** (frontend). The frontend is served directly by Spring Boot — no separate server needed.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Java 17, Spring Boot 3.2.5        |
| Database   | H2 (in-memory)                    |
| ORM        | Spring Data JPA / Hibernate       |
| Validation | Spring Boot Validation (Jakarta)  |
| Frontend   | HTML, CSS, Vanilla JavaScript     |

---

## Prerequisites

Make sure you have the following installed before running the project:

- **Java 17+** — [Download](https://adoptium.net/)
- **Maven 3.6+** — [Download](https://maven.apache.org/download.cgi)

Verify your installations:

```bash
java -version
mvn -version
```

---

## Project Structure

```
employee-management-system/
├── src/
│   ├── main/
│   │   ├── java/com/company/
│   │   │   ├── controller/        # REST API endpoints
│   │   │   ├── service/           # Business logic (interface + impl)
│   │   │   ├── repository/        # JPA data access
│   │   │   ├── model/             # Employee entity
│   │   │   └── exception/         # Error handling
│   │   └── resources/
│   │       ├── static/            # Frontend files (served by Spring Boot)
│   │       │   ├── index.html
│   │       │   ├── styles.css
│   │       │   └── app.js
│   │       └── application.properties
├── frontend/                      # Frontend source files
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── pom.xml
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Hilary505/employee-management-system.git
cd employee-management-system
```

### 2. Run the Application

```bash
mvn spring-boot:run
```

> On first run, Maven will download all dependencies automatically. This may take a minute.

### 3. Access the Application

Once you see this in the terminal:

Open your browser and go to:

| URL | Description |
|-----|-------------|
| `http://localhost:8080` | Employee Management UI |
| `http://localhost:8080/api/employees` | REST API |
| `http://localhost:8080/h2-console` | H2 Database Console |

---

## Using the Application

### Add an Employee
1. Fill in the form fields: First Name, Last Name, Email, Department, Salary
2. Click **Add Employee**
3. The employee appears in the table below immediately

### Edit an Employee
1. Click the **Edit** button on any table row
2. The form fills with the employee's current data
3. Make your changes and click **Update Employee**
4. Click **Cancel** to discard changes

### Delete an Employee
1. Click the **Delete** button on any table row
2. Confirm the deletion in the popup dialog
3. The row is removed from the table instantly — no page refresh

## H2 Database Console

The H2 in-memory database console is available during development at:

```
http://localhost:8080/h2-console
```

Use these credentials to connect:

| Field    | Value                  |
|----------|------------------------|
| JDBC URL | `jdbc:h2:mem:employeedb` |
| Username | `sa`                   |
| Password | *(leave blank)*        |

## Stopping the Application

Press `Ctrl + C` in the terminal where the app is running.

---