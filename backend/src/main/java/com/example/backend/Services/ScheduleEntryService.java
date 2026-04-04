package com.example.backend.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.ScheduleEntry;
import com.example.backend.Repositories.ScheduleEntryRepository;

@Service
public class ScheduleEntryService {
    
    private final ScheduleEntryRepository scheduleEntryRepository;

    public ScheduleEntryService(ScheduleEntryRepository scheduleEntryRepository){
        this.scheduleEntryRepository = scheduleEntryRepository;
    }

    public void addScheduleEntry(ScheduleEntry scheduleEntry){
        scheduleEntryRepository.save(scheduleEntry);
    }

    public List<ScheduleEntry> getAllScheduleEntries(){
        return scheduleEntryRepository.findAll();
    }

}
