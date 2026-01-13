package com.openclassrooms.etudiant.dto;

import lombok.Data;

@Data
public class StudentUpdateDTO {
    private String firstName;
    private String lastName;
    private String login;
}
