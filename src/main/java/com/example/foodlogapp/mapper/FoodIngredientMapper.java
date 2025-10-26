package com.example.foodlogapp.mapper;

import com.example.foodlogapp.entity.FoodIngredient;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FoodIngredientMapper {
    @Select("SELECT id, log_id, ingredient_name, kcal, weight FROM food_ingredient WHERE id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "logId", column = "log_id"),
        @Result(property = "ingredientName", column = "ingredient_name"),
        @Result(property = "kcal", column = "kcal"),
        @Result(property = "weight", column = "weight")
    })
    FoodIngredient findById(@Param("id") Integer id);

    @Select("SELECT id, log_id, ingredient_name, kcal, weight FROM food_ingredient WHERE log_id = #{logId}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "logId", column = "log_id"),
        @Result(property = "ingredientName", column = "ingredient_name"),
        @Result(property = "kcal", column = "kcal"),
        @Result(property = "weight", column = "weight")
    })
    List<FoodIngredient> findByLogId(@Param("logId") Integer logId);

    @Insert("INSERT INTO food_ingredient(log_id, ingredient_name, kcal, weight) VALUES(#{logId}, #{ingredientName}, #{kcal}, #{weight})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(FoodIngredient foodIngredient);

    @Update("UPDATE food_ingredient SET log_id = #{logId}, ingredient_name = #{ingredientName}, kcal = #{kcal}, weight = #{weight} WHERE id = #{id}")
    int update(FoodIngredient foodIngredient);

    @Delete("DELETE FROM food_ingredient WHERE id = #{id}")
    int delete(@Param("id") Integer id);

    @Delete("DELETE FROM food_ingredient WHERE log_id = #{logId}")
    int deleteByLogId(@Param("logId") Integer logId);
}
