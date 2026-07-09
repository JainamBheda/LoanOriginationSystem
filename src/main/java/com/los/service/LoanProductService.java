package com.los.service;

import com.los.dto.LoanProductRequest;
import com.los.dto.LoanProductResponse;

import java.util.List;

public interface LoanProductService {

    List<LoanProductResponse> getAllLoanProducts();

    LoanProductResponse createLoanProduct(LoanProductRequest request);

    LoanProductResponse updateLoanProduct(Long id, LoanProductRequest request);

    void deleteLoanProduct(Long id);
}
