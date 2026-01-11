package com.openclassrooms.etudiant.controller;

import com.openclassrooms.etudiant.dto.*;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.mapper.StudentDtoMapper;
import com.openclassrooms.etudiant.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
        return studentService.getStudentById(id)
                .map(studentMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(
            @PathVariable Long id,
            @RequestBody @Valid StudentUpdateDTO studentUpdateDTO) {
        return studentService.getStudentById(id)
                .map(student -> {
                    studentMapper.updateStudentFromDTO(studentUpdateDTO, student);
                    Student updated = studentService.saveStudent(student);
                    return ResponseEntity.ok(studentMapper.toDTO(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<StudentDTO> partialUpdateStudent(
            @PathVariable Long id,
            @RequestBody StudentPartialUpdateDTO dto) {
        return studentService.getStudentById(id)
                .map(student -> {
                    if (dto.getFirstName() != null) {
                        student.setFirstName(dto.getFirstName());
                    }
                    if (dto.getLastName() != null) {
                        student.setLastName(dto.getLastName());
                    }
                    if (dto.getLogin() != null) {
                        student.setLogin(dto.getLogin());
                    }
                    Student updated = studentService.saveStudent(student);
                    return ResponseEntity.ok(studentMapper.toDTO(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        if (studentService.getStudentById(id).isPresent()) {
            studentService.deleteStudent(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
