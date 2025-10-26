```markdown
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
  "confidence": 0.92
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

#### 4) 新建用户
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

---

## 补充说明
- 日志删除返回 `204` 且响应体为空，是 REST 推荐行为，属于正常结果。
- 数据库中 `food_ingredient.log_id` 有外键关联 `food_log.id`；代码层已做先删食材再删日志的事务性处理，确保不会违反外键约束。

---
```