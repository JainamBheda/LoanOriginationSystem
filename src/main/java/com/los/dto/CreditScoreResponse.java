package com.los.dto;

import com.los.entity.CreditScore;

import java.time.LocalDateTime;

public record CreditScoreResponse(
        Long id,
        CustomerSummaryResponse customer,
        Integer creditScore,
        LocalDateTime lastUpdated
) {

    public static CreditScoreResponse from(CreditScore creditScore) {
        return new CreditScoreResponse(
                creditScore.getId(),
                CustomerSummaryResponse.from(creditScore.getCustomer()),
                creditScore.getCreditScore(),
                creditScore.getLastUpdated()
        );
    }
}
