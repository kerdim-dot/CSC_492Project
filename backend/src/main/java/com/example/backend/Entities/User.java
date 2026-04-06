package com.example.backend.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;
    private String first_name;
    private String last_name;
    private String role;
    private String username;
    private String password;
    

    public User(String first_name, String last_name, String role,String username, String password){
        this.first_name = first_name;
        this.last_name = last_name;
        this.role = role;
        this.username = username;
        this.password = password;
    }
}
