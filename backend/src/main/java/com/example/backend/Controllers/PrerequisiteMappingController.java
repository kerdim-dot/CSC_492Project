package com.example.backend.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Services.PrerequisiteMappingService;

@RestController
@RequestMapping("/prerequisite")
public class PrerequisiteMappingController {
    private final PrerequisiteMappingService prerequisiteMappingService;
    
    public PrerequisiteMappingController(PrerequisiteMappingService prerequisiteMappingService){
        this.prerequisiteMappingService = prerequisiteMappingService;
    }
}
