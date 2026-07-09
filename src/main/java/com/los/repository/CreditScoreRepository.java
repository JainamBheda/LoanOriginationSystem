package com.los.repository;

import com.los.entity.CreditScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CreditScoreRepository extends JpaRepository<CreditScore, Long> {

    Optional<CreditScore> findByCustomerId(Long customerId);

    boolean existsByCustomerId(Long customerId);

    @Query("select coalesce(avg(score.creditScore), 0) from CreditScore score")
    Double averageCreditScore();
}
