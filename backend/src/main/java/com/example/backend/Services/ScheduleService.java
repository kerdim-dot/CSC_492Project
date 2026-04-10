package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.Schedule;

import com.example.backend.Repositories.ScheduleRepository;
import com.example.backend.dtos.ScheduleDTO;

@Service
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    
    public ScheduleService(ScheduleRepository scheduleRepository){
        this.scheduleRepository = scheduleRepository;
    }

    public void addSchedule(Schedule schedule){
        scheduleRepository.save(schedule);
    }


    public List<ScheduleDTO> getAllStudentSchedules(long studentId){
        return scheduleRepository.findSchedulesByStudentId(studentId);
    }

    public void deleteSchedule(Long id){
        Optional <Schedule> scheduleOptional = scheduleRepository.findById(id);

        if(scheduleOptional.isPresent()){
            scheduleRepository.delete(scheduleOptional.get());
        }
    }

}
