package com.example.foodlogapp.Controller;

import com.example.foodlogapp.entity.FoodLog;
import com.example.foodlogapp.service.FoodLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.util.MimeType;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;

@RequiredArgsConstructor
@RestController
@RequestMapping("/ai")
public class AgentController {

    // 注入的是配置了FoodTools的serviceChatClient
    private final ChatClient serviceChatClient;

    // 1. 注入FoodLogService
    private final FoodLogService foodLogService;

    // 新增：用于确保 user 存在（仅开发/测试用途）
    private final JdbcTemplate jdbcTemplate;

    // 2. 从配置文件或常量中定义图片存储路径
    private final Path imageStoragePath = Paths.get("E:\\Code\\Food Log App\\food-images\\");

    /**
     * 接收食物图片，保存图片，创建日志条目，然后调用AI Agent进行分析和入库
     *
     * @param file     上传的图片文件
     * @param userId   进行操作的用户ID (为方便测试，设为可选，默认为1)
     * @param userNotes 用户可能附加的额外备注 (例如: "这是我的午餐")
     * @return AI工具执行后的最终JSON响应 (例如: {"status": "SUCCESS", "count": 3})
     */
    @PostMapping(value = "/agent/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json;charset=UTF-8")
    public ResponseEntity<String> analyzeFoodImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "userId", defaultValue = "1") Integer userId,
            @RequestParam(value = "notes", required = false) String userNotes
    ) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"status\": \"FAILED\", \"message\": \"File is empty.\"}");
        }

        try {
            // 确保 user 存在，避免外键约束失败
            ensureUserExists(userId);

            // --- 步骤 1 & 2: 存储图片文件 ---
            // 创建唯一文件名
            String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg";
            String fileExtension = "";
            int i = originalFilename.lastIndexOf('.');
            if (i > 0) {
                fileExtension = originalFilename.substring(i);
            }
            String uniqueFileName = UUID.randomUUID() + fileExtension;

            // 确保目录存在
            Files.createDirectories(imageStoragePath);
            Path targetLocation = imageStoragePath.resolve(uniqueFileName);

            // 保存文件
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            String imagePath = targetLocation.toAbsolutePath().toString();

            // --- 步骤 3: 创建FoodLog条目并获取logId ---
            FoodLog newLog = new FoodLog();
            newLog.setUserId(userId);
            newLog.setImagePath(imagePath);
            newLog.setConfidence(0); // 初始信心度，或根据需要移除

            // 使用 create() 方法创建记录；MyBatis 会把生成的ID回填到实体上
            int rows = foodLogService.create(newLog);
            if (rows <= 0) {
                throw new RuntimeException("Failed to create food log entry in database.");
            }
            Integer logId = newLog.getId();

            if (logId == null) {
                throw new RuntimeException("Failed to obtain generated logId after insert.");
            }

            // --- 步骤 4: 准备并调用AI Agent ---
            Resource imageResource = file.getResource();

            // 构建一个精确的提示，强制AI使用我们提供的logId
            String basePrompt = String.format(
                    "Analyze the attached food image. Detect every single ingredient, its estimated calories (kcal), " +
                            "and its estimated weight in grams. Use the 'logFoodIngredients' tool to save this data. " +
                            "You MUST use the provided logId: %d.",
                    logId
            );
            String finalPrompt = (userNotes != null && !userNotes.isBlank())
                    ? basePrompt + " Additional user notes: " + userNotes
                    : basePrompt;

            String contentType = file.getContentType();
            if (contentType == null || contentType.isBlank()) {
                contentType = "image/jpeg"; // fallback
            }
            MimeType mime = MimeType.valueOf(contentType);

            // --- 步骤 5: 执行调用并获取最终结果 ---
            // 使用 .call().content() 来等待工具执行完毕，并获取其返回的JSON字符串
            String aiResponseJson = serviceChatClient.prompt()
                    .user(u -> u
                            .text(finalPrompt)       // 包含logId的文本指令
                            .media(mime, imageResource)   // 图像
                    )
                    .call() // .call() 会触发AI思考 -> 调用工具 -> AI再思考 -> 返回最终结果
                    .content(); // 获取AI的最终响应（在这里，它应该是工具的输出）

            // 成功：返回AI工具执行的结果
            return ResponseEntity.ok(aiResponseJson);

        } catch (IOException e) {
            String errorMsg = "{\"status\": \"FAILED\", \"message\": \"Failed to save image file: " + e.getMessage() + "\"}";
            System.err.println(errorMsg);
            return ResponseEntity.internalServerError().body(errorMsg);
        } catch (Exception e) {
            String errorMsg = "{\"status\": \"FAILED\", \"message\": \"An error occurred during AI analysis: " + e.getMessage() + "\"}";
            System.err.println(errorMsg);
            return ResponseEntity.internalServerError().body(errorMsg);
        }
    }

    // 新增：开发/测试用，确保 user_id 存在；若不存在则插入一个占位用户
    private void ensureUserExists(Integer userId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId must not be null.");
        }
        Integer cnt = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM user WHERE id = ?", Integer.class, userId);
        if (cnt != null && cnt > 0) {
            return;
        }
        // 插入一个占位用户，满足外键约束（name/email/password 为占位值）
        String name = "Test User " + userId;
        String email = "user" + userId + "@example.com";
        String password = "password";
        // 显式指定 id，便于与传入的 userId 对应
        jdbcTemplate.update("INSERT INTO user(id, name, email, password) VALUES(?, ?, ?, ?)",
                userId, name, email, password);
    }
}