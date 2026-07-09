package com.los.serviceImpl;

import com.los.dto.LoanProductRequest;
import com.los.dto.LoanProductResponse;
import com.los.entity.LoanProduct;
import com.los.exception.ResourceNotFoundException;
import com.los.repository.LoanProductRepository;
import com.los.service.LoanProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanProductServiceImpl implements LoanProductService {

    private final LoanProductRepository loanProductRepository;

    @Override
    @Transactional(readOnly = true)
    public List<LoanProductResponse> getAllLoanProducts() {
        return loanProductRepository.findAll()
                .stream()
                .map(LoanProductResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public LoanProductResponse createLoanProduct(LoanProductRequest request) {
        validateUniqueLoanName(request.loanName(), null);

        LoanProduct loanProduct = LoanProduct.builder()
                .loanName(request.loanName().trim())
                .interestRate(request.interestRate())
                .maximumAmount(request.maximumAmount())
                .tenureMonths(request.tenureMonths())
                .processingFee(request.processingFee())
                .build();

        return LoanProductResponse.from(loanProductRepository.save(loanProduct));
    }

    @Override
    @Transactional
    public LoanProductResponse updateLoanProduct(Long id, LoanProductRequest request) {
        LoanProduct loanProduct = findLoanProduct(id);
        validateUniqueLoanName(request.loanName(), id);

        loanProduct.setLoanName(request.loanName().trim());
        loanProduct.setInterestRate(request.interestRate());
        loanProduct.setMaximumAmount(request.maximumAmount());
        loanProduct.setTenureMonths(request.tenureMonths());
        loanProduct.setProcessingFee(request.processingFee());

        return LoanProductResponse.from(loanProductRepository.save(loanProduct));
    }

    @Override
    @Transactional
    public void deleteLoanProduct(Long id) {
        LoanProduct loanProduct = findLoanProduct(id);
        loanProductRepository.delete(loanProduct);
    }

    private LoanProduct findLoanProduct(Long id) {
        return loanProductRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan product not found with id: " + id));
    }

    private void validateUniqueLoanName(String loanName, Long existingId) {
        String normalizedName = loanName.trim();
        boolean duplicateExists = existingId == null
                ? loanProductRepository.existsByLoanNameIgnoreCase(normalizedName)
                : loanProductRepository.existsByLoanNameIgnoreCaseAndIdNot(normalizedName, existingId);

        if (duplicateExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Loan product name already exists");
        }
    }
}
