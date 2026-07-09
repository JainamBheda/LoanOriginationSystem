package com.los.service;

import com.los.dto.AssetRequest;
import com.los.dto.AssetResponse;

import java.util.List;

public interface AssetService {

    List<AssetResponse> getAllAssets();

    AssetResponse createAsset(AssetRequest request);

    AssetResponse updateAsset(Long id, AssetRequest request);

    void deleteAsset(Long id);
}
