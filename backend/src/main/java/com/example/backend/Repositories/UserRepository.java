package com.example.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Entities.User;

public interface UserRepository extends JpaRepository<User, Long>{

    
} 