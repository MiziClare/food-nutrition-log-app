package com.example.foodlogapp.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import lombok.Getter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;


/**
 * @author Lucas
 * date 2024/10/10 18:52
 * description 配置AWS S3 对应bean
 */
@Configuration
public class AwsConfiguration {
 
    @Value("${aws.accessKey}")
    private String accessKey;
 
    @Value("${aws.secretKey}")
    private String secretKey;
 
    @Getter
    @Value("${aws.s3.bucketName}")
    private String bucketName;
 
    @Value("${aws.s3.localRecord.region}")
    private String localRecordRegion;
 
    @Getter
    @Value("${aws.baseUrl}")
    private String baseUrl;
 
    @Bean
    public AmazonS3 s3Client() {
        BasicAWSCredentials basicAWSCredentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard()
                .withRegion(localRecordRegion)
                .withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials))
                .build();
    }
}