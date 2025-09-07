# School Attendance System

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

## 📖 About The Project

> This is a full-stack web application built to fulfill a technical assignment, demonstrating a modern and professional development workflow. It provides a comprehensive platform for school administrators to manage users and for teachers to efficiently mark and track student attendance.

The application features a clean, aesthetic user interface built with Tailwind CSS and includes role-based access control, detailed reporting, and several real-world bonus features that go beyond the initial requirements.



---

## ✨ Features

### ✅ Core Features
* **Secure User Authentication**: Robust login/logout system for **Admin** and **Teacher** roles.
* **Role-Based Access Control**:
    * Admins have full control over user management and reporting.
    * Teachers can mark daily attendance and view student reports.
* **Attendance Marking**: Teachers can mark each student in a selected class as 'Present' or 'Absent'. The system intelligently pre-fills already submitted attendance for the day, allowing for easy edits.
* **Individual Student Reports**: View a complete attendance history and a summary for any student.

### ✅ Bonus & Additional Features
* **Full User Management (CRUD)**: Admins can **Create, Read, Update, and Delete** both student and teacher records through a user-friendly interface with modals and confirmation dialogs.
* **Admin Dashboard Analytics**: The admin dashboard features data cards for instant insights, including total student/teacher counts and the overall attendance rate for the current day.
* **Class-Wide Reports**: A dedicated page to view a monthly attendance summary for an entire class.
* **Date Filtering**: The individual student report can be filtered by a specific date range using an intuitive date picker.
* **Searchable User Lists**: Both student and teacher lists on the admin dashboard have real-time search functionality.
* **Professional UI/UX**: The entire application has been redesigned with a modern, aesthetic, and responsive user interface.
* **SPA Refresh Support**: A "catch-all" route ensures that browser refreshes on any page of the single-page application work correctly.

---

## 🛠️ Tech Stack

* **Backend**: PHP / Laravel
* **Frontend**: JavaScript / React.js (with Vite)
* **Styling**: Tailwind CSS
* **Database**: MySQL
* **API Authentication**: Laravel Sanctum

---

## 🚀 Setup and Installation

Follow these steps to get the project running locally.

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd school-attendance-system
    ```

2.  **Install Backend Dependencies:**
    ```bash
    composer install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

4.  **Environment Setup:**
    * **Create a database**: First, create a new, empty database for the project (e.g., `school_attendance`).
    * **Copy the environment file**:
        ```bash
        cp .env.example .env
        ```
    * **Generate an application key**:
        ```bash
        php artisan key:generate
        ```
    * **Configure your database**: In the **`.env`** file, update the `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` variables to match your database credentials.

5.  **Run Database Migrations and Seeding:**
    This command creates all tables and populates the database with test users and sample data.
    ```bash
    php artisan migrate:fresh --seed
    ```

---

## 🏃 Running the Servers

You'll need two separate terminals running in the project directory.

* In **Terminal 1**, run the Laravel backend server:
    ```bash
    php artisan serve
    ```

* In **Terminal 2**, run the Vite frontend server:
    ```bash
    npm run dev
    ```

### Access the Application
Open your browser and navigate to `http://127.0.0.1:8000`.

---

## 🧪 Test Login Credentials

Use the following pre-seeded accounts to test the application:

| Role      | Email                | Password   |
| :-------- | :------------------- | :--------- |
| **Admin** | `admin@school.com`   | `password` |
| **Teacher** | `JohnDoe.teacher@school.com` | `password` |
