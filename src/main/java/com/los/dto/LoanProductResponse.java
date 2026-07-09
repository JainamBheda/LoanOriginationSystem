package com.los.dto;

import com.los.entity.LoanProduct;

import java.math.BigDecimal;

public record LoanProductResponse(
        Long id,
        String loanName,
        BigDecimal interestRate,
        BigDecimal maximumAmount,
        Integer tenureMonths,
        BigDecimal processingFee
) {

    public static LoanProductResponse from(LoanProduct loanProduct) {
        return new LoanProductResponse(
                loanProduct.getId(),
                loanProduct.getLoanName(),
                loanProduct.getInterestRate(),
                loanProduct.getMaximumAmount(),
                loanProduct.getTenureMonths(),
                loanProduct.getProcessingFee()
        );
    }
}
