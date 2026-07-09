package com.los.dto;

import com.los.constants.UserRole;
import lombok.Builder;

@Builder
public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String fullName,
        String email,
        UserRole role
) {
}
