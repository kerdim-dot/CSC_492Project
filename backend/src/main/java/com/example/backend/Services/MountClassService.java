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

    public void updateMountClass(MountClass classInfo, Long classId){
        Optional <MountClass> mountClassOptional = mountClassRepository.findById(classId);

        if(mountClassOptional.isPresent()){
            MountClass mountClass  = mountClassOptional.get();

            if(mountClass.getCredits() != classInfo.getCredits()){
                mountClass.setCredits(classInfo.getCredits());
            }

            if (mountClass.getDescription().equals(classInfo.getDescription())){
                mountClass.setDescription(classInfo.getDescription());
            }

            if (mountClass.getHeader().equals(classInfo.getHeader())){
                mountClass.setHeader(classInfo.getHeader());
            }

            if (mountClass.getTitle().equals(classInfo.getTitle())){
                mountClass.setTitle(classInfo.getTitle());
            }
            mountClassRepository.save(mountClass);
        }

    }
}
