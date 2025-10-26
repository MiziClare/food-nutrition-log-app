package com.example.foodlogapp.service.impl;

import com.example.foodlogapp.entity.FoodLog;
import com.example.foodlogapp.mapper.FoodLogMapper;
import com.example.foodlogapp.service.FoodLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodLogServiceImpl implements FoodLogService {
    @Autowired
    private FoodLogMapper foodLogMapper;

    @Override
    public FoodLog findById(Integer id) {
        return foodLogMapper.findById(id);
    }

    @Override
    public List<FoodLog> findByUserId(Integer userId) {
        return foodLogMapper.findByUserId(userId);
    }

    @Override
    public int create(FoodLog foodLog) {
        return foodLogMapper.insert(foodLog);
    }

    @Override
    public int update(FoodLog foodLog) {
        return foodLogMapper.update(foodLog);
    }

    @Override
    public int delete(Integer id) {
        return foodLogMapper.delete(id);
    }
}
