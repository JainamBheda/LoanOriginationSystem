package com.los.repository;

import com.los.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByUserId(Long userId);

    boolean existsByPan(String pan);

    boolean existsByAadhaar(String aadhaar);

    boolean existsByEmail(String email);

    boolean existsByUserId(Long userId);

    boolean existsByPanAndIdNot(String pan, Long id);

    boolean existsByAadhaarAndIdNot(String aadhaar, Long id);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByUserIdAndIdNot(Long userId, Long id);
}
