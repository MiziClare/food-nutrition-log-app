package com.example.foodlogapp.service;

import com.example.foodlogapp.entity.User;
import java.util.List;

public interface UserService {
    User findById(Integer id);
    User findByEmail(String email);
    List<User> findAll();
    int create(User user);
    int update(User user);
    int delete(Integer id);
}
