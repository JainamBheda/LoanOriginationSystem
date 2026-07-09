package com.los.serviceImpl;

import com.los.constants.LoanApplicationStatus;
import com.los.dto.DashboardResponse;
import com.los.repository.CreditScoreRepository;
import com.los.repository.CustomerRepository;
import com.los.repository.LoanApplicationRepository;
import com.los.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final CustomerRepository customerRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final CreditScoreRepository creditScoreRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardSummary() {
        long totalCustomers = customerRepository.count();
        long pendingLoans = loanApplicationRepository.countByStatus(LoanApplicationStatus.PENDING)
                + loanApplicationRepository.countByStatus(LoanApplicationStatus.ELIGIBLE)
                + loanApplicationRepository.countByStatus(LoanApplicationStatus.NOT_ELIGIBLE)
                + loanApplicationRepository.countByStatus(LoanApplicationStatus.ON_HOLD);
        long approvedLoans = loanApplicationRepository.countByStatus(LoanApplicationStatus.APPROVED);
        long rejectedLoans = loanApplicationRepository.countByStatus(LoanApplicationStatus.REJECTED);
        BigDecimal totalSanctionedAmount = loanApplicationRepository.sumApprovedAmountForApprovedLoans();
        Double averageCreditScore = creditScoreRepository.averageCreditScore();

        return new DashboardResponse(
                totalCustomers,
                pendingLoans,
                approvedLoans,
                rejectedLoans,
                totalSanctionedAmount,
                averageCreditScore
        );
    }
}
