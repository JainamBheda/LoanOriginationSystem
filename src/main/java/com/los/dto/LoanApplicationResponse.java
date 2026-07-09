package com.los.dto;

import com.los.constants.LoanApplicationStatus;
import com.los.entity.LoanApplication;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LoanApplicationResponse(
        Long id,
        CustomerSummaryResponse customer,
        LoanProductResponse loanProduct,
        BigDecimal requestedAmount,
        BigDecimal approvedAmount,
        Integer tenure,
        LocalDateTime applicationDate,
        LoanApplicationStatus status,
        String remarks
) {

    public static LoanApplicationResponse from(LoanApplication loanApplication) {
        return new LoanApplicationResponse(
                loanApplication.getId(),
                CustomerSummaryResponse.from(loanApplication.getCustomer()),
                LoanProductResponse.from(loanApplication.getLoanProduct()),
                loanApplication.getRequestedAmount(),
                loanApplication.getApprovedAmount(),
                loanApplication.getTenure(),
                loanApplication.getApplicationDate(),
                loanApplication.getStatus(),
                loanApplication.getRemarks()
        );
    }
}
