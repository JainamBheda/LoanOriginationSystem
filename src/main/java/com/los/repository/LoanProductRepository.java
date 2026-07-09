package com.los.repository;

import com.los.entity.LoanProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanProductRepository extends JpaRepository<LoanProduct, Long> {

    boolean existsByLoanNameIgnoreCase(String loanName);

    boolean existsByLoanNameIgnoreCaseAndIdNot(String loanName, Long id);
}
