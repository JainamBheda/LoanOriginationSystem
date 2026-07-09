package com.los.service;

import com.los.dto.EligibilityResult;
import com.los.entity.Customer;

import java.math.BigDecimal;

public interface EligibilityService {

    EligibilityResult evaluate(Customer customer, BigDecimal requestedAmount, Long currentLoanApplicationId);
}
