package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.Schedule;
import com.example.backend.Entities.Student;
import com.example.backend.Repositories.ScheduleRepository;
import com.example.backend.Repositories.StudentRepository;
import com.example.backend.dtos.ScheduleDTO;

@Service
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final StudentRepository studentRepository;
    
    public ScheduleService(ScheduleRepository scheduleRepository,StudentRepository studentRepository){
        this.scheduleRepository = scheduleRepository;
        this.studentRepository = studentRepository;
    }

    public void addSchedule(ScheduleDTO scheduleDTO){

        long student_id = scheduleDTO.getStudent_id();

        Optional <Student> studentOptional = studentRepository.findById(student_id);

        if(studentOptional.isPresent()){
            Student student = studentOptional.get();
            Schedule schedule = new Schedule(student,scheduleDTO.getScheduleStartDate(),scheduleDTO.getScheduleEndDate());
            scheduleRepository.save(schedule);
        }

    }


    public List<ScheduleDTO> getAllStudentSchedules(long studentId){
        return scheduleRepository.findSchedulesByStudentId(studentId);
    }

    public void deleteAllCertainStudentSchedule(long studentId){
        scheduleRepository.deleteByStudentId(studentId);
    }

    public void deleteSchedule(Long id){
        Optional <Schedule> scheduleOptional = scheduleRepository.findById(id);

        if(scheduleOptional.isPresent()){
            scheduleRepository.delete(scheduleOptional.get());
        }
    }




}
