package com.los.dto;

import com.los.entity.Customer;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CustomerResponse(
        Long id,
        String fullName,
        LocalDate dob,
        String pan,
        String aadhaar,
        String phone,
        String email,
        String address,
        String occupation,
        BigDecimal annualIncome,
        UserResponse user
) {

    public static CustomerResponse from(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getDob(),
                customer.getPan(),
                customer.getAadhaar(),
                customer.getPhone(),
                customer.getEmail(),
                customer.getAddress(),
                customer.getOccupation(),
                customer.getAnnualIncome(),
                UserResponse.from(customer.getUser())
        );
    }
}
