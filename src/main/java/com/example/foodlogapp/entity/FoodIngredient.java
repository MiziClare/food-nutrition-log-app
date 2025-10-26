package com.example.foodlogapp.entity;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FoodIngredient {
    private Integer id;
    private Integer logId;
    private String ingredientName;
    private Integer kcal;
    private BigDecimal weight;
}
