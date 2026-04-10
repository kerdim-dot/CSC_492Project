package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.MountClassEntry;
import com.example.backend.Repositories.MountClassEntryRepository;
import com.example.backend.dtos.MountClassEntryDTO;

@Service
public class MountClassEntryService {

    private final MountClassEntryRepository mountClassEntryRepository;

    public MountClassEntryService(MountClassEntryRepository mountClassEntryRepository){
        this.mountClassEntryRepository = mountClassEntryRepository;
    }


    public void addMountClassEntryService(MountClassEntry mountClassEntry){
        mountClassEntryRepository.save(mountClassEntry);
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
    
}
