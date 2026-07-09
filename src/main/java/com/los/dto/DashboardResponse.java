package com.los.dto;

import java.math.BigDecimal;

public record DashboardResponse(
        long totalCustomers,
        long pendingLoans,
        long approvedLoans,
        long rejectedLoans,
        BigDecimal totalSanctionedAmount,
        Double averageCreditScore
) {
}
