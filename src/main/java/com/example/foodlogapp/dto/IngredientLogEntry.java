package com.example.foodlogapp.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO (Data Transfer Object) for AI to structure its response.
 * Spring AI will use Jackson to map the AI's JSON 'args' to a List of this object.
 */
@Data
public class IngredientLogEntry {

    // Corresponds to the 'ingredient' in the AI's tool call args
    private String ingredient;

    // Corresponds to the 'kcal'
    private Integer kcal;

    // Corresponds to the 'weight' (e.g., in grams)
    // We use BigDecimal to match the DECIMAL(6,2) SQL type
    private BigDecimal weight;
}
