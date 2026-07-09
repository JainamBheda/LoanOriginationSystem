package com.los.dto;

import com.los.entity.Customer;

public record CustomerSummaryResponse(
        Long id,
        String fullName,
        String pan,
        String email
) {

    public static CustomerSummaryResponse from(Customer customer) {
        return new CustomerSummaryResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getPan(),
                customer.getEmail()
        );
    }
}
