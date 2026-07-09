package com.los.serviceImpl;

import com.los.constants.LoanApplicationStatus;
import com.los.dto.EligibilityResult;
import com.los.dto.LoanApplicationRequest;
import com.los.dto.LoanApplicationResponse;
import com.los.dto.LoanDecisionRequest;
import com.los.entity.Customer;
import com.los.entity.LoanApplication;
import com.los.entity.LoanProduct;
import com.los.exception.ResourceNotFoundException;
import com.los.repository.CustomerRepository;
import com.los.repository.LoanApplicationRepository;
import com.los.repository.LoanProductRepository;
import com.los.service.EligibilityService;
import com.los.service.LoanApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoanApplicationServiceImpl implements LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final CustomerRepository customerRepository;
    private final LoanProductRepository loanProductRepository;
    private final EligibilityService eligibilityService;
    private static final Set<LoanApplicationStatus> DECISION_ALLOWED_STATUSES = EnumSet.of(
            LoanApplicationStatus.PENDING,
            LoanApplicationStatus.ELIGIBLE,
            LoanApplicationStatus.NOT_ELIGIBLE,
            LoanApplicationStatus.ON_HOLD
    );

    @Override
    @Transactional
    public LoanApplicationResponse applyForLoan(LoanApplicationRequest request) {
        Customer customer = findCustomer(request.customerId());
        LoanProduct loanProduct = findLoanProduct(request.loanProductId());
        validateLoanAmountAndTenure(request, loanProduct);
        EligibilityResult eligibilityResult = eligibilityService.evaluate(customer, request.requestedAmount(), null);

        LoanApplication loanApplication = LoanApplication.builder()
                .customer(customer)
                .loanProduct(loanProduct)
                .requestedAmount(request.requestedAmount())
                .approvedAmount(request.approvedAmount())
                .tenure(request.tenure())
                .applicationDate(LocalDateTime.now())
                .status(eligibilityResult.status())
                .remarks(mergeRemarks(eligibilityResult.remarks(), request.remarks()))
                .build();

        LoanApplication savedApplication = loanApplicationRepository.save(loanApplication);
        log.info(
                "Loan application submitted: id={}, customerId={}, loanProductId={}, amount={}",
                savedApplication.getId(),
                customer.getId(),
                loanProduct.getId(),
                savedApplication.getRequestedAmount()
        );
        return LoanApplicationResponse.from(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoanApplicationResponse> getAllLoanApplications() {
        return loanApplicationRepository.findAll()
                .stream()
                .map(LoanApplicationResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LoanApplicationResponse getLoanApplicationById(Long id) {
        return LoanApplicationResponse.from(findLoanApplication(id));
    }

    @Override
    @Transactional
    public LoanApplicationResponse updateLoanApplication(Long id, LoanApplicationRequest request) {
        LoanApplication loanApplication = findLoanApplication(id);
        Customer customer = findCustomer(request.customerId());
        LoanProduct loanProduct = findLoanProduct(request.loanProductId());
        validateLoanAmountAndTenure(request, loanProduct);
        EligibilityResult eligibilityResult = eligibilityService.evaluate(
                customer,
                request.requestedAmount(),
                loanApplication.getId()
        );

        loanApplication.setCustomer(customer);
        loanApplication.setLoanProduct(loanProduct);
        loanApplication.setRequestedAmount(request.requestedAmount());
        loanApplication.setApprovedAmount(request.approvedAmount());
        loanApplication.setTenure(request.tenure());
        loanApplication.setStatus(eligibilityResult.status());
        loanApplication.setRemarks(mergeRemarks(eligibilityResult.remarks(), request.remarks()));

        return LoanApplicationResponse.from(loanApplicationRepository.save(loanApplication));
    }

    @Override
    @Transactional
    public void deleteLoanApplication(Long id) {
        LoanApplication loanApplication = findLoanApplication(id);
        loanApplicationRepository.delete(loanApplication);
    }

    @Override
    @Transactional
    public LoanApplicationResponse approveLoan(Long id, LoanDecisionRequest request) {
        LoanApplication loanApplication = findLoanApplication(id);
        validateDecisionAllowed(loanApplication);

        if (loanApplication.getStatus() != LoanApplicationStatus.ELIGIBLE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only eligible loans can be approved");
        }

        BigDecimal approvedAmount = request.approvedAmount() == null
                ? loanApplication.getRequestedAmount()
                : request.approvedAmount();
        if (approvedAmount.compareTo(loanApplication.getRequestedAmount()) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Approved amount cannot exceed requested amount");
        }

        loanApplication.setApprovedAmount(approvedAmount);
        loanApplication.setStatus(LoanApplicationStatus.APPROVED);
        loanApplication.setRemarks(decisionRemarks("Approved", request.remarks(), loanApplication.getRemarks()));

        LoanApplication savedApplication = loanApplicationRepository.save(loanApplication);
        log.info(
                "Loan approved: id={}, customerId={}, approvedAmount={}",
                savedApplication.getId(),
                savedApplication.getCustomer().getId(),
                savedApplication.getApprovedAmount()
        );
        return LoanApplicationResponse.from(savedApplication);
    }

    @Override
    @Transactional
    public LoanApplicationResponse rejectLoan(Long id, LoanDecisionRequest request) {
        LoanApplication loanApplication = findLoanApplication(id);
        validateDecisionAllowed(loanApplication);

        loanApplication.setApprovedAmount(null);
        loanApplication.setStatus(LoanApplicationStatus.REJECTED);
        loanApplication.setRemarks(decisionRemarks("Rejected", request.remarks(), loanApplication.getRemarks()));

        LoanApplication savedApplication = loanApplicationRepository.save(loanApplication);
        log.info("Loan rejected: id={}, customerId={}", savedApplication.getId(), savedApplication.getCustomer().getId());
        return LoanApplicationResponse.from(savedApplication);
    }

    @Override
    @Transactional
    public LoanApplicationResponse holdLoan(Long id, LoanDecisionRequest request) {
        LoanApplication loanApplication = findLoanApplication(id);
        validateDecisionAllowed(loanApplication);

        loanApplication.setStatus(LoanApplicationStatus.ON_HOLD);
        loanApplication.setRemarks(decisionRemarks("On hold", request.remarks(), loanApplication.getRemarks()));

        LoanApplication savedApplication = loanApplicationRepository.save(loanApplication);
        log.info("Loan put on hold: id={}, customerId={}", savedApplication.getId(), savedApplication.getCustomer().getId());
        return LoanApplicationResponse.from(savedApplication);
    }

    private LoanApplication findLoanApplication(Long id) {
        return loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + id));
    }

    private Customer findCustomer(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
    }

    private LoanProduct findLoanProduct(Long loanProductId) {
        return loanProductRepository.findById(loanProductId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan product not found with id: " + loanProductId));
    }

    private void validateLoanAmountAndTenure(LoanApplicationRequest request, LoanProduct loanProduct) {
        if (request.requestedAmount().compareTo(loanProduct.getMaximumAmount()) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Requested amount exceeds product maximum amount"
            );
        }
        if (request.tenure() > loanProduct.getTenureMonths()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Requested tenure exceeds product maximum tenure"
            );
        }
    }

    private String trimToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }

    private String mergeRemarks(String eligibilityRemarks, String userRemarks) {
        String trimmedUserRemarks = trimToNull(userRemarks);
        if (trimmedUserRemarks == null) {
            return eligibilityRemarks;
        }
        return eligibilityRemarks + " | Notes: " + trimmedUserRemarks;
    }

    private void validateDecisionAllowed(LoanApplication loanApplication) {
        if (!DECISION_ALLOWED_STATUSES.contains(loanApplication.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Loan application has already reached a final decision"
            );
        }
    }

    private String decisionRemarks(String decision, String officerRemarks, String existingRemarks) {
        String trimmedOfficerRemarks = trimToNull(officerRemarks);
        String base = trimToNull(existingRemarks);
        String decisionText = trimmedOfficerRemarks == null
                ? decision
                : decision + ": " + trimmedOfficerRemarks;

        if (base == null) {
            return decisionText;
        }
        return base + " | Decision: " + decisionText;
    }
}
