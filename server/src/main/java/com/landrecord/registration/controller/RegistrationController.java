package com.landrecord.registration.controller;

import com.landrecord.registration.dto.RegistrationRequestDTO;
import com.landrecord.registration.dto.UserResponseDTO;
import com.landrecord.registration.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    /** Public sign-up form submits here. Saved as PENDING. */
    @PostMapping
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegistrationRequestDTO request) {
        UserResponseDTO saved = registrationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /** Applicant can poll this to see if admin has reviewed them yet. */
    @GetMapping("/{id}/status")
    public ResponseEntity<UserResponseDTO> getStatus(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.getStatus(id));
    }
}
