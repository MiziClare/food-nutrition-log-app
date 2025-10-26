package com.example.foodlogapp.service;

import com.example.foodlogapp.entity.FoodLog;
import java.util.List;

public interface FoodLogService {
    FoodLog findById(Integer id);
    List<FoodLog> findByUserId(Integer userId);
    int create(FoodLog foodLog);
    int update(FoodLog foodLog);
    int delete(Integer id);
}
