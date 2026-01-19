package com.openclassrooms.etudiant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.etudiant.dto.StudentCreateDTO;
import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.UserRepository;
import com.openclassrooms.etudiant.repository.StudentRepository;
import com.openclassrooms.etudiant.service.JwtService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import com.openclassrooms.etudiant.dto.StudentPartialUpdateDTO;

import java.util.Collections;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
public class StudentControllerTest {

    private static final String URL = "/api/students";
    private String token;

    @Container
    static MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8");

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private JwtService jwtService;

    @DynamicPropertySource
    static void configureTestProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mySQLContainer::getUsername);
        registry.add("spring.datasource.password", mySQLContainer::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create");
    }

    @BeforeEach
    public void setUp() {
        User user = new User();
        user.setFirstName("Admin");
        user.setLastName("User");
        user.setLogin("admin");
        user.setPassword("password");
        userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("admin")
                .password("password")
                .authorities(Collections.emptyList())
                .build();
        token = jwtService.generateToken(userDetails);
    }

    @AfterEach
    public void tearDown() {
        studentRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void createStudentSuccessful() throws Exception {
        // GIVEN: A valid and complete StudentCreateDTO
        StudentCreateDTO dto = new StudentCreateDTO();
        dto.setFirstName("Alice");
        dto.setLastName("Wonderland");
        dto.setLogin("alice_w");
        dto.setPassword("secret123");

        // WHEN: Sending an authenticated POST request to create the student
        mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .header("Authorization", "Bearer " + token)
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                // THEN: The server should return 200 OK and the created student data
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Alice"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("alice_w"));
    }

    @Test
    public void getAllStudentsSuccessful() throws Exception {
        // GIVEN: An authenticated user with a valid token

        // WHEN: Sending an authenticated GET request to retrieve all students
        mockMvc.perform(MockMvcRequestBuilders.get(URL)
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                // THEN: The server should return 200 OK and an array of students
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray());
    }

    @Test
    public void getStudentsWithoutAuthShouldReturn401() throws Exception {
        // GIVEN: No authentication token is provided

        // WHEN: Sending a GET request to the protected students endpoint
        mockMvc.perform(MockMvcRequestBuilders.get(URL))
                // THEN: The server should return 401 Unauthorized status
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    public void getStudentByIdSuccessful() throws Exception {
        // GIVEN: A student is first created in the database
        StudentCreateDTO dto = new StudentCreateDTO();
        dto.setFirstName("Bob");
        dto.setLastName("Marley");
        dto.setLogin("bob_m");
        dto.setPassword("reggae");

        String response = mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .header("Authorization", "Bearer " + token)
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andReturn().getResponse().getContentAsString();

        Long id = objectMapper.readTree(response).get("id").asLong();

        // WHEN: Sending an authenticated GET request for this student's ID
        mockMvc.perform(MockMvcRequestBuilders.get(URL + "/" + id)
                        .header("Authorization", "Bearer " + token))
                // THEN: The server should return 200 OK and the correct student details
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Bob"));
    }

    @Test
    public void deleteStudentSuccessful() throws Exception {
        // GIVEN: A student is first created to ensure it exists in the database
        StudentCreateDTO dto = new StudentCreateDTO();
        dto.setFirstName("To Delete");
        dto.setLastName("Student");
        dto.setLogin("delete_me");
        dto.setPassword("pass");

        String response = mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .header("Authorization", "Bearer " + token)
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andReturn().getResponse().getContentAsString();

        // Extracting the real ID generated by the database
        Long id = objectMapper.readTree(response).get("id").asLong();

        // WHEN: Sending an authenticated DELETE request for this specific student
        mockMvc.perform(MockMvcRequestBuilders.delete(URL + "/" + id)
                        .header("Authorization", "Bearer " + token))
                // THEN: The server should return 204 No Content
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    public void partialUpdateStudentSuccessful() throws Exception {
        // GIVEN: An existing student in the database
        StudentCreateDTO createDto = new StudentCreateDTO();
        createDto.setFirstName("Before");
        createDto.setLastName("Patch");
        createDto.setLogin("patch_me");
        createDto.setPassword("pass");

        String createResponse = mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .header("Authorization", "Bearer " + token)
                        .content(objectMapper.writeValueAsString(createDto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andReturn().getResponse().getContentAsString();
        Long id = objectMapper.readTree(createResponse).get("id").asLong();

        // WHEN: Performing a partial update (PATCH) on the first name and last name
        StudentPartialUpdateDTO patchDto = new StudentPartialUpdateDTO();
        patchDto.setFirstName("After");

        mockMvc.perform(MockMvcRequestBuilders.patch(URL + "/" + id)
                        .header("Authorization", "Bearer " + token)
                        .content(objectMapper.writeValueAsString(patchDto))
                        .contentType(MediaType.APPLICATION_JSON))
                // THEN: The fields should be updated accordingly
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("After"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Patch")); // Le nom n'a pas dû changer
    }
}
