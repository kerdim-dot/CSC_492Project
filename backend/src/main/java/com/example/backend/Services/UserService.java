package com.example.backend.Services;

import org.springframework.stereotype.Service;

import com.example.backend.Repositories.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }   


}
