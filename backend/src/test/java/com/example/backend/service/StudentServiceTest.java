package com.example.backend.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;


import com.example.backend.Entities.Student;
import com.example.backend.Repositories.StudentRepository;
import com.example.backend.Services.StudentService;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest{

    @Mock
    StudentRepository studentRepository;

    @InjectMocks
    StudentService studentService;
    
    @Test
    void studentTesting(){
        //Student student = new Student("bill", "john");
        // List<Student> fakeList = new ArrayList<>();
        // fakeList.add(student);
        // Mockito.when(studentRepository.findAll()).thenReturn(fakeList);
        // List<Student> result = studentService.getAllStudents();
        // System.out.println("Result size: " + result.size());
        // System.out.println("First student: " + result.get(0).getFirstName() + " " + result.get(0).getLastName());
        // Assertions.assertEquals(fakeList, result);
    }
}
