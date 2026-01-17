package com.openclassrooms.etudiant.controller;

import com.openclassrooms.etudiant.dto.TokenValidationRequest;
import com.openclassrooms.etudiant.dto.TokenValidationResponse;
import com.openclassrooms.etudiant.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @PostMapping("/validate-token")
    public ResponseEntity<TokenValidationResponse> validateToken(@RequestBody TokenValidationRequest request) {
        boolean isValid = jwtService.validateToken(request.getToken());
        return ResponseEntity.ok(new TokenValidationResponse(isValid));
    }
}
