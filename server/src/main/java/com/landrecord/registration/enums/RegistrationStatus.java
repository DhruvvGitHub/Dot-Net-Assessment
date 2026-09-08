package com.landrecord.registration.enums;

/**
 * Lifecycle of a registration.
 * PENDING  -> just submitted, awaiting admin review (this IS the "temporary" state).
 * APPROVED -> verified valid by admin, now a permanent confirmed record.
 * REJECTED -> admin found it invalid; kept for audit trail, not a valid user.
 */
public enum RegistrationStatus {
    PENDING,
    APPROVED,
    REJECTED
}
