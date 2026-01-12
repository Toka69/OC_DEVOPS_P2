package com.openclassrooms.etudiant.exception;

public class StudentLoginAlreadyExistsException extends RuntimeException {
    public StudentLoginAlreadyExistsException(String login) {
        super("Student login already exists: " + login);
    }
}
