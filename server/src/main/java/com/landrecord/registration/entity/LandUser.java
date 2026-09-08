package com.landrecord.registration.entity;

import com.landrecord.registration.enums.RegistrationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "land_users",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_aadhar_hash", columnNames = "aadhar_hash"),
        @UniqueConstraint(name = "uk_mobile", columnNames = "mobile"),
        @UniqueConstraint(name = "uk_email", columnNames = "email")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer age;

    /**
     * SHA-256 hash of the Aadhar number. Used for uniqueness checks and lookups.
     * The raw Aadhar number is NEVER persisted or logged.
     */
    @Column(name = "aadhar_hash", nullable = false, length = 64)
    private String aadharHash;

    /**
     * Masked display form only, e.g. XXXX-XXXX-1234. Safe to show in admin UI.
     */
    @Column(name = "aadhar_masked", nullable = false, length = 15)
    private String aadharMasked;

    @Column(nullable = false, length = 15)
    private String mobile;

    @Column(nullable = false, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RegistrationStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "reviewed_by", length = 100)
    private String reviewedBy;

    @Column(name = "rejection_reason", length = 255)
    private String rejectionReason;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = RegistrationStatus.PENDING;
        }
    }
}
