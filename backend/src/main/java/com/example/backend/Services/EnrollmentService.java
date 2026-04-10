package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.Enrollment;
import com.example.backend.Entities.Student;
import com.example.backend.Repositories.EnrollmentRepository;
import com.example.backend.dtos.EnrollmentDTO;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository){
        this.enrollmentRepository = enrollmentRepository;
    }

    public void addEnrollment(Enrollment enrollment){
        enrollmentRepository.save(enrollment);
    }

    public List<EnrollmentDTO> getAllEnrollments(){
        return enrollmentRepository.findAllEnrollmentDTOs();
    }

    public void deleteEnrollment(Long id){
        Optional <Enrollment> enrollmentOptional = enrollmentRepository.findById(id);
        if(enrollmentOptional.isPresent()){
            enrollmentRepository.delete(enrollmentOptional.get());
        }
    }

    public List <EnrollmentDTO> findAllEnrollmentsByClassId(Long classId){
        return enrollmentRepository.findEnrollmentPerClassDTOs(classId);
    }

    public List<EnrollmentDTO> findAllEnrollmentsByStudentId(Long studentId){
        return enrollmentRepository.findEnrollmentPerStudentDTOs(studentId);
    }

    public void deleteAllEnrollmentsByStudentId(Long studentId){
        enrollmentRepository.deleteByStudentId(studentId);
    }

    public void deleteAllEnrollmentsByClassId(Long classId){
        enrollmentRepository.deleteByClassId(classId);
    }
    
}
