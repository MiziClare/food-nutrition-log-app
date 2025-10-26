package com.example.foodlogapp.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {

    /**
     * Directory for storing uploaded images. Example: E:/Code/Food Log App/food-images
     */
    private String imageDir = "images"; // default fallback

    public String getImageDir() {
        return imageDir;
    }

    public void setImageDir(String imageDir) {
        this.imageDir = imageDir;
    }
}

