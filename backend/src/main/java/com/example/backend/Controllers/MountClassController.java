package com.example.backend.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Services.MountClassService;

@RestController
@RequestMapping("class")
public class MountClassController {

    private MountClassService mountClassService;

    public MountClassController(MountClassService mountClassService){
        this.mountClassService = mountClassService;
    }

}
