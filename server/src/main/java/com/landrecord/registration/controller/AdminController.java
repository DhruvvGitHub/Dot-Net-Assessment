package com.landrecord.registration.controller;

import com.landrecord.registration.dto.RejectionDTO;
import com.landrecord.registration.dto.UserResponseDTO;
import com.landrecord.registration.enums.RegistrationStatus;
import com.landrecord.registration.service.AdminReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/registrations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminReviewService adminReviewService;

    @GetMapping("/pending")
    public ResponseEntity<List<UserResponseDTO>> getPending() {
        return ResponseEntity.ok(adminReviewService.getPending());
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAll(
            @RequestParam(required = false) RegistrationStatus status) {
        List<UserResponseDTO> result = status == null
                ? adminReviewService.getAll()
                : adminReviewService.getByStatus(status);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<UserResponseDTO> approve(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(adminReviewService.approve(id, auth.getName()));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<UserResponseDTO> reject(
            @PathVariable Long id, @Valid @RequestBody RejectionDTO body, Authentication auth) {
        return ResponseEntity.ok(adminReviewService.reject(id, body.getReason(), auth.getName()));
    }
}
