package com.los.dto;

import com.los.constants.AssetType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record AssetRequest(
        @NotNull(message = "Customer id is required")
        Long customerId,

        @NotNull(message = "Asset type is required")
        AssetType assetType,

        @NotNull(message = "Asset value is required")
        @DecimalMin(value = "0.01", message = "Asset value must be greater than 0")
        BigDecimal assetValue,

        @NotBlank(message = "Ownership is required")
        @Size(max = 120, message = "Ownership must not exceed 120 characters")
        String ownership
) {
}
