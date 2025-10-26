package com.example.foodlogapp.service.impl;

import com.example.foodlogapp.entity.FoodIngredient;
import com.example.foodlogapp.mapper.FoodIngredientMapper;
import com.example.foodlogapp.service.FoodIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FoodIngredientServiceImpl implements FoodIngredientService {
    private final FoodIngredientMapper foodIngredientMapper;

    @Autowired
    public FoodIngredientServiceImpl(FoodIngredientMapper foodIngredientMapper) {
        this.foodIngredientMapper = foodIngredientMapper;
    }

    @Override
    public FoodIngredient findById(Integer id) {
        return foodIngredientMapper.findById(id);
    }

    @Override
    public List<FoodIngredient> findByLogId(Integer logId) {
        return foodIngredientMapper.findByLogId(logId);
    }

    @Override
    public int create(FoodIngredient foodIngredient) {
        return foodIngredientMapper.insert(foodIngredient);
    }

    @Override
    public int update(FoodIngredient foodIngredient) {
        return foodIngredientMapper.update(foodIngredient);
    }

    @Override
    public int delete(Integer id) {
        return foodIngredientMapper.delete(id);
    }

    @Override
    public int deleteByLogId(Integer logId) {
        return foodIngredientMapper.deleteByLogId(logId);
    }
}
