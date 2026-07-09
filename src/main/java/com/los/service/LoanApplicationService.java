package com.los.service;

import com.los.dto.LoanApplicationRequest;
import com.los.dto.LoanApplicationResponse;
import com.los.dto.LoanDecisionRequest;

import java.util.List;

public interface LoanApplicationService {

    LoanApplicationResponse applyForLoan(LoanApplicationRequest request);

    List<LoanApplicationResponse> getAllLoanApplications();

    LoanApplicationResponse getLoanApplicationById(Long id);

    LoanApplicationResponse updateLoanApplication(Long id, LoanApplicationRequest request);

    void deleteLoanApplication(Long id);

    LoanApplicationResponse approveLoan(Long id, LoanDecisionRequest request);

    LoanApplicationResponse rejectLoan(Long id, LoanDecisionRequest request);

    LoanApplicationResponse holdLoan(Long id, LoanDecisionRequest request);
}
