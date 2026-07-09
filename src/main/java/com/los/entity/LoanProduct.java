package com.los.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "loan_products")
public class LoanProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Loan name is required")
    @Column(nullable = false, unique = true, length = 120)
    private String loanName;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.01", message = "Interest rate must be greater than 0")
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @NotNull(message = "Maximum amount is required")
    @DecimalMin(value = "0.01", message = "Maximum amount must be greater than 0")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal maximumAmount;

    @NotNull(message = "Tenure months is required")
    @Min(value = 1, message = "Tenure months must be at least 1")
    @Column(nullable = false)
    private Integer tenureMonths;

    @NotNull(message = "Processing fee is required")
    @DecimalMin(value = "0.00", message = "Processing fee must not be negative")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal processingFee;
}
