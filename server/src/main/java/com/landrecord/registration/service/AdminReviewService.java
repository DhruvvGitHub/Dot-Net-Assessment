package com.landrecord.registration.service;

import com.landrecord.registration.dto.UserResponseDTO;
import com.landrecord.registration.entity.LandUser;
import com.landrecord.registration.enums.RegistrationStatus;
import com.landrecord.registration.exception.InvalidStateException;
import com.landrecord.registration.exception.ResourceNotFoundException;
import com.landrecord.registration.repository.LandUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminReviewService {

    private final LandUserRepository repository;

    public List<UserResponseDTO> getPending() {
        return repository.findByStatus(RegistrationStatus.PENDING)
                .stream().map(UserResponseDTO::fromEntity).toList();
    }

    public List<UserResponseDTO> getByStatus(RegistrationStatus status) {
        return repository.findByStatus(status)
                .stream().map(UserResponseDTO::fromEntity).toList();
    }

    public List<UserResponseDTO> getAll() {
        return repository.findAll()
                .stream().map(UserResponseDTO::fromEntity).toList();
    }

    /**
     * Admin approves a pending registration -> becomes a permanent valid user record.
     * @param adminUsername identity of the reviewing admin (from auth principal), for audit trail
     */
    @Transactional
    public UserResponseDTO approve(Long id, String adminUsername) {
        LandUser user = getPendingOrThrow(id);
        user.setStatus(RegistrationStatus.APPROVED);
        user.setReviewedAt(LocalDateTime.now());
        user.setReviewedBy(adminUsername);
        user.setRejectionReason(null);
        return UserResponseDTO.fromEntity(repository.save(user));
    }

    @Transactional
    public UserResponseDTO reject(Long id, String reason, String adminUsername) {
        LandUser user = getPendingOrThrow(id);
        user.setStatus(RegistrationStatus.REJECTED);
        user.setReviewedAt(LocalDateTime.now());
        user.setReviewedBy(adminUsername);
        user.setRejectionReason(reason);
        return UserResponseDTO.fromEntity(repository.save(user));
    }

    private LandUser getPendingOrThrow(Long id) {
        LandUser user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No registration found with id " + id));
        if (user.getStatus() != RegistrationStatus.PENDING) {
            throw new InvalidStateException(
                    "Registration " + id + " has already been reviewed (status: " + user.getStatus() + ")");
        }
        return user;
    }
}
