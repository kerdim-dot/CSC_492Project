package com.example.backend.Controllers;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Entities.Enrollment;
import com.example.backend.Entities.ImportantDate;
import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.MountClassEntry;
import com.example.backend.Entities.PrerequisiteMapping;
import com.example.backend.Entities.Schedule;
import com.example.backend.Entities.ScheduleEntry;
import com.example.backend.Entities.Student;
import com.example.backend.Repositories.EnrollmentRepository;
import com.example.backend.Repositories.MountClassRepository;
import com.example.backend.Repositories.ScheduleRepository;
import com.example.backend.Repositories.StudentRepository;
import com.example.backend.Services.EnrollmentService;
import com.example.backend.Services.ImportantDateService;
import com.example.backend.Services.MountClassEntryService;
import com.example.backend.Services.MountClassService;
import com.example.backend.Services.PrerequisiteMappingService;
import com.example.backend.Services.ScheduleEntryService;
import com.example.backend.Services.ScheduleService;
import com.example.backend.Services.StudentService;
import com.example.backend.dtos.EnrollmentDTO;
import com.example.backend.dtos.MountClassEntryDTO;
import com.example.backend.dtos.PrerequisiteDTO;
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
    private final PrerequisiteMappingService prerequisiteMappingService;
    private final ImportantDateService importantDataService;

    public TestController(MountClassService mountClassService, StudentService studentService,
            StudentRepository studentRepository, MountClassRepository mountClassRepository,
            EnrollmentRepository enrollmentRepository, EnrollmentService enrollmentService,
            ScheduleService scheduleService, ScheduleEntryService scheduleEntryService, ScheduleRepository scheduleRepository,
            MountClassEntryService mountClassEntryService, PrerequisiteMappingService prerequisiteMappingService,
            ImportantDateService importantDataService) {

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
        this.prerequisiteMappingService = prerequisiteMappingService;
        this.importantDataService = importantDataService;

    }

    @GetMapping("/data")
    public void generateTestData() throws Exception {

        InputStream is = getClass().getClassLoader().getResourceAsStream("testingCSVs/class.csv");
        if (is == null) {
            throw new RuntimeException("File not found: class.csv");
        }
        BufferedReader brClass = new BufferedReader(new InputStreamReader(is));
        BufferedReader brStudent = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/student.csv")));
        BufferedReader brEnrollment = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/enrollment.csv")));
        BufferedReader brSchedule = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/schedule.csv")));
        BufferedReader brScheduleEntry = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/scheduleEntry.csv")));
        BufferedReader brClassEntry = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/classEntry.csv")));
        BufferedReader brPrerequisites = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/prerequisites.csv")));
        BufferedReader brImportantDates = new BufferedReader(new InputStreamReader(getClass().getClassLoader().getResourceAsStream("testingCSVs/importantDate.csv")));

        brClass.readLine();
        brStudent.readLine();
        brEnrollment.readLine();
        brSchedule.readLine();
        brScheduleEntry.readLine();
        brClassEntry.readLine();
        brPrerequisites.readLine();
        brImportantDates.readLine();

        String line;
        String[] columnSpliter = {};
        while ((line = brClass.readLine()) != null) {
            columnSpliter = line.split(",");
            for (int i = 0; i < columnSpliter.length; i++) {
                columnSpliter[i] = columnSpliter[i].trim();
            }
            
            int convertCredits = Integer.parseInt(columnSpliter[3]);
            boolean convertIsRequiredComputerScienceMajor = Boolean.parseBoolean(columnSpliter[5]);
            boolean convertIsRequiredComputerScienceMinor = Boolean.parseBoolean(columnSpliter[6]);
            boolean convertIsRequiredMultiPlatformMajor = Boolean.parseBoolean(columnSpliter[7]);

            MountClass mountClass = new MountClass(columnSpliter[1], columnSpliter[2], convertCredits, columnSpliter[4],convertIsRequiredComputerScienceMajor,convertIsRequiredComputerScienceMinor,convertIsRequiredMultiPlatformMajor);
            mountClassService.addClass(mountClass);
        }

        while ((line = brStudent.readLine()) != null) {
            columnSpliter = line.split(",");
            for (int i = 0; i < columnSpliter.length; i++) {
                columnSpliter[i] = columnSpliter[i].trim();
            }
            LocalDate graduationDateConverter = LocalDate.parse(columnSpliter[3]);
            Boolean isCSMajorConverter = Boolean.parseBoolean(columnSpliter[4]);
            Boolean isCSMinorConverter = Boolean.parseBoolean(columnSpliter[5]);
            Boolean isOtherMajorConverter = Boolean.parseBoolean(columnSpliter[6]);

            Student student = new Student(columnSpliter[1], columnSpliter[2], graduationDateConverter, isCSMajorConverter,isCSMinorConverter,isOtherMajorConverter);
            studentService.addStudent(student);
        }

        while ((line = brSchedule.readLine()) != null) {
            columnSpliter = line.split(",");
            for (int i = 0; i < columnSpliter.length; i++) {
                columnSpliter[i] = columnSpliter[i].trim();
            }

            Long student_id = Long.parseLong(columnSpliter[1]);
            LocalDate startDate = LocalDate.parse(columnSpliter[2]);
            LocalDate endDate = LocalDate.parse(columnSpliter[3]);

            ScheduleDTO scheduleDTO = new ScheduleDTO(student_id,startDate,endDate);
            scheduleService.addSchedule(scheduleDTO);

        }
        

        while ((line = brScheduleEntry.readLine()) != null) {
            columnSpliter = line.split(",");
            for (int i = 0; i < columnSpliter.length; i++) {
                columnSpliter[i] = columnSpliter[i].trim();
            }
            Long scheduleId = Long.parseLong(columnSpliter[1]);
            Long mountClassId = Long.parseLong(columnSpliter[2]);
            boolean isMonday = Boolean.parseBoolean(columnSpliter[3]);
            boolean isTuesday = Boolean.parseBoolean(columnSpliter[4]);
            boolean isWednesday = Boolean.parseBoolean(columnSpliter[5]);
            boolean isThursday = Boolean.parseBoolean(columnSpliter[6]);
            boolean isFriday = Boolean.parseBoolean(columnSpliter[7]);
            String time = columnSpliter[8];

            ScheduleEntryDTO scheduleEntryDTO = new ScheduleEntryDTO(scheduleId, mountClassId, isMonday, isTuesday, isWednesday, isThursday, isFriday, time);
            scheduleEntryService.addScheduleEntry(scheduleEntryDTO);
            
        }

        while ((line = brClassEntry.readLine()) != null) {
            columnSpliter = line.split(",");
            for (int i = 0; i < columnSpliter.length; i++) {
                columnSpliter[i] = columnSpliter[i].trim();
            }
            Optional<MountClass> mountClassOptional = mountClassRepository.findById(Long.parseLong(columnSpliter[0]));
            String meetingTime = columnSpliter[1];
            int totalSeats = Integer.parseInt(columnSpliter[2]);
            String professorName = columnSpliter[3];
            boolean isMonday = Boolean.parseBoolean(columnSpliter[4]);
            boolean isTuesday = Boolean.parseBoolean(columnSpliter[5]);
            boolean isWednesday = Boolean.parseBoolean(columnSpliter[6]);
            boolean isThursday = Boolean.parseBoolean(columnSpliter[7]);
            boolean isFriday = Boolean.parseBoolean(columnSpliter[8]);

            if (mountClassOptional.isPresent()) {
                MountClass mountClass = mountClassOptional.get();
                MountClassEntry mountClassEntry = new MountClassEntry(mountClass, meetingTime, totalSeats, professorName, isMonday, isTuesday, isWednesday, isThursday, isFriday);
                mountClassEntryService.addMountClassEntryService(mountClassEntry);
            }
        }

        while ((line = brPrerequisites.readLine()) != null) {
            columnSpliter = line.split(",");
            for (int i = 0; i < columnSpliter.length; i++) {
                columnSpliter[i] = columnSpliter[i].trim();
            }
            Optional<MountClass> mountClassOptional = mountClassRepository.findById(Long.parseLong(columnSpliter[0]));
            Optional<MountClass> mountClassPrequisiteOptional = mountClassRepository.findById(Long.parseLong(columnSpliter[1]));

            if (mountClassOptional.isPresent() && mountClassPrequisiteOptional.isPresent()) {
                MountClass mountClass = mountClassOptional.get();
                MountClass mountClassPrequisite = mountClassPrequisiteOptional.get();

                PrerequisiteMapping prerequisiteMapping = new PrerequisiteMapping(mountClass, mountClassPrequisite);
                prerequisiteMappingService.addPrerequisiteMapping(prerequisiteMapping);
            }
        }

        while((line = brImportantDates.readLine()) != null){
            columnSpliter = line.split(",");
            for (int i = 0; i < columnSpliter.length; i++) {
                columnSpliter[i] = columnSpliter[i].trim();
            }
            //header,description,dateOfEvent,timeOfEvent
            String header = columnSpliter[0];
            String description = columnSpliter[1];
            LocalDate dateOfEvent = LocalDate.parse(columnSpliter[2]);
            String timeOfEvent = columnSpliter[3];
            ImportantDate importantDate = new ImportantDate(header,description,dateOfEvent, timeOfEvent);
            importantDataService.addImportantDate(importantDate);

        }

        while ((line = brEnrollment.readLine()) != null) {
            columnSpliter = line.split(",");
            for (int i = 0; i < columnSpliter.length; i++) {
                columnSpliter[i] = columnSpliter[i].trim();
            }

            Long studentId = Long.parseLong(columnSpliter[1]);
            Long mountClassId = Long.parseLong(columnSpliter[2]);
            int status = Integer.parseInt(columnSpliter[3]);
            String grade = columnSpliter[4];
            LocalDate enrollmentDate = LocalDate.parse(
    columnSpliter[5].replace("'", "").trim()
    );

            EnrollmentDTO enrollmentDTO = new EnrollmentDTO(mountClassId,studentId,status,grade,enrollmentDate);

            enrollmentService.addEnrollment(enrollmentDTO);
            
        }

    }

    @GetMapping("/get/classes")
    public List<MountClass> getAllClasses() {
        return mountClassService.getAllMountClasses();
    }

    @GetMapping("/get/students")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/get/enrollments")
    public List<EnrollmentDTO> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/get/schedules")
    public List<ScheduleDTO> getAllPersonalSchedules(@RequestParam long studentId) {
        return scheduleService.getAllStudentSchedules(studentId);
    }

    @GetMapping("/get/schedule/entries")
    public List<ScheduleEntryDTO> getAllPersonalScheduleEntries(@RequestParam long scheduleId) {
        return scheduleEntryService.getAllStudentScheduleEntries(scheduleId);
    }

    @GetMapping("/get/class/entries")
    public List<MountClassEntryDTO> getAllClassEntries() {
        return mountClassEntryService.getAllMountClassEntries();
    }

    @GetMapping("/get/prequisiteMapping")
    public List<PrerequisiteDTO> getAllPrerequisiteMapping() {
        return prerequisiteMappingService.getAllPrerequisiteMapping();
    }

    @GetMapping("/get/important/dates")
    public List<ImportantDate> getAllImportantDates(){
        return importantDataService.getAllImportantDates();
    }


    @GetMapping("/get/student/enrollment")
    public List <EnrollmentDTO> getCertainStudentEnrollment(@RequestParam Long id){
        return enrollmentService.findAllEnrollmentsByStudentId(id);
    }

    @GetMapping(("/get/class/enrollment"))
    public List <EnrollmentDTO> getCertainClassEnrollment(@RequestParam Long id){
        return enrollmentService.findAllEnrollmentsByClassId(id);
    }

    @DeleteMapping("/delete/class/enrollment")
    public void deleteCertainClassEnrollment(@RequestParam Long id){
        enrollmentService.deleteAllEnrollmentsByClassId(id);
    }

    @DeleteMapping("/delete/student/enrollment")
    public void deleteCertainStudentEnrollment(@RequestParam Long id){
        enrollmentService.deleteAllEnrollmentsByStudentId(id);
    }

    @DeleteMapping("/delete/student/schedules")
    public void deleteCertainStudentSchedules(@RequestParam long id){
        scheduleService.deleteAllCertainStudentSchedule(id);
    }


    @DeleteMapping("/delete/schedule/entries")
    public void deleteCertainScheduleEntries(@RequestParam long id){
        scheduleEntryService.deleteAllStudentSchduleEntries(id);
    }

    @DeleteMapping("/delete/student")
    public void deleteStudent(@RequestParam long id){
        studentService.deleteStudent(id);
    }


    @PostMapping("/add/schedule/Entry")
    public void addScheduleEntry(@RequestBody ScheduleEntryDTO scheduleEntryDTO){
        scheduleEntryService.addScheduleEntry(scheduleEntryDTO);
    }

    @PostMapping("/add/schedule")
    public void addSchedule(@RequestBody ScheduleDTO scheduleDTO){
        scheduleService.addSchedule(scheduleDTO);
    }    

    @PutMapping("/update/student")
    public void updateStudent(@RequestBody Student student, @RequestParam long id){
        studentService.updateStudent(student, id);
    }

    @PutMapping("/update/class")
    public void updateStudent(@RequestBody MountClass mountClass, @RequestParam long id){
        mountClassService.updateMountClass(mountClass, id);
    }


    @DeleteMapping("/delete/schedule")
    public void deleteSchedule(@RequestParam long id){
        scheduleService.deleteSchedule(id);
    }


    @PostMapping("/add/student")
    public void addStudent(@RequestBody Student student){
        studentService.addStudent(student);
    }

    @PostMapping("/add/class")
    public void addStudent(@RequestBody MountClass mountClass){
        mountClassService.addClass(mountClass);
    }

    @PostMapping("/add/enrollment")
    public void addEnrollment(@RequestBody EnrollmentDTO enrollmentDTO){

    }

}

