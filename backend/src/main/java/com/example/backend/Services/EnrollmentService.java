package com.example.backend.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.Enrollment;
import com.example.backend.Entities.Student;
import com.example.backend.Repositories.EnrollmentRepository;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository){
        this.enrollmentRepository = enrollmentRepository;
    }

    public void addEnrollment(Enrollment enrollment){
        enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getAllEnrollments(){
        return enrollmentRepository.findAll();
    }
}
