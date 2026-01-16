package com.example.foodlogapp.Controller;


import com.example.foodlogapp.utils.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Evan
 * @date 2024/10/10
 * @description 上传文件到 AWS S3
 */
@RestController
@RequestMapping("/s3")
@Slf4j
@RequiredArgsConstructor
public class CommonS3Controller {

    private final S3Service s3Service;

    /**
     * 上传单个文件到 S3
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = s3Service.uploadFile(file);
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            log.error("Error uploading file to S3", e);
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * 上传多个文件到 S3
     */
    @PostMapping("/uploads")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") List<MultipartFile> files) {
        try {
            List<String> uploadedUrls = files.stream()
                    .map(s3Service::uploadFile)
                    .collect(Collectors.toList());

            if (uploadedUrls.isEmpty() && !files.isEmpty()) {
                return ResponseEntity.internalServerError().build();
            }

            return ResponseEntity.ok(uploadedUrls);
        } catch (Exception e) {
            log.error("Error uploading multiple files", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
