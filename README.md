# Simple Airline Management System

A full-stack web application designed to manage airline operations, including flight scheduling, passenger reservations, and fleet management. The project focuses on implementing a robust relational database model and integrating modern backend and frontend frameworks within a containerized environment.

## Techstack

* **Backend:** Java, Spring Boot, Gradle
* **Frontend:** React, JavaScript, NPM
* **Database:** MySQL (Relational Model Design)
* **Infrastructure:** Docker, Docker Compose

## Features

* Relational database schema design for handling complex airline data (flights, aircrafts, passengers, bookings).
* RESTful API for communication between the React frontend and Spring Boot backend.
* Modular architecture following industry-standard patterns.
* Containerization of all services for consistent deployment and scaling.

## Database Design

The core of this project was the design of a relational database. The schema ensures data integrity and supports complex queries required for flight management systems. It includes entities such as:
* Flight schedules and status tracking.
* Aircraft fleet management with technical specifications.
* Reservation system linking passengers to specific flights and seats.

## Getting Started

### Prerequisites
* Docker and Docker Compose
* Java 17+ (for manual backend builds)
* Node.js (for manual frontend builds)

### Running with Docker 
To launch the entire system (Backend, Frontend, Database) using Docker Compose, run:
```bash
docker-compose up --build
```
Manual Execution

Backend:
From the backend directory, use Gradle:
```bash
./gradlew bootRun
```
Frontend:
From the frontend directory, use NPM:
```bash
npm install
npm start
```
