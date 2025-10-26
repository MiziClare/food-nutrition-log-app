package com.example.foodlogapp.Controller;

import com.example.foodlogapp.dto.FoodLogResponse;
import com.example.foodlogapp.entity.FoodIngredient;
import com.example.foodlogapp.entity.FoodLog;
import com.example.foodlogapp.service.FoodIngredientService;
import com.example.foodlogapp.service.FoodLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/logs")
public class LogController {

    private final FoodLogService foodLogService;
    private final FoodIngredientService foodIngredientService;

    // Get a single log by ID, including its ingredients (kcal, weight)
    @GetMapping("/{id}")
    public ResponseEntity<FoodLogResponse> getById(@PathVariable Integer id) {
        FoodLog log = foodLogService.findById(id);
        if (log == null) return ResponseEntity.notFound().build();
        List<FoodIngredient> ingredients = foodIngredientService.findByLogId(id);
        return ResponseEntity.ok(FoodLogResponse.from(log, ingredients));
    }

    // Get all logs for a user by path variable
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FoodLogResponse>> getByUser(@PathVariable Integer userId) {
        List<FoodLog> logs = foodLogService.findByUserId(userId);
        List<FoodLogResponse> list = logs.stream()
                .map(log -> FoodLogResponse.from(log, foodIngredientService.findByLogId(log.getId())))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // Alternative: Get all logs for a user via query parameter
    @GetMapping(params = "userId")
    public ResponseEntity<List<FoodLogResponse>> getByUserParam(@RequestParam Integer userId) {
        return getByUser(userId);
    }

    // Delete a log and its ingredients
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        // 1. 检查日志是否存在
        FoodLog log = foodLogService.findById(id);
        if (log == null) return ResponseEntity.notFound().build();

        // 2. 先删除关联的 ingredients
        foodIngredientService.deleteByLogId(id);

        // 3. 再删除日志本身
        foodLogService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
