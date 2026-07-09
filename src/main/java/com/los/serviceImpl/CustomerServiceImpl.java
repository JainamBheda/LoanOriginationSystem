package com.los.serviceImpl;

import com.los.constants.UserRole;
import com.los.dto.CustomerRequest;
import com.los.dto.CustomerResponse;
import com.los.dto.CustomerSelfRequest;
import com.los.dto.UserResponse;
import com.los.entity.Customer;
import com.los.entity.User;
import com.los.exception.ResourceNotFoundException;
import com.los.repository.CustomerRepository;
import com.los.repository.UserRepository;
import com.los.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(CustomerResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        return CustomerResponse.from(findCustomer(id));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerByUserId(Long userId) {
        return customerRepository.findByUserId(userId)
                .map(CustomerResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user id: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAvailableCustomerUsers() {
        return userRepository.findByRoleWithoutCustomerProfile(UserRole.CUSTOMER)
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userId()));

        if (user.getRole() != UserRole.CUSTOMER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer profile can only be linked to CUSTOMER users");
        }

        validateUniqueFields(request, null);

        Customer customer = Customer.builder()
                .fullName(request.fullName().trim())
                .dob(request.dob())
                .pan(normalizePan(request.pan()))
                .aadhaar(request.aadhaar().trim())
                .phone(request.phone().trim())
                .email(normalizeEmail(request.email()))
                .address(request.address().trim())
                .occupation(request.occupation().trim())
                .annualIncome(request.annualIncome())
                .user(user)
                .build();

        return CustomerResponse.from(customerRepository.save(customer));
    }

    @Override
    @Transactional
    public CustomerResponse createMyProfile(Long userId, CustomerSelfRequest request) {
        if (customerRepository.existsByUserId(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Customer profile already exists");
        }
        return createCustomer(toCustomerRequest(userId, request));
    }

    @Override
    @Transactional
    public CustomerResponse updateMyProfile(Long userId, CustomerSelfRequest request) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user id: " + userId));
        return updateCustomer(customer.getId(), toCustomerRequest(userId, request));
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = findCustomer(id);
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userId()));

        validateUniqueFields(request, id);

        customer.setFullName(request.fullName().trim());
        customer.setDob(request.dob());
        customer.setPan(normalizePan(request.pan()));
        customer.setAadhaar(request.aadhaar().trim());
        customer.setPhone(request.phone().trim());
        customer.setEmail(normalizeEmail(request.email()));
        customer.setAddress(request.address().trim());
        customer.setOccupation(request.occupation().trim());
        customer.setAnnualIncome(request.annualIncome());
        customer.setUser(user);

        return CustomerResponse.from(customerRepository.save(customer));
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = findCustomer(id);
        customerRepository.delete(customer);
    }

    private Customer findCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    private void validateUniqueFields(CustomerRequest request, Long existingCustomerId) {
        String pan = normalizePan(request.pan());
        String aadhaar = request.aadhaar().trim();
        String email = normalizeEmail(request.email());
        Long userId = request.userId();

        boolean duplicateExists = existingCustomerId == null
                ? customerRepository.existsByPan(pan)
                || customerRepository.existsByAadhaar(aadhaar)
                || customerRepository.existsByEmail(email)
                || customerRepository.existsByUserId(userId)
                : customerRepository.existsByPanAndIdNot(pan, existingCustomerId)
                || customerRepository.existsByAadhaarAndIdNot(aadhaar, existingCustomerId)
                || customerRepository.existsByEmailAndIdNot(email, existingCustomerId)
                || customerRepository.existsByUserIdAndIdNot(userId, existingCustomerId);

        if (duplicateExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Customer unique field already exists");
        }
    }

    private String normalizePan(String pan) {
        return pan.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private CustomerRequest toCustomerRequest(Long userId, CustomerSelfRequest request) {
        return new CustomerRequest(
                request.fullName(),
                request.dob(),
                request.pan(),
                request.aadhaar(),
                request.phone(),
                request.email(),
                request.address(),
                request.occupation(),
                request.annualIncome(),
                userId
        );
    }
}
