package com.example.foodlogapp.utils;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.foodlogapp.config.AwsConfiguration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 s3Client;
    private final AwsConfiguration awsConfiguration;

    /**
     * 上传单个文件到 S3 并返回文件访问 URL
     */
    public String uploadFile(MultipartFile file) {
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
            )); // <-- 移除 .withCannedAcl(...)

            String fileUrl = awsConfiguration.getBaseUrl() + "/" + fileKey;
            log.info("File uploaded successfully: {}", fileUrl);

            return fileUrl;

        } catch (Exception e) {
            log.error("Error uploading file to S3", e);
            throw new RuntimeException("Failed to upload file", e);
        }
    }
}
