package com.los.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CustomerSelfRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 120, message = "Full name must not exceed 120 characters")
        String fullName,

        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in the past")
        LocalDate dob,

        @NotBlank(message = "PAN is required")
        @Pattern(regexp = "^[A-Za-z]{5}[0-9]{4}[A-Za-z]$", message = "PAN must be valid")
        String pan,

        @NotBlank(message = "Aadhaar is required")
        @Pattern(regexp = "^[0-9]{12}$", message = "Aadhaar must contain 12 digits")
        String aadhaar,

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Phone must be a valid 10 digit Indian mobile number")
        String phone,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        @Size(max = 160, message = "Email must not exceed 160 characters")
        String email,

        @NotBlank(message = "Address is required")
        @Size(max = 500, message = "Address must not exceed 500 characters")
        String address,

        @NotBlank(message = "Occupation is required")
        @Size(max = 120, message = "Occupation must not exceed 120 characters")
        String occupation,

        @NotNull(message = "Annual income is required")
        @DecimalMin(value = "0.01", message = "Annual income must be greater than 0")
        BigDecimal annualIncome
) {
}
