package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.MountClassEntry;
import com.example.backend.Repositories.MountClassEntryRepository;
import com.example.backend.Repositories.MountClassRepository;
import com.example.backend.dtos.MountClassEntryDTO;

@Service
public class MountClassEntryService {

    private final MountClassEntryRepository mountClassEntryRepository;
    private final MountClassRepository mountClassRepository;

    public MountClassEntryService(MountClassEntryRepository mountClassEntryRepository, MountClassRepository mountClassRepository){
        this.mountClassEntryRepository = mountClassEntryRepository;
        this.mountClassRepository = mountClassRepository;
    }


    public void addMountClassEntryService(MountClassEntryDTO mountClassEntryDTO){
       Optional<MountClass> mountClassOptional = mountClassRepository.findById(mountClassEntryDTO.getClass_id());

       if (mountClassOptional.isPresent()) {
            MountClass mountClass = mountClassOptional.get();
            String meetingTime = mountClassEntryDTO.getMeetingTime();
            int totalSeats = mountClassEntryDTO.getTotalSeats();
            String professorName = mountClassEntryDTO.getProfessorName();
            boolean isMonday = mountClassEntryDTO.getIsMonday();
            boolean isTuesday = mountClassEntryDTO.getIsTuesday();
            boolean isWednesday = mountClassEntryDTO.getIsWednesday();
            boolean isThursday = mountClassEntryDTO.getIsThursday();
            boolean isFriday = mountClassEntryDTO.getIsFriday();

            MountClassEntry mountClassEntry = new MountClassEntry(mountClass, meetingTime, totalSeats, professorName, isMonday, isTuesday, isWednesday, isThursday, isFriday);
            mountClassEntryRepository.save(mountClassEntry);
        }
    }

    public List<MountClassEntryDTO> getAllMountClassEntries(){
        return mountClassEntryRepository.findAllMountClassEntryDTOs();
    }

    public void deleteMountClassEntry(long id){
        Optional <MountClassEntry> mountClassEntryOptional = mountClassEntryRepository.findById(id);

        if(mountClassEntryOptional.isPresent()){
            mountClassEntryRepository.delete(mountClassEntryOptional.get());
        }
    }

    public void updateMountClassEntry(MountClassEntryDTO classEntry, long id) {
        MountClassEntry currentClassEntry = mountClassEntryRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Class entry not found: " + id));

        currentClassEntry.setProfessorName(classEntry.getProfessorName());
        currentClassEntry.setMeetingTime(classEntry.getMeetingTime());
        currentClassEntry.setTotalSeats(classEntry.getTotalSeats());
        currentClassEntry.setIsMonday(classEntry.getIsMonday());
        currentClassEntry.setIsTuesday(classEntry.getIsTuesday());
        currentClassEntry.setIsWednesday(classEntry.getIsWednesday());
        currentClassEntry.setIsThursday(classEntry.getIsThursday());
        currentClassEntry.setIsFriday(classEntry.getIsFriday());

        mountClassEntryRepository.save(currentClassEntry);
    }
        
}
