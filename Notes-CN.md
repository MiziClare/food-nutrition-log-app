# 接口文档

Base URL: `http://localhost:8080`  
认证: 无  
CORS: 允许任意来源

常见状态码
- `200 OK`：请求成功（有返回体）
- `201 Created`：新建成功（响应含 `Location`）
- `204 No Content`：删除成功（空响应体）
- `400 Bad Request`：参数/请求体非法
- `404 Not Found`：资源不存在
- `413 Payload Too Large`：上传文件过大
- `500 Internal Server Error`：服务器异常（全局异常处理返回 `{"status":"FAILED","message":"..."}`）

---

## 一、AI / Agent

### 1. 上传图片并让 Agent 识别、入库
- URL: `POST /ai/agent/upload`
- Content-Type: `multipart/form-data`
- 表单字段:
  - `file`：必填，图片文件
  - `userId`：选填，默认 `1`
  - `notes`：选填，备注文本
- 成功响应 `200 application/json`:
```json
{
  "status": "SUCCESS",
  "logId": 123,
  "count": 3,
  "confidence": 92
}
```
说明：
- `count` 为识别并写入的食材条数
- `confidence` 可能为空

- 失败响应示例：
    - `400`：文件为空
    - `413`：文件过大
    - `500`：`{"status":"FAILED","message":"..."}`

- 备注：
    - 需要配置 `OPENAI_API_KEY`
    - 数据库已就绪
    - 图片存储目录须可写

---

### 2. 简单对话（测试 openai api key 目前是否可用）
- URL: `GET /ai/chat?prompt=...&chatId=...`
- Produces: `text/html`（流式）
- 用途：用于简单验证 OpenAI Key 是否可用

---

## 二、Food Logs（食物日志）

### 数据模型简述
FoodLogResponse:
- `id`: number
- `userId`: number
- `imagePath`: string
- `confidence`: number
- `user`: User
- `ingredients`: FoodIngredient[]

User:
- `id`, `name`, `email`, `password`

FoodIngredient:
- `id`, `logId`, `ingredientName`, `kcal`, `weight` (decimal(6, 2))

---

### 接口

#### 1) 按日志 ID 获取日志（含所有 ingredients 及其对应信息）
- URL: `GET /logs/{id}`
- 成功响应 `200`：返回 `FoodLogResponse`
- 错误响应 `404`：日志不存在

#### 2) 按用户 ID 获取该用户的所有日志（含每条日志的所有 ingredients 及其对应信息）
- URL（两种可用）:
    - `GET /logs/user/{userId}`
    - `GET /logs?userId={userId}`
- 成功响应 `200`：返回 `FoodLogResponse[]`

#### 3) 删除单条日志（会先删关联的食材，再删日志）
- URL: `DELETE /logs/{id}`
- 成功响应 `204 No Content`（空响应体）
- 错误响应 `404`：日志不存在

备注：
- 已实现应用层“级联删除”：先删该 `logId` 的所有 `ingredients`，再删日志；整体在事务中执行，避免外键约束问题。

---

## 三、Users（用户）

### 接口

#### 1) 获取用户（按 ID）
- URL: `GET /users/{id}`
- 成功响应 `200`：返回 `User`
- 错误响应 `404`

#### 2) 获取用户（按 email）
- URL: `GET /users?email=xxx`
- 成功响应 `200`：返回 `User`
- 错误响应 `404`

#### 3) 获取所有用户
- URL: `GET /users`
- 当未传 `email` 时返回全部 `User[]`
- 成功响应 `200`

#### 4) 新建用户（管理用途）
- URL: `POST /users`
- Content-Type: `application/json`
- 请求体示例:
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "yourpassword"
}
```
- 成功响应 `201 Created`：返回创建后的 `User`，并带 `Location: /users/{id}`
- 失败响应 `400`：插入失败 / 数据无效

#### 5) 更新用户
- URL: `PUT /users/{id}`
- Content-Type: `application/json`
- 请求体示例:
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "newpassword"
}
```
- 成功响应 `200`：返回更新后的 `User`
- 错误响应 `404`：用户不存在
- 错误响应 `400`：更新失败

#### 6) 删除用户
- URL: `DELETE /users/{id}`
- 成功响应 `204 No Content`
- 错误响应 `404`：用户不存在

#### 7) 注册用户（公开）
- URL: `POST /users/register`
- Content-Type: `application/json`
- 请求体示例:
```json
{
  "name": "李四",
  "email": "lisi@example.com",
  "password": "secret"
}
```
- 成功响应 `201 Created`：返回新注册用户（返回体不包含 `password`），并带 `Location: /users/{id}`
- 错误响应：
  - `400`：`email`/`password` 缺失，或 `email` 已存在，或注册失败

#### 8) 登录（公开）
- URL: `POST /users/login`
- Content-Type: `application/json`
- 请求体示例:
```json
{
  "email": "lisi@example.com",
  "password": "secret"
}
```
- 成功响应 `200`：返回用户信息（返回体不包含 `password`）
- 错误响应：
  - `400`：`email`/`password` 缺失
  - `404`：用户不存在
  - `401`：凭证错误

