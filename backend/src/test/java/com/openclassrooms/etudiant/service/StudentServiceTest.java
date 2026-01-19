package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private StudentService studentService;

    @Test
    void shouldGetAllStudents() {
        // GIVEN: The repository contains two students
        Student s1 = new Student(); s1.setFirstName("Alice");
        Student s2 = new Student(); s2.setFirstName("Bob");
        when(studentRepository.findAll()).thenReturn(Arrays.asList(s1, s2));

        // WHEN: Requesting the list of all students
        List<Student> students = studentService.getAllStudents();

        // THEN: We should receive exactly two students
        assertEquals(2, students.size());
        verify(studentRepository, times(1)).findAll();
    }

    @Test
    void shouldGetStudentById() {
        // GIVEN: An existing student in the repository with a specific ID
        Student student = new Student();
        student.setId(1L);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        // WHEN: Requesting the student by their ID
        Optional<Student> found = studentService.getStudentById(1L);

        // THEN: The student should be found and the ID must match
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }

    @Test
    void shouldSaveStudent() {
        // GIVEN: A new student with a plain text password
        Student student = new Student();
        student.setFirstName("Charlie");
        student.setPassword("plainPassword");

        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        // WHEN: Saving the student via the service
        Student saved = studentService.saveStudent(student);

        // THEN: The password must be encoded and the saved student returned correctly
        assertNotNull(saved);
        assertEquals("encodedPassword", saved.getPassword());
        assertEquals("Charlie", saved.getFirstName());
        verify(passwordEncoder).encode("plainPassword");
        verify(studentRepository).save(student);
    }
}
