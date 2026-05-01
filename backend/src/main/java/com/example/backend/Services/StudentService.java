package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.Student;
import com.example.backend.Repositories.StudentRepository;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository){
        this.studentRepository = studentRepository;
    }

    // this example does not need an abstract repository function creation, because find all is built in

    public void addStudent(Student student){
        studentRepository.save(student);
    }

    public List<Student> getAllStudents(){
        return studentRepository.findAll();
    }

    public void deleteStudent(Long id){
        Optional <Student> studentOptional = studentRepository.findById(id);

        if(studentOptional.isPresent()){
            studentRepository.delete(studentOptional.get());
        }
    }

    public void updateStudent(Student studentInfo, long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));

        student.setFirstName(studentInfo.getFirstName());
        student.setLastName(studentInfo.getLastName());
        student.setGraduationDate(studentInfo.getGraduationDate());
        student.setIsComputerScienceMajor(studentInfo.getIsComputerScienceMajor());
        student.setIsComputerScienceMinor(studentInfo.getIsComputerScienceMinor());
        student.setIsMultiPlatformMajor(studentInfo.getIsMultiPlatformMajor());

        studentRepository.save(student);
    }

}
