package com.los.serviceImpl;

import com.los.constants.LoanApplicationStatus;
import com.los.dto.EligibilityResult;
import com.los.entity.CreditScore;
import com.los.entity.Customer;
import com.los.repository.AssetRepository;
import com.los.repository.CreditScoreRepository;
import com.los.repository.LoanApplicationRepository;
import com.los.service.EligibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EligibilityServiceImpl implements EligibilityService {

    private static final int MINIMUM_CREDIT_SCORE = 750;
    private static final BigDecimal MINIMUM_ANNUAL_INCOME = new BigDecimal("600000");

    private final CreditScoreRepository creditScoreRepository;
    private final AssetRepository assetRepository;
    private final LoanApplicationRepository loanApplicationRepository;

    @Override
    public EligibilityResult evaluate(Customer customer, BigDecimal requestedAmount, Long currentLoanApplicationId) {
        List<String> failures = new ArrayList<>();

        CreditScore creditScore = creditScoreRepository.findByCustomerId(customer.getId()).orElse(null);
        if (creditScore == null) {
            failures.add("Credit score is not available");
        } else if (creditScore.getCreditScore() < MINIMUM_CREDIT_SCORE) {
            failures.add("Credit score must be at least " + MINIMUM_CREDIT_SCORE);
        }

        if (customer.getAnnualIncome().compareTo(MINIMUM_ANNUAL_INCOME) < 0) {
            failures.add("Annual income must be at least " + MINIMUM_ANNUAL_INCOME);
        }

        BigDecimal totalAssetValue = assetRepository.sumAssetValueByCustomerId(customer.getId());
        if (totalAssetValue.compareTo(requestedAmount) <= 0) {
            failures.add("Total asset value must be greater than requested loan amount");
        }

        if (hasActiveApprovedLoan(customer.getId(), currentLoanApplicationId)) {
            failures.add("Customer already has an active approved loan");
        }

        if (failures.isEmpty()) {
            return new EligibilityResult(
                    LoanApplicationStatus.ELIGIBLE,
                    "Eligible: credit score, annual income, asset value, and active loan checks passed"
            );
        }

        return new EligibilityResult(LoanApplicationStatus.NOT_ELIGIBLE, String.join("; ", failures));
    }

    private boolean hasActiveApprovedLoan(Long customerId, Long currentLoanApplicationId) {
        if (currentLoanApplicationId == null) {
            return loanApplicationRepository.existsByCustomerIdAndStatus(customerId, LoanApplicationStatus.APPROVED);
        }
        return loanApplicationRepository.existsByCustomerIdAndStatusAndIdNot(
                customerId,
                LoanApplicationStatus.APPROVED,
                currentLoanApplicationId
        );
    }
}
