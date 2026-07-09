package com.los.controller;

import com.los.dto.CreditScoreRequest;
import com.los.dto.CreditScoreResponse;
import com.los.service.CreditScoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/creditscore")
@RequiredArgsConstructor
public class CreditScoreController {

    private final CreditScoreService creditScoreService;

    @GetMapping("/{customerId}")
    public ResponseEntity<CreditScoreResponse> getCreditScoreByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(creditScoreService.getCreditScoreByCustomerId(customerId));
    }

    @PutMapping("/{customerId}")
    public ResponseEntity<CreditScoreResponse> updateCreditScore(
            @PathVariable Long customerId,
            @Valid @RequestBody CreditScoreRequest request
    ) {
        return ResponseEntity.ok(creditScoreService.updateCreditScore(customerId, request));
    }
}
