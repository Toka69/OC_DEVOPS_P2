package com.openclassrooms.etudiant.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretString", "votre_cle_secrete_super_longue_et_securisee_pour_le_test");
        jwtService.init();
    }

    @Test
    void shouldGenerateToken() {
        // GIVEN: A valid user details object
        UserDetails userDetails = new User("testUser", "password", Collections.emptyList());

        // WHEN: Generating a token for this user
        String token = jwtService.generateToken(userDetails);

        // THEN: The token should not be null or empty
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void shouldExtractUsername() {
        // GIVEN: A token generated for a specific username
        UserDetails userDetails = new User("john_doe", "password", Collections.emptyList());
        String token = jwtService.generateToken(userDetails);

        // WHEN: Extracting the username from the token
        String username = jwtService.getUsernameFromToken(token);

        // THEN: The extracted username must match the original one
        assertEquals("john_doe", username);
    }

    @Test
    void shouldValidateCorrectToken() {
        // GIVEN: A valid JWT token generated for a user
        UserDetails userDetails = new User("testUser", "password", Collections.emptyList());
        String token = jwtService.generateToken(userDetails);

        // WHEN: Validating the generated token
        boolean isValid = jwtService.validateToken(token);

        // THEN: The token should be recognized as valid
        assertTrue(isValid);
    }
}
