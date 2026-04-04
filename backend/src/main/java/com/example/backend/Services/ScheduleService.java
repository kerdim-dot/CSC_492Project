package com.example.backend.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.Schedule;

import com.example.backend.Repositories.ScheduleRepository;

@Service
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository){
        this.scheduleRepository = scheduleRepository;
    }

    public void addSchedule(Schedule schedule){
        scheduleRepository.save(schedule);
    }


    public List<Schedule> getAllStudentSchedules(long studentId){
        return scheduleRepository.findAllByStudent_StudentId(studentId);
    }
}
