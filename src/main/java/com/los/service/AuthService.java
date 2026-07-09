package com.los.service;

import com.los.dto.AuthResponse;
import com.los.dto.LoginRequest;
import com.los.dto.SignupRequest;

public interface AuthService {

    AuthResponse signup(SignupRequest request);

    AuthResponse login(LoginRequest request);
}
