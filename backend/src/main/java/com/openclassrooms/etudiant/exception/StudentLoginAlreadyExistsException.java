package com.openclassrooms.etudiant.exception;

public class StudentLoginAlreadyExistsException extends RuntimeException {
    public StudentLoginAlreadyExistsException(String login) {
        super(String.format("Login %s already exists", login));
    }
}
