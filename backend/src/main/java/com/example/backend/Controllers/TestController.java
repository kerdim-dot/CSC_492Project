package com.example.backend.Controllers;

import com.example.backend.Repositories.EnrollmentRepository;
import com.example.backend.Services.EnrollmentService;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Entities.Enrollment;
import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.Student;
import com.example.backend.Repositories.MountClassRepository;
import com.example.backend.Repositories.StudentRepository;
import com.example.backend.Services.MountClassService;
import com.example.backend.Services.StudentService;
import com.example.backend.Services.UserService;
import com.example.backend.dtos.enrollmentDTO;

@RestController
@RequestMapping("/test")
public class TestController {

    private final EnrollmentService enrollmentService;
    private final EnrollmentRepository enrollmentRepository;
    private final MountClassService mountClassService;
    private final StudentService studentService;
    private final StudentRepository studentRepository;
    private final MountClassRepository mountClassRepository;

    public TestController(MountClassService mountClassService,StudentService studentService,StudentRepository studentRepository,MountClassRepository mountClassRepository, EnrollmentRepository enrollmentRepository, EnrollmentService enrollmentService){
        this.mountClassService = mountClassService;
        this.studentService = studentService;
        this.studentRepository = studentRepository;
        this.mountClassRepository = mountClassRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/data")
    public void generateTestData() throws Exception{
        BufferedReader brClass = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/class.csv")));
        BufferedReader brStudent = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/student.csv")));
        BufferedReader brEnrollment = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/enrollment.csv")));
        BufferedReader brSchedule = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/schedule.csv")));
        BufferedReader brScheduleEntry = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/scheduleEntry.csv")));
        brClass.readLine();
        brStudent.readLine();
        brEnrollment.readLine();
        brSchedule.readLine();
        brScheduleEntry.readLine();

        String line;
        String[] columnSpliter = {};
        while((line = brClass.readLine()) != null){
            columnSpliter = line.split(",");
            boolean convertIsActive = Boolean.parseBoolean(columnSpliter[4]);
            int convertCredits = Integer.parseInt(columnSpliter[3]);
            MountClass mountClass = new MountClass(columnSpliter[1],columnSpliter[2],convertCredits,convertIsActive);
            mountClassService.addClass(mountClass);
        }

        while((line = brStudent.readLine()) != null){
            columnSpliter = line.split(",");
            LocalDate graduationDateConverter = LocalDate.parse(columnSpliter[3]);
            Boolean isCSMajorConverter = Boolean.parseBoolean(columnSpliter[4]);
            Student student = new Student(columnSpliter[1], columnSpliter[2], graduationDateConverter, isCSMajorConverter);
            studentService.addStudent(student);
        }


        while((line = brEnrollment.readLine()) != null){
            columnSpliter = line.split(",");
            
            Optional <Student> studentOptional  = studentRepository.findById(Long.parseLong(columnSpliter[1]));
            Optional <MountClass> mountClassOptional  = mountClassRepository.findById(Long.parseLong(columnSpliter[2]));

            if(studentOptional.isPresent() && mountClassOptional.isPresent()){
                Student student = studentOptional.get();
                MountClass mountClass = mountClassOptional.get();
                int statusConverter = Integer.parseInt(columnSpliter[3]);
                Enrollment enrollment = new Enrollment(mountClass,student,statusConverter);
                enrollmentService.addEnrollment(enrollment);
            }          
        }

        while((line = brSchedule.readLine()) != null){
            columnSpliter = line.split(",");
        
            
        }
    }

    @GetMapping("/get/classes")
    public List<MountClass> getAllClasses(){
        return mountClassService.getAllMountClasses();
    }
    @GetMapping("/get/students")
    public List<Student> getAllStudents(){
        return studentService.getAllStudents();
    }

    @GetMapping("/get/enrollments")
    public List<Enrollment> getAllEnrollments(){
        return enrollmentService.getAllEnrollments();
    }

}
