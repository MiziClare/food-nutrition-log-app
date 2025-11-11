package com.example.foodlogapp.entity;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class User {
    private Integer id;
    private String name;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
}
