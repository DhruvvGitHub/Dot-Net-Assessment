package com.landrecord.registration.service;

import com.landrecord.registration.dto.RegistrationRequestDTO;
import com.landrecord.registration.dto.UserResponseDTO;
import com.landrecord.registration.entity.LandUser;
import com.landrecord.registration.enums.RegistrationStatus;
import com.landrecord.registration.exception.DuplicateRegistrationException;
import com.landrecord.registration.exception.ResourceNotFoundException;
import com.landrecord.registration.repository.LandUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final LandUserRepository repository;
    private final AadharUtil aadharUtil;

    /**
     * Public endpoint entry point. Saves the registration as PENDING.
     * This IS the "temporary" storage — it's a real row, just not yet a valid/confirmed user.
     */
    @Transactional
    public UserResponseDTO register(RegistrationRequestDTO request) {
        String aadharHash = aadharUtil.hash(request.getAadharNumber());

        if (repository.existsByAadharHash(aadharHash)) {
            throw new DuplicateRegistrationException("A registration with this Aadhar number already exists");
        }
        if (repository.existsByMobile(request.getMobile())) {
            throw new DuplicateRegistrationException("A registration with this mobile number already exists");
        }
        if (repository.existsByEmail(request.getEmail())) {
            throw new DuplicateRegistrationException("A registration with this email already exists");
        }

        LandUser user = LandUser.builder()
                .name(request.getName().trim())
                .age(request.getAge())
                .aadharHash(aadharHash)
                .aadharMasked(aadharUtil.mask(request.getAadharNumber()))
                .mobile(request.getMobile())
                .email(request.getEmail().trim().toLowerCase())
                .status(RegistrationStatus.PENDING)
                .build();

        return UserResponseDTO.fromEntity(repository.save(user));
    }

    /** Lets an applicant check their own status by id. */
    public UserResponseDTO getStatus(Long id) {
        LandUser user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No registration found with id " + id));
        return UserResponseDTO.fromEntity(user);
    }
}
