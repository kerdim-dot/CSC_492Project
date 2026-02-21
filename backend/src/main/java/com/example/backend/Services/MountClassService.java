package com.example.backend.Services;

import org.springframework.stereotype.Service;

import com.example.backend.Repositories.MountClassRepository;

@Service
public class MountClassService {

    private final MountClassRepository mountClassRepository;

    public MountClassService(MountClassRepository mountClassRepository){
        this.mountClassRepository = mountClassRepository;
    }
}
