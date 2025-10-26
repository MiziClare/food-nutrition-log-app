package com.example.foodlogapp.entity;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
public class User {
    private Integer id;
    private String name;
    private String email;
    @JsonIgnore
    private String password;
}
