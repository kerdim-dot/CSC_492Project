package com.example.backend.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Services.MountClassEntryService;

@RestController
@RequestMapping("/class/entry")
public class MountClassEntryController {
    private final MountClassEntryService mountClassEntryService;

    public MountClassEntryController(MountClassEntryService mountClassEntryService){
        this.mountClassEntryService = mountClassEntryService;
    }
}
