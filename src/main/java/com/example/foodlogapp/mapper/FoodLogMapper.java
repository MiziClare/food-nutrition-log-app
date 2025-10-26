package com.example.foodlogapp.mapper;

import com.example.foodlogapp.entity.FoodLog;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FoodLogMapper {
    @Select("SELECT * FROM food_log WHERE id = #{id}")
    @Results({
        @Result(property = "userId", column = "user_id"),
        @Result(property = "imagePath", column = "image_path"),
        @Result(property = "user", column = "user_id",
            one = @One(select = "com.example.foodlogapp.mapper.UserMapper.findById"))
    })
    FoodLog findById(Integer id);

    @Select("SELECT * FROM food_log WHERE user_id = #{userId}")
    @Results({
        @Result(property = "userId", column = "user_id"),
        @Result(property = "imagePath", column = "image_path"),
        @Result(property = "user", column = "user_id",
            one = @One(select = "com.example.foodlogapp.mapper.UserMapper.findById"))
    })
    List<FoodLog> findByUserId(Integer userId);

    @Insert("INSERT INTO food_log(user_id, image_path, confidence) VALUES(#{userId}, #{imagePath}, #{confidence})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(FoodLog foodLog);

    @Update("UPDATE food_log SET user_id = #{userId}, image_path = #{imagePath}, confidence = #{confidence} WHERE id = #{id}")
    int update(FoodLog foodLog);

    @Delete("DELETE FROM food_log WHERE id = #{id}")
    int delete(Integer id);
}
