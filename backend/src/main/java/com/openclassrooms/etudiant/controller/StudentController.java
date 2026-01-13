package com.openclassrooms.etudiant.controller;

import com.openclassrooms.etudiant.dto.*;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.exception.StudentLoginAlreadyExistsException;
import com.openclassrooms.etudiant.exception.StudentNotFoundException;
import com.openclassrooms.etudiant.mapper.StudentDtoMapper;
import com.openclassrooms.etudiant.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@PreAuthorize("hasAuthority('ROLE_User')")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentDtoMapper studentMapper;

    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@RequestBody @Valid StudentCreateDTO studentCreateDTO) {
        if (studentService.existsByLogin(studentCreateDTO.getLogin())) {
            throw new StudentLoginAlreadyExistsException(studentCreateDTO.getLogin());
        }

        Student student = studentMapper.toEntity(studentCreateDTO);
        Student savedStudent = studentService.saveStudent(student);

        return ResponseEntity.ok(studentMapper.toDTO(savedStudent));
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        List<StudentDTO> studentDTOs = students.stream()
                .map(studentMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(studentDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        return ResponseEntity.ok(studentMapper.toDTO(student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @RequestBody @Valid StudentUpdateDTO dto) {
        Student student = studentService.getStudentById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        studentMapper.updateStudentFromDTO(dto, student);
        Student updated = studentService.saveStudent(student);

        return ResponseEntity.ok(studentMapper.toDTO(updated));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<StudentDTO> partialUpdateStudent(
            @PathVariable Long id,
            @RequestBody StudentPartialUpdateDTO dto) {
            Student student = studentService.getStudentById(id)
                    .orElseThrow(() -> new StudentNotFoundException(id));

            if (dto.getFirstName() != null) student.setFirstName(dto.getFirstName());
            if (dto.getLastName() != null) student.setLastName(dto.getLastName());
            if (dto.getLogin() != null) student.setLogin(dto.getLogin());

            Student updated = studentService.saveStudent(student);

            return ResponseEntity.ok(studentMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.getStudentById(id).orElseThrow(() -> new StudentNotFoundException(id));
        studentService.deleteStudent(id);

        return ResponseEntity.noContent().build();
    }
}
