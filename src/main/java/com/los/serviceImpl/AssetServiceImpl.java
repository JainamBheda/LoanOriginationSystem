package com.los.serviceImpl;

import com.los.dto.AssetRequest;
import com.los.dto.AssetResponse;
import com.los.entity.Asset;
import com.los.entity.Customer;
import com.los.exception.ResourceNotFoundException;
import com.los.repository.AssetRepository;
import com.los.repository.CustomerRepository;
import com.los.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final CustomerRepository customerRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AssetResponse> getAllAssets() {
        return assetRepository.findAll()
                .stream()
                .map(AssetResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public AssetResponse createAsset(AssetRequest request) {
        Customer customer = findCustomer(request.customerId());
        Asset asset = Asset.builder()
                .customer(customer)
                .assetType(request.assetType())
                .assetValue(request.assetValue())
                .ownership(request.ownership().trim())
                .build();

        return AssetResponse.from(assetRepository.save(asset));
    }

    @Override
    @Transactional
    public AssetResponse updateAsset(Long id, AssetRequest request) {
        Asset asset = findAsset(id);
        Customer customer = findCustomer(request.customerId());

        asset.setCustomer(customer);
        asset.setAssetType(request.assetType());
        asset.setAssetValue(request.assetValue());
        asset.setOwnership(request.ownership().trim());

        return AssetResponse.from(assetRepository.save(asset));
    }

    @Override
    @Transactional
    public void deleteAsset(Long id) {
        Asset asset = findAsset(id);
        assetRepository.delete(asset);
    }

    private Asset findAsset(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
    }

    private Customer findCustomer(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
    }
}
