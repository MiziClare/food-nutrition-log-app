# Food Log App

A full-stack web application built with **Spring Boot**, **MySQL**, **FastAPI**, and **React**.  
This project allows users to log food images, and record nutritional data.

Programming Languages:

- Java 17
- Python 3.12
- TypeScript

Framework:

- Spring Boot
- FastAPI
- React

Tools:

- Maven
- NPM
- MySQL server
- Anaconda
- AWS S3
- AWS RDS

---

## Steps to download, compile, and run

1. Clone the repository (replace with the project URL):
   - git clone https://github.com/MiziClare/food-nutrition-log-app.git
   - cd <repo-directory>

2. Prepare the database and AWS S3
   - Start MySQL server
   - Run the SQL from the "Database" section above to create the database and tables
   - Edit the backend `application.yml` to set DB username/password and (if needed) the JDBC URL

3. Run the backend
   Using Maven:
    - mvn clean package
    - mvn spring-boot:run
    - The backend default port is `8080`

4. Run the frontend
   - cd portal
   - npm install
   - npm start
   - The backend default port is `3000`

The trained modal can be viewed in the YOLOv11 directory in the root path. 
How to run the service:
   - cd yolov11
   - pip install -r requirements.txt
   - python app.py
   - test:
     Use the swagger
     1. Open your browser and go to http://localhost:8000/docs
     2. Find the `/ai/agent/upload` endpoint
     3. Click "Try it out"
     4. Upload an image and fill in the parameters
     5. Click "Execute"

---

## Database

Create the database and tables before running the app. Example SQL (run in your MySQL client):

```sql
CREATE DATABASE IF NOT EXISTS food_log_app DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE food_log_app;

-- User table
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Food log table: each uploaded image creates a record
CREATE TABLE food_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  confidence INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Food ingredient table: each ingredient detected in an image creates a record
CREATE TABLE food_ingredient (
  id INT AUTO_INCREMENT PRIMARY KEY,
  log_id INT NOT NULL,
  ingredient_name VARCHAR(100) NOT NULL,
  kcal INT,
  weight DECIMAL(6,2),
  FOREIGN KEY (log_id) REFERENCES food_log(id)
);
```

Open the backend YML configuration file and set the MySQL connection properties:

```text
datasource:
  url: jdbc:mysql://localhost:[PORT]/[TABLE_NAME]?useSSL=false&serverTimezone=UTC&characterEncoding=utf8&allowPublicKeyRetrieval=true
  username: ...
  password: ...

aws:
  accessKey: ...
  secretKey: ...
  baseUrl: ...
  s3:
    bucketName: ...
    localRecord:
      region: ...
```
