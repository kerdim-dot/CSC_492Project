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

    public void updateStudent(Student studentInfo,long student_id){
        Optional <Student> studentOptional = studentRepository.findById(student_id);
        if(studentOptional.isPresent()){
            Student student = studentOptional.get();

            if(studentInfo.getIsMajor() != student.getIsMajor()){
                student.setIsMajor(studentInfo.getIsMajor());
            }

            if(studentInfo.getGraduationDate() != studentInfo.getGraduationDate()){
                student.setGraduationDate(studentInfo.getGraduationDate());
            }

            if(studentInfo.getFirstName().equals(studentInfo.getFirstName())){
                student.setFirstName(studentInfo.getFirstName());
            }
            if(studentInfo.getLastName().equals(studentInfo.getFirstName())){
                student.setLastName(studentInfo.getLastName());
            }     
            studentRepository.save(student);
        }
    }

}