> 说明：当前为演示用“简单登录”，未发放 Token/Session、未做密码加密；如需生产安全方案，建议：
> - 使用 BCrypt 对密码加密存储与校验
> - 登录签发 JWT/Session 并由前端存储
> - 在 `User.password` 上使用 `@JsonIgnore` 全局隐藏密码字段

---

## 补充说明
- 日志删除返回 `204` 且响应体为空，是 REST 推荐行为，属于正常结果。
- 数据库中 `food_ingredient.log_id` 有外键关联 `food_log.id`；代码层已做先删食材再删日志的事务性处理，确保不会违反外键约束。
- 数据库建库代码
```
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
```
---
## 此项目有课程需要的唯一的傻瓜接口:
`/ai/agent/upload`

输入图片，得到识别结果和可信分数，自动存入数据库（图片以链接方式存储）。

比如，上传某张食物图片（假设是第五次日志操作）

① FoodLog 表会新增一次日志；agent 还会为其生成这次分析的 confidence score。

② FoodIngredient 表，agent 会为其新增如下数据：

| id | log_id | ingredient_name | kcal | weight |
|---:|-------:|:----------------|-----:|-------:|
| 11 | 5 | chicken | 165 | 150.00 |
| 12 | 5 | soy sauce | 53 | 15.00 |
| 13 | 5 | garlic | 149 | 5.00 |
| 14 | 5 | ginger | 80 | 5.00 |
| 15 | 5 | green chili | 40 | 5.00 |
| 16 | 5 | vegetable oil | 884 | 10.00 |
| 17 | 5 | fresh herbs | 30 | 5.00 |
| 18 | 5 | rice | 130 | 100.00 |

### 🧱 快速看懂接口：
在根目录的/test目录下有一个 food.http 文件，里面有主接口的测试代码，可以运行这个测试再查看数据库来了解主接口的使用方法。

### 接口文档


#### `POST /ai/agent/upload` 分析食物图片并记录

此接口用于上传一张食物图片。服务器将保存图片，创建一条食物日志（food log）记录，然后触发一个多模态AI Agent来分析图片中的食材。Agent会（通过工具）将识别出的每种食材及其估算的卡路里（kcal）和重量（g）存入数据库，并更新该日志的AI分析置信度。

**请求 (Request)**

* **Content-Type:** `multipart/form-data`

* **Form-Data 参数:**

| 参数 | 类型 | 必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `file` | File | **是** | 要分析的食物图片文件 (例如: `my_lunch.jpg`)。 |
| `userId` | Integer | 否 | 提交日志的用户ID。 (默认值: `1`) |
| `notes` | String | 否 | 用户附加的额外备注 (例如: "这是我的早餐")。 |

**成功响应 (Success Response)**

* **Code:** `200 OK`
* **Content-Type:** `application/json;charset=UTF-8`
* **Body:**
  返回一个JSON对象，确认日志已创建，并包含AI分析的结果统计（**注意：** 此JSON来自数据库的最终确认，而非AI的直接回复）。

* **示例 (Example):**

    ```json
    {
      "status": "SUCCESS",
      "logId": 105,
      "count": 4,
      "confidence": 85
    }
    ```

* **字段说明:**
    * `status`: "SUCCESS" 表示操作成功。
    * `logId`: 本次上传在 `food_log` 表中生成的唯一ID。
    * `count`: AI成功识别并存入 `food_ingredient` 表的食材总数。
    * `confidence`: AI对本次分析的置信度评分 (0-100)，已更新到 `food_log` 表。

**失败响应 (Error Response)**

* **Code:** `400 Bad Request` 或 `500 Internal Server Error`
* **Content-Type:** `application/json;charset=UTF-8`
* **Body:**
  返回一个JSON对象，说明失败原因。

* **示例 (Example - 未上传文件):**

    ```json
    {
      "status": "FAILED",
      "message": "File is empty."
    }
    ```

* **示例 (Example - AI或服务器内部错误):**
    ```json
    {
      "status": "FAILED",
      "message": "An error occurred during AI analysis: [error details]"
    }
    ```


---

## 运行前准备
### ⭐ 首先必须修改图片存放路径
在.yaml文件内把

app:
storage:
image-dir: ''
引号内改为自己电脑上想存放图片的路径即可，

比如 image-dir: 'E:\\Code\\Food Log App\\food-images'.
注意路径中的反斜杠需要用双反斜杠表示，或者使用正斜杠。

### ⭐ 数据库创建
创建三个数据库表，并在yml文件内配置自己的好数据库连接信息。

```text
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
```


### 项目核心代码在：
controller/AgentController.java
tools/FoodTools.java

### Prompt 目前效果良好，若要修改请查看：
System prompt: 位于 constants/SystemConstants.java

User prompt: 位于 controller/AgentController.java
