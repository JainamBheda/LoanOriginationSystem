package com.los.controller;

import com.los.dto.CustomerRequest;
import com.los.dto.CustomerResponse;
import com.los.dto.CustomerSelfRequest;
import com.los.dto.UserResponse;
import com.los.security.CustomUserDetails;
import com.los.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/me")
    public ResponseEntity<CustomerResponse> getCurrentCustomer(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(customerService.getCustomerByUserId(userDetails.getUser().getId()));
    }

    @GetMapping("/available-users")
    public ResponseEntity<List<UserResponse>> getAvailableCustomerUsers() {
        return ResponseEntity.ok(customerService.getAvailableCustomerUsers());
    }

    @PostMapping("/me")
    public ResponseEntity<CustomerResponse> createMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CustomerSelfRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(customerService.createMyProfile(userDetails.getUser().getId(), request));
    }

    @PutMapping("/me")
    public ResponseEntity<CustomerResponse> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CustomerSelfRequest request
    ) {
        return ResponseEntity.ok(customerService.updateMyProfile(userDetails.getUser().getId(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.createCustomer(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequest request
    ) {
        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
