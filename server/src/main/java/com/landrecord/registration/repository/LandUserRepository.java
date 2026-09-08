package com.landrecord.registration.repository;

import com.landrecord.registration.entity.LandUser;
import com.landrecord.registration.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LandUserRepository extends JpaRepository<LandUser, Long> {

    boolean existsByAadharHash(String aadharHash);

    boolean existsByMobile(String mobile);

    boolean existsByEmail(String email);

    List<LandUser> findByStatus(RegistrationStatus status);

    Optional<LandUser> findByIdAndStatus(Long id, RegistrationStatus status);
}
