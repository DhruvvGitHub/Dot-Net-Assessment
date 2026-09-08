package com.landrecord.registration.dto;

import com.landrecord.registration.entity.LandUser;
import com.landrecord.registration.enums.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String name;
    private Integer age;
    private String aadharMasked;
    private String mobile;
    private String email;
    private RegistrationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private String reviewedBy;
    private String rejectionReason;

    public static UserResponseDTO fromEntity(LandUser u) {
        return new UserResponseDTO(
                u.getId(), u.getName(), u.getAge(), u.getAadharMasked(),
                u.getMobile(), u.getEmail(), u.getStatus(),
                u.getCreatedAt(), u.getReviewedAt(), u.getReviewedBy(), u.getRejectionReason()
        );
    }
}
