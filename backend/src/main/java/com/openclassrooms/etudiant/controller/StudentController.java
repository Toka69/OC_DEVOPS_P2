package com.openclassrooms.etudiant.controller;

import com.openclassrooms.etudiant.dto.StudentCreateDTO;
import com.openclassrooms.etudiant.dto.StudentDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.mapper.StudentDtoMapper;
import com.openclassrooms.etudiant.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentDtoMapper studentMapper;

    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@RequestBody @Valid StudentCreateDTO studentCreateDTO) {
        Student student = studentMapper.toEntity(studentCreateDTO);

        Student savedStudent = studentService.saveStudent(student);

        StudentDTO studentDTO = studentMapper.toDTO(savedStudent);

        return ResponseEntity.ok(studentDTO);
    }
}
