package com.los.dto;

import com.los.constants.AssetType;
import com.los.entity.Asset;

import java.math.BigDecimal;

public record AssetResponse(
        Long id,
        CustomerSummaryResponse customer,
        AssetType assetType,
        BigDecimal assetValue,
        String ownership
) {

    public static AssetResponse from(Asset asset) {
        return new AssetResponse(
                asset.getId(),
                CustomerSummaryResponse.from(asset.getCustomer()),
                asset.getAssetType(),
                asset.getAssetValue(),
                asset.getOwnership()
        );
    }
}
