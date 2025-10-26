package com.example.foodlogapp.dto;

import com.example.foodlogapp.entity.FoodIngredient;
import com.example.foodlogapp.entity.FoodLog;
import com.example.foodlogapp.entity.User;
import lombok.Data;

import java.util.List;

@Data
public class FoodLogResponse {
    private Integer id;
    private Integer userId;
    private String imagePath;
    private Integer confidence;
    private User user;
    private List<FoodIngredient> ingredients;

    public static FoodLogResponse from(FoodLog log, List<FoodIngredient> ingredients) {
        if (log == null) return null;
        FoodLogResponse resp = new FoodLogResponse();
        resp.setId(log.getId());
        resp.setUserId(log.getUserId());
        resp.setImagePath(log.getImagePath());
        resp.setConfidence(log.getConfidence());
        resp.setUser(log.getUser());
        resp.setIngredients(ingredients);
        return resp;
    }
}

