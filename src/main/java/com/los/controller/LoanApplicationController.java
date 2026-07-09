package com.los.controller;

import com.los.dto.LoanApplicationRequest;
import com.los.dto.LoanApplicationResponse;
import com.los.dto.LoanDecisionRequest;
import com.los.service.LoanApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/loan")
@RequiredArgsConstructor
public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;

    @PostMapping("/apply")
    public ResponseEntity<LoanApplicationResponse> applyForLoan(
            @Valid @RequestBody LoanApplicationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(loanApplicationService.applyForLoan(request));
    }

    @GetMapping
    public ResponseEntity<List<LoanApplicationResponse>> getAllLoanApplications() {
        return ResponseEntity.ok(loanApplicationService.getAllLoanApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanApplicationResponse> getLoanApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.getLoanApplicationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoanApplicationResponse> updateLoanApplication(
            @PathVariable Long id,
            @Valid @RequestBody LoanApplicationRequest request
    ) {
        return ResponseEntity.ok(loanApplicationService.updateLoanApplication(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoanApplication(@PathVariable Long id) {
        loanApplicationService.deleteLoanApplication(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('BANK_OFFICER', 'ADMIN')")
    public ResponseEntity<LoanApplicationResponse> approveLoan(
            @PathVariable Long id,
            @Valid @RequestBody LoanDecisionRequest request
    ) {
        return ResponseEntity.ok(loanApplicationService.approveLoan(id, request));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('BANK_OFFICER', 'ADMIN')")
    public ResponseEntity<LoanApplicationResponse> rejectLoan(
            @PathVariable Long id,
            @Valid @RequestBody LoanDecisionRequest request
    ) {
        return ResponseEntity.ok(loanApplicationService.rejectLoan(id, request));
    }

    @PutMapping("/{id}/hold")
    @PreAuthorize("hasAnyRole('BANK_OFFICER', 'ADMIN')")
    public ResponseEntity<LoanApplicationResponse> holdLoan(
            @PathVariable Long id,
            @Valid @RequestBody LoanDecisionRequest request
    ) {
        return ResponseEntity.ok(loanApplicationService.holdLoan(id, request));
    }
}
