package com.los.repository;

import com.los.constants.UserRole;
import com.los.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    @Query("""
            SELECT u FROM User u
            WHERE u.role = :role
            AND u.id NOT IN (SELECT c.user.id FROM Customer c)
            """)
    List<User> findByRoleWithoutCustomerProfile(@Param("role") UserRole role);
}
