package com.example.backend.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.Student;
import com.example.backend.Repositories.StudentRepository;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository){
        this.studentRepository = studentRepository;
    }

    // this example does not need an abstract repository function creation, because find all is built in
    public List<Student> getAllStudents(){
        return studentRepository.findAll();
    }
}
