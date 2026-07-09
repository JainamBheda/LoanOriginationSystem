package com.los.serviceImpl;

import com.los.dto.CreditScoreRequest;
import com.los.dto.CreditScoreResponse;
import com.los.entity.CreditScore;
import com.los.entity.Customer;
import com.los.exception.ResourceNotFoundException;
import com.los.repository.CreditScoreRepository;
import com.los.repository.CustomerRepository;
import com.los.service.CreditScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreditScoreServiceImpl implements CreditScoreService {

    private final CreditScoreRepository creditScoreRepository;
    private final CustomerRepository customerRepository;

    @Override
    @Transactional(readOnly = true)
    public CreditScoreResponse getCreditScoreByCustomerId(Long customerId) {
        CreditScore creditScore = creditScoreRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Credit score not found for customer id: " + customerId
                ));
        return CreditScoreResponse.from(creditScore);
    }

    @Override
    @Transactional
    public CreditScoreResponse updateCreditScore(Long customerId, CreditScoreRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        CreditScore creditScore = creditScoreRepository.findByCustomerId(customerId)
                .orElseGet(() -> CreditScore.builder()
                        .customer(customer)
                        .build());

        creditScore.setCreditScore(request.creditScore());
        return CreditScoreResponse.from(creditScoreRepository.save(creditScore));
    }
}
