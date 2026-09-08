package com.landrecord.registration.service;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Component
public class AadharUtil {

    /**
     * One-way SHA-256 hash of the Aadhar number, used for storage & duplicate checks.
     * Raw Aadhar is never stored.
     */
    public String hash(String aadharNumber) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(aadharNumber.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    /** e.g. 123456789012 -> XXXX-XXXX-9012 */
    public String mask(String aadharNumber) {
        String last4 = aadharNumber.substring(aadharNumber.length() - 4);
        return "XXXX-XXXX-" + last4;
    }
}
