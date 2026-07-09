package com.los.dto;

import com.los.constants.LoanApplicationStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record LoanApplicationRequest(
        @NotNull(message = "Customer id is required")
        Long customerId,

        @NotNull(message = "Loan product id is required")
        Long loanProductId,

        @NotNull(message = "Requested amount is required")
        @DecimalMin(value = "0.01", message = "Requested amount must be greater than 0")
        BigDecimal requestedAmount,

        @DecimalMin(value = "0.01", message = "Approved amount must be greater than 0")
        BigDecimal approvedAmount,

        @NotNull(message = "Tenure is required")
        @Min(value = 1, message = "Tenure must be at least 1 month")
        Integer tenure,

        LoanApplicationStatus status,

        @Size(max = 1000, message = "Remarks must not exceed 1000 characters")
        String remarks
) {
}
