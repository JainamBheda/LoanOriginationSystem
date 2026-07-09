package com.los.repository;

import com.los.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    List<Asset> findByCustomerId(Long customerId);

    @Query("select coalesce(sum(asset.assetValue), 0) from Asset asset where asset.customer.id = :customerId")
    BigDecimal sumAssetValueByCustomerId(@Param("customerId") Long customerId);
}
