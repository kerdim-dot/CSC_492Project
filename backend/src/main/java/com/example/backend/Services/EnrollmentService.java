package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.Enrollment;
import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.Student;
import com.example.backend.Repositories.EnrollmentRepository;
import com.example.backend.Repositories.MountClassRepository;
import com.example.backend.Repositories.StudentRepository;
import com.example.backend.dtos.EnrollmentDTO;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final MountClassRepository mountClassRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,StudentRepository studentRepository,MountClassRepository mountClassRepository){
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.mountClassRepository = mountClassRepository;
    }

    public void addEnrollment(EnrollmentDTO enrollmentDTO){
 
        Optional<Student> studentOptional = studentRepository.findById(enrollmentDTO.getStudent_id());
        Optional <MountClass> classOptional = mountClassRepository.findById(enrollmentDTO.getMountClass_id());
        if(studentOptional.isPresent() && classOptional.isPresent()){
            Student student = studentOptional.get();
            MountClass mountClass = classOptional.get();

            Enrollment enrollment = new Enrollment(mountClass,student,enrollmentDTO.getStatus());
            enrollmentRepository.save(enrollment);
        }
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
