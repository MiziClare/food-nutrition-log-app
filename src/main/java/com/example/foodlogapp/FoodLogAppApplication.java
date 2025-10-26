package com.example.foodlogapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.example.foodlogapp.config.StorageProperties;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class FoodLogAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodLogAppApplication.class, args);
    }

}
