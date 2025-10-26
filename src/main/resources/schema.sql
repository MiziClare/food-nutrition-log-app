CREATE DATABASE IF NOT EXISTS food_log_app
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE food_log_app;
-- 1️⃣ 用户表
CREATE TABLE user (
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(100) NOT NULL,
                      email VARCHAR(255) NOT NULL UNIQUE,
                      password VARCHAR(255) NOT NULL
);

-- 2️⃣ 食物日志表：记录用户上传的每张图片
CREATE TABLE food_log (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          user_id INT NOT NULL,
                          image_path VARCHAR(255) NOT NULL,
                          confidence INT NOT NULL,
                          FOREIGN KEY (user_id) REFERENCES user(id)
);

-- 3️⃣ 食材识别结果表：每种食材一条记录
CREATE TABLE food_ingredient (
                                 id INT AUTO_INCREMENT PRIMARY KEY,
                                 log_id INT NOT NULL,
                                 ingredient_name VARCHAR(100) NOT NULL,
                                 kcal INT,
                                 weight DECIMAL(6,2),
                                 FOREIGN KEY (log_id) REFERENCES food_log(id)
);