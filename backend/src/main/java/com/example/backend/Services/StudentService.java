package com.example.backend.Services;

import org.springframework.stereotype.Service;

import com.example.backend.Repositories.StudentRepository;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository){
        this.studentRepository = studentRepository;
    }
}
