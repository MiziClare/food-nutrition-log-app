package com.example.foodlogapp.entity;

import lombok.Data;

@Data
public class FoodLog {
    private Integer id;
    private Integer userId;
    private String imagePath;
    private Integer confidence;
    private User user;
}
