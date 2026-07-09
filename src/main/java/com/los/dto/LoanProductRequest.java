package com.los.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record LoanProductRequest(
        @NotBlank(message = "Loan name is required")
        @Size(max = 120, message = "Loan name must not exceed 120 characters")
        String loanName,

        @NotNull(message = "Interest rate is required")
        @DecimalMin(value = "0.01", message = "Interest rate must be greater than 0")
        BigDecimal interestRate,

        @NotNull(message = "Maximum amount is required")
        @DecimalMin(value = "0.01", message = "Maximum amount must be greater than 0")
        BigDecimal maximumAmount,

        @NotNull(message = "Tenure months is required")
        @Min(value = 1, message = "Tenure months must be at least 1")
        Integer tenureMonths,

        @NotNull(message = "Processing fee is required")
        @DecimalMin(value = "0.00", message = "Processing fee must not be negative")
        BigDecimal processingFee
) {
}
