package com.los.service;

import com.los.dto.CreditScoreRequest;
import com.los.dto.CreditScoreResponse;

public interface CreditScoreService {

    CreditScoreResponse getCreditScoreByCustomerId(Long customerId);

    CreditScoreResponse updateCreditScore(Long customerId, CreditScoreRequest request);
}
