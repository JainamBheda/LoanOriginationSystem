package com.los.dto;

import com.los.constants.LoanApplicationStatus;

public record EligibilityResult(
        LoanApplicationStatus status,
        String remarks
) {
}
