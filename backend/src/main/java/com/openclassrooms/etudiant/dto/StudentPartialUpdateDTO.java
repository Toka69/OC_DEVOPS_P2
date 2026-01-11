package com.openclassrooms.etudiant.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentPartialUpdateDTO {
    private String firstName;
    private String lastName;
    private String login;
}
