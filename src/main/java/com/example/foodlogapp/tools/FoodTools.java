package com.example.foodlogapp.tools;

import com.example.foodlogapp.dto.IngredientLogEntry;
import com.example.foodlogapp.entity.FoodIngredient;
import com.example.foodlogapp.entity.FoodLog;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import com.example.foodlogapp.service.FoodIngredientService;
import com.example.foodlogapp.service.FoodLogService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FoodTools {

private final FoodIngredientService foodIngredientService;
private final FoodLogService foodLogService;

    /**
     * AI Tool definition for logging ingredients.
     * The descriptions guide the AI on what data to provide.
     */
    @Tool(description = "Logs all detected food ingredients, including their estimated calories (kcal) and weight, from a food image to the database.")
    public String logFoodIngredients(

            @ToolParam(description = "The unique identifier (ID) of the food log entry, used to associate all ingredients with the correct image.")
            Integer logId,

            @ToolParam(description = "A comprehensive list of all visually detected ingredients. Each ingredient must include its name, estimated calories (kcal), and estimated weight (e.g., in grams).")
            List<IngredientLogEntry> ingredients
    ) {

        if (logId == null) {
            System.err.println("AI attempted to log ingredients but provided a null logId.");
            return "{\"status\": \"FAILED\", \"message\": \"logId is required.\"}";
        }

        if (ingredients == null || ingredients.isEmpty()) {
            System.err.println("AI attempted to log ingredients for logId " + logId + " but provided an empty list.");
            return "{\"status\": \"FAILED\", \"message\": \"No ingredients provided.\"}";
        }

        System.out.println("AI Tool Call: logFoodIngredients received for logId: " + logId);
        System.out.println("Total ingredients to log: " + ingredients.size());

        try {
            // 1. Map DTOs (from AI) to Database Entities
            // (Assuming your entity is 'FoodIngredient' and DTO is 'IngredientLogEntry')
            List<FoodIngredient> entitiesToSave = ingredients.stream()
                    .map(dto -> {
                        FoodIngredient entity = new FoodIngredient();
                        entity.setLogId(logId); // Set the Foreign Key from the tool parameter
                        entity.setIngredientName(dto.getIngredient());
                        entity.setKcal(dto.getKcal());
                        entity.setWeight(dto.getWeight()); // Matches the DECIMAL(6,2) field
                        return entity;
                    })
                    .toList();

            // 2. Perform inserts one-by-one using the existing service API
            int successCount = 0;
            for (FoodIngredient entity : entitiesToSave) {
                int rows = foodIngredientService.create(entity);
                if (rows > 0) {
                    successCount++;
                }
            }

            String successMessage = "Successfully logged " + successCount + " ingredients for logId " + logId + ".";
            System.out.println(successMessage);

            // 3. Return a success message (JSON string) to the AI
            return "{\"status\": \"SUCCESS\", \"count\": " + successCount + ", \"logId\": " + logId + "}";

        } catch (Exception e) {
            String errorMessage = "Failed to log ingredients for logId " + logId + ". Error: " + e.getMessage();
            System.err.println(errorMessage);

            // Return an error message to the AI
            return "{\"status\": \"FAILED\", \"message\": \"" + errorMessage + "\"}";
        }
    }

    /**
     * AI Tool definition for setting the analysis confidence score (0-100) for a given food log.
     */
    @Tool(description = "Sets the analysis confidence score (0-100) for a specific food log entry. Always pass the exact logId provided by the user.")
    public String setAnalysisConfidence(
            @ToolParam(description = "The unique identifier (ID) of the food log entry to update.") Integer logId,
            @ToolParam(description = "An integer confidence score from 0 to 100 representing how confident you are in your analysis.") Integer confidence
    ) {
        if (logId == null) {
            return "{\"status\": \"FAILED\", \"message\": \"logId is required.\"}";
        }
        if (confidence == null) {
            return "{\"status\": \"FAILED\", \"message\": \"confidence is required.\"}";
        }
        if (confidence < 0 || confidence > 100) {
            return "{\"status\": \"FAILED\", \"message\": \"confidence must be between 0 and 100.\"}";
        }

        try {
            FoodLog log = foodLogService.findById(logId);
            if (log == null) {
                return "{\"status\": \"FAILED\", \"message\": \"FoodLog not found for id: " + logId + "\"}";
            }
            log.setConfidence(confidence);
            int rows = foodLogService.update(log);
            if (rows <= 0) {
                return "{\"status\": \"FAILED\", \"message\": \"Update failed for logId: " + logId + "\"}";
            }
            return "{\"status\": \"SUCCESS\", \"logId\": " + logId + ", \"confidence\": " + confidence + "}";
        } catch (Exception e) {
            String errorMessage = "Failed to set confidence for logId " + logId + ": " + e.getMessage();
            System.err.println(errorMessage);
            return "{\"status\": \"FAILED\", \"message\": \"" + errorMessage + "\"}";
        }
    }

}
