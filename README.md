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
