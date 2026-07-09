package com.los.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record LoanDecisionRequest(
        @DecimalMin(value = "0.01", message = "Approved amount must be greater than 0")
        BigDecimal approvedAmount,

        @Size(max = 1000, message = "Remarks must not exceed 1000 characters")
        String remarks
) {
}
