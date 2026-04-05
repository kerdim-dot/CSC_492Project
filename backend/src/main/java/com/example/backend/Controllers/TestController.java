package com.example.backend.Controllers;

import com.example.backend.Repositories.EnrollmentRepository;
import com.example.backend.Repositories.ScheduleEntryRepository;
import com.example.backend.Repositories.ScheduleRepository;
import com.example.backend.Services.EnrollmentService;
import com.example.backend.Services.MountClassEntryService;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Entities.Enrollment;
import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.MountClassEntry;
import com.example.backend.Entities.Schedule;
import com.example.backend.Entities.ScheduleEntry;
import com.example.backend.Entities.Student;
import com.example.backend.Repositories.MountClassRepository;
import com.example.backend.Repositories.StudentRepository;
import com.example.backend.Services.MountClassService;
import com.example.backend.Services.ScheduleEntryService;
import com.example.backend.Services.ScheduleService;
import com.example.backend.Services.StudentService;
import com.example.backend.Services.UserService;
import com.example.backend.dtos.EnrollmentDTO;
import com.example.backend.dtos.MountClassEntryDTO;
import com.example.backend.dtos.ScheduleDTO;
import com.example.backend.dtos.ScheduleEntryDTO;


@RestController
@RequestMapping("/test")
public class TestController {

    private final ScheduleRepository scheduleRepository;
    private final EnrollmentService enrollmentService;
    private final EnrollmentRepository enrollmentRepository;
    private final MountClassService mountClassService;
    private final StudentService studentService;
    private final ScheduleService scheduleService;
    private final ScheduleEntryService scheduleEntryService;
    private final StudentRepository studentRepository;
    private final MountClassRepository mountClassRepository;
    private final MountClassEntryService mountClassEntryService;

    public TestController(MountClassService mountClassService,StudentService studentService,
        StudentRepository studentRepository,MountClassRepository mountClassRepository, 
        EnrollmentRepository enrollmentRepository, EnrollmentService enrollmentService, 
        ScheduleService scheduleService, ScheduleEntryService scheduleEntryService, ScheduleRepository scheduleRepository,
        MountClassEntryService mountClassEntryService){

        this.mountClassService = mountClassService;
        this.studentService = studentService;
        this.studentRepository = studentRepository;
        this.mountClassRepository = mountClassRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.enrollmentService = enrollmentService;
        this.scheduleService = scheduleService;
        this.scheduleEntryService = scheduleEntryService;
        this.scheduleRepository = scheduleRepository;
        this.mountClassEntryService = mountClassEntryService;
        
    }

    @GetMapping("/data")
    public void generateTestData() throws Exception{
        BufferedReader brClass = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/class.csv")));
        BufferedReader brStudent = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/student.csv")));
        BufferedReader brEnrollment = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/enrollment.csv")));
        BufferedReader brSchedule = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/schedule.csv")));
        BufferedReader brScheduleEntry = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/scheduleEntry.csv")));
        BufferedReader brClassEntry = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/classEntry.csv")));

        brClass.readLine();
        brStudent.readLine();
        brEnrollment.readLine();
        brSchedule.readLine();
        brScheduleEntry.readLine();
        brClassEntry.readLine();

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

        while((line = brSchedule.readLine()) != null){
            columnSpliter = line.split(",");
            Optional <Student> studentOptional = studentRepository.findById(Long.parseLong(columnSpliter[1]));
            if(studentOptional.isPresent()){
                Student student = studentOptional.get();
                Schedule schedule = new Schedule(student,LocalDate.parse(columnSpliter[2]));
                scheduleService.addSchedule(schedule);
            }
        }

        while((line = brScheduleEntry.readLine()) != null){
            columnSpliter = line.split(",");
            Optional <Schedule> scheduleOptional = scheduleRepository.findById(Long.parseLong(columnSpliter[1]));
            Optional <MountClass> mountClassOptional = mountClassRepository.findById(Long.parseLong(columnSpliter[2]));
            boolean isMonday = Boolean.parseBoolean(columnSpliter[3]);
            boolean isTuesday = Boolean.parseBoolean(columnSpliter[4]);
            boolean isWednesday = Boolean.parseBoolean(columnSpliter[5]);
            boolean isThursday = Boolean.parseBoolean(columnSpliter[6]);
            boolean isFriday = Boolean.parseBoolean(columnSpliter[7]);
            String time = columnSpliter[8];

            if(scheduleOptional.isPresent() && mountClassOptional.isPresent()){
                Schedule schedule = scheduleOptional.get();
                MountClass mountClass = mountClassOptional.get();
                ScheduleEntry scheduleEntry = new ScheduleEntry(schedule,mountClass,isMonday,isTuesday, isWednesday, isThursday, isFriday, time);
                scheduleEntryService.addScheduleEntry(scheduleEntry);
            }
        }

        while((line = brClassEntry.readLine()) != null){
            columnSpliter = line.split(",");
            
            Optional <MountClass> mountClassOptional  = mountClassRepository.findById(Long.parseLong(columnSpliter[0]));
            String meetingTime = columnSpliter[1];
            int totalSeats = Integer.parseInt(columnSpliter[2]);
            String professorName = columnSpliter[3];
            boolean isMonday = Boolean.parseBoolean(columnSpliter[4]);
            boolean isTuesday = Boolean.parseBoolean(columnSpliter[5]);
            boolean isWednesday = Boolean.parseBoolean(columnSpliter[6]);
            boolean isThursday = Boolean.parseBoolean(columnSpliter[7]);
            boolean isFriday = Boolean.parseBoolean(columnSpliter[8]);


            if(mountClassOptional.isPresent()){
                MountClass mountClass = mountClassOptional.get();
                MountClassEntry mountClassEntry = new MountClassEntry(mountClass,meetingTime,totalSeats,professorName,isMonday,isTuesday, isWednesday,isThursday, isFriday);
                mountClassEntryService.addMountClassEntryService(mountClassEntry);
            }          
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
    public List<EnrollmentDTO> getAllEnrollments(){
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/get/schedules")
    public List<ScheduleDTO> getAllPersonalSchedules(@RequestParam long studentId){
        return scheduleService.getAllStudentSchedules(studentId);
    }

    @GetMapping("/get/scheduleEntries")
    public List<ScheduleEntryDTO> getAllPersonalScheduleEntries(@RequestParam long scheduleId){
        return scheduleEntryService.getAllStudentScheduleEntries(scheduleId);
    }

    @GetMapping("/get/classEntries")
    public List<MountClassEntryDTO> getAllClassEntries(){
        return mountClassEntryService.getAllMountClassEntries();
    }


}
