package com.los.service;

import com.los.dto.CustomerRequest;
import com.los.dto.CustomerResponse;
import com.los.dto.CustomerSelfRequest;
import com.los.dto.UserResponse;

import java.util.List;

public interface CustomerService {

    List<CustomerResponse> getAllCustomers();

    CustomerResponse getCustomerById(Long id);

    CustomerResponse getCustomerByUserId(Long userId);

    List<UserResponse> getAvailableCustomerUsers();

    CustomerResponse createCustomer(CustomerRequest request);

    CustomerResponse createMyProfile(Long userId, CustomerSelfRequest request);

    CustomerResponse updateMyProfile(Long userId, CustomerSelfRequest request);

    CustomerResponse updateCustomer(Long id, CustomerRequest request);

    void deleteCustomer(Long id);
}
