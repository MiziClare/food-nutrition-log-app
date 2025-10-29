package com.example.foodlogapp.Controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.foodlogapp.config.AwsConfiguration;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * @author Evan
 * @date 2024/10/10
 * @description 上传文件到 AWS S3
 */
@RestController
@RequestMapping("/s3")
@Slf4j
public class CommonS3Controller {

    @Resource
    private AmazonS3 s3Client;

    @Resource
    private AwsConfiguration awsConfiguration;

    /**
     * 上传单个文件到 S3
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileKey = "uploads/" + UUID.randomUUID();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            s3Client.putObject(new PutObjectRequest(
                    awsConfiguration.getBucketName(),
                    fileKey,
                    file.getInputStream(),
                    metadata
            ));

            String fileUrl = awsConfiguration.getBaseUrl() + "/" + fileKey;
            log.info("File uploaded successfully: {}", fileUrl);

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
        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String fileKey = "uploads/" + UUID.randomUUID();

                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentLength(file.getSize());
                metadata.setContentType(file.getContentType());

                s3Client.putObject(new PutObjectRequest(
                        awsConfiguration.getBucketName(),
                        fileKey,
                        file.getInputStream(),
                        metadata
                ));

                uploadedUrls.add(awsConfiguration.getBaseUrl() + "/" + fileKey);
            } catch (Exception e) {
                log.error("Error uploading file: {}", file.getOriginalFilename(), e);
            }
        }

        if (uploadedUrls.isEmpty()) {
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok(uploadedUrls);
    }
}
