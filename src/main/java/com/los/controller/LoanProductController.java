package com.los.controller;

import com.los.dto.LoanProductRequest;
import com.los.dto.LoanProductResponse;
import com.los.service.LoanProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/loan-products")
@RequiredArgsConstructor
public class LoanProductController {

    private final LoanProductService loanProductService;

    @GetMapping
    public ResponseEntity<List<LoanProductResponse>> getAllLoanProducts() {
        return ResponseEntity.ok(loanProductService.getAllLoanProducts());
    }

    @PostMapping
    public ResponseEntity<LoanProductResponse> createLoanProduct(@Valid @RequestBody LoanProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(loanProductService.createLoanProduct(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoanProductResponse> updateLoanProduct(
            @PathVariable Long id,
            @Valid @RequestBody LoanProductRequest request
    ) {
        return ResponseEntity.ok(loanProductService.updateLoanProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoanProduct(@PathVariable Long id) {
        loanProductService.deleteLoanProduct(id);
        return ResponseEntity.noContent().build();
    }
}
