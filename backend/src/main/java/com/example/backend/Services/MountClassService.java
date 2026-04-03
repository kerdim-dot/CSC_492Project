package com.example.backend.Services;

import java.util.List;

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
}
