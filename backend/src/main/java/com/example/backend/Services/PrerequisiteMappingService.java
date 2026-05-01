package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.PrerequisiteMapping;
import com.example.backend.Repositories.PrerequisiteMappingRepository;
import com.example.backend.dtos.PrerequisiteDTO;

@Service
public class PrerequisiteMappingService {
    private final PrerequisiteMappingRepository prerequisiteMappingRepository;

    public PrerequisiteMappingService(PrerequisiteMappingRepository prerequisiteMappingRepository){
        this.prerequisiteMappingRepository =  prerequisiteMappingRepository;
    }

    public void addPrerequisiteMapping(PrerequisiteMapping prerequisiteMapping){
        prerequisiteMappingRepository.save(prerequisiteMapping);
    }

    public List<PrerequisiteDTO> getAllPrerequisiteMapping(){
        return prerequisiteMappingRepository.findAllPrerequisiteDTOs();
    }

    public void deletePrerequisite(Long id){
        Optional <PrerequisiteMapping> prerequisiteMappingOptional = prerequisiteMappingRepository.findById(id);

        if(prerequisiteMappingOptional.isPresent()){
            prerequisiteMappingRepository.delete(prerequisiteMappingOptional.get());
        }
    }

}
