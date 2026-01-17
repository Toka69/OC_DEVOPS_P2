package com.openclassrooms.etudiant.dto;

public class TokenValidationResponse {
    private boolean isValid;

    public TokenValidationResponse(boolean isValid) {
        this.isValid = isValid;
    }

    public boolean isValid() {
        return isValid;
    }
}
