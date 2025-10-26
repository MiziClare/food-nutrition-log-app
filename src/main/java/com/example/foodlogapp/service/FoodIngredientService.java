package com.example.foodlogapp.service;

import com.example.foodlogapp.entity.FoodIngredient;
import java.util.List;

public interface FoodIngredientService {
    FoodIngredient findById(Integer id);
    List<FoodIngredient> findByLogId(Integer logId);
    int create(FoodIngredient foodIngredient);
    int update(FoodIngredient foodIngredient);
    int delete(Integer id);
    int deleteByLogId(Integer logId);
}
