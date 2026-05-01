package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.Student;
import com.example.backend.Repositories.MountClassRepository;

@Service
public class MountClassService {

    private final MountClassRepository mountClassRepository;

    public MountClassService(MountClassRepository mountClassRepository){
        this.mountClassRepository = mountClassRepository;
    }

    public void addClass(MountClass mountClass){
        mountClassRepository.save(mountClass);
    }

    public List<MountClass> getAllMountClasses(){
        return mountClassRepository.findAll();
    }


    public void deleteClass(Long id){
        Optional <MountClass> mountClassOptional = mountClassRepository.findById(id);

        if(mountClassOptional.isPresent()){
            mountClassRepository.delete(mountClassOptional.get());
        }
    }

    public void updateMountClass(MountClass classInfo, Long classId) {
        Optional<MountClass> mountClassOptional = mountClassRepository.findById(classId);

        if (mountClassOptional.isPresent()) {
            MountClass mountClass = mountClassOptional.get();

            mountClass.setTitle(classInfo.getTitle());
            mountClass.setHeader(classInfo.getHeader());
            mountClass.setDescription(classInfo.getDescription());
            mountClass.setCredits(classInfo.getCredits());
            mountClass.setIsRequiredComputerScienceMajor(classInfo.getIsRequiredComputerScienceMajor());
            mountClass.setIsRequiredComputerScienceMinor(classInfo.getIsRequiredComputerScienceMinor());
            mountClass.setIsRequiredMultiPlatformMajor(classInfo.getIsRequiredMultiPlatformMajor());

            mountClassRepository.save(mountClass);
        }
    }
}
