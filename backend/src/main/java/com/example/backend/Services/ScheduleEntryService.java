package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.Schedule;
import com.example.backend.Entities.ScheduleEntry;
import com.example.backend.Repositories.MountClassRepository;
import com.example.backend.Repositories.ScheduleEntryRepository;
import com.example.backend.Repositories.ScheduleRepository;
import com.example.backend.dtos.ScheduleEntryDTO;

@Service
public class ScheduleEntryService {
    
    private final ScheduleEntryRepository scheduleEntryRepository;
    private final ScheduleRepository scheduleRepository;
    private final MountClassRepository mountClassRepository;

    public ScheduleEntryService(ScheduleEntryRepository scheduleEntryRepository,ScheduleRepository scheduleRepository,MountClassRepository mountClassRepository){
        this.scheduleEntryRepository = scheduleEntryRepository;
        this.scheduleRepository = scheduleRepository;
        this.mountClassRepository = mountClassRepository;
    }

    public void addScheduleEntry(ScheduleEntryDTO scheduleEntryDTO){
        Long classId = scheduleEntryDTO.getMountClass_id();
        Long scheduleId = scheduleEntryDTO.getMountClass_id();
        Optional <MountClass> classOptional = mountClassRepository.findById(classId);
        Optional <Schedule> scheduleOptional = scheduleRepository.findById(scheduleId);
        if(classOptional.isPresent() && scheduleOptional.isPresent()){
            MountClass mountClass = classOptional.get();
            Schedule schedule = scheduleOptional.get();
            boolean isMonday = scheduleEntryDTO.getIsMonday();
            boolean isTuesday = scheduleEntryDTO.getIsTuesday();
            boolean isWednesday = scheduleEntryDTO.getIsWednesDay();
            boolean isThursday = scheduleEntryDTO.getIsThursday();
            boolean isFriday = scheduleEntryDTO.getIsFriday();
            String time = scheduleEntryDTO.getTime();

            ScheduleEntry scheduleEntry = new ScheduleEntry(schedule,mountClass,isMonday,isTuesday,isWednesday,isThursday,isFriday,time);

            scheduleEntryRepository.save(scheduleEntry);
        }

        //scheduleEntryRepository.save();
    }

    public List<ScheduleEntryDTO> getAllStudentScheduleEntries(Long scheduleId){
        return scheduleEntryRepository.findAllScheduleEntryDTOs(scheduleId);
    }

    public void deleteScheduleEntry(Long id){
        Optional <ScheduleEntry> scheduleEntryOptional = scheduleEntryRepository.findById(id);

        if(scheduleEntryOptional.isPresent()){
            scheduleEntryRepository.delete(scheduleEntryOptional.get());
        }
    }


}
