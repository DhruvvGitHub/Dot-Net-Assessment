package com.landrecord.registration.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectionDTO {

    @NotBlank(message = "Rejection reason is required")
    private String reason;
}
