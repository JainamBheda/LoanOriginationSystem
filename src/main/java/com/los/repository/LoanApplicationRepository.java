package com.los.repository;

import com.los.constants.LoanApplicationStatus;
import com.los.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

    List<LoanApplication> findByCustomerId(Long customerId);

    long countByStatus(LoanApplicationStatus status);

    boolean existsByCustomerIdAndStatus(Long customerId, LoanApplicationStatus status);

    boolean existsByCustomerIdAndStatusAndIdNot(Long customerId, LoanApplicationStatus status, Long id);

    @Query("select coalesce(sum(loan.approvedAmount), 0) from LoanApplication loan where loan.status = com.los.constants.LoanApplicationStatus.APPROVED")
    BigDecimal sumApprovedAmountForApprovedLoans();
}
