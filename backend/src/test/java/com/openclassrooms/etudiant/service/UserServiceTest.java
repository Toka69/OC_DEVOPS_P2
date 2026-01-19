package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class UserServiceTest {
    private static final String FIRST_NAME = "John";
    private static final String LAST_NAME = "Doe";
    private static final String LOGIN = "LOGIN";
    private static final String PASSWORD = "PASSWORD";

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private StudentService studentService;

    @InjectMocks
    private UserService userService;

    @Test
    public void test_create_null_user_throws_IllegalArgumentException() {
        // GIVEN: No user object is provided

        // WHEN: Attempting to register a null user
        // THEN: An IllegalArgumentException should be thrown
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> userService.register(null));
    }

    @Test
    public void test_create_already_exist_user_throws_IllegalArgumentException() {
        // GIVEN: A user object with a login that already exists in the repository
        User user = new User();
        user.setLogin(LOGIN);

        // Mocking the repository to return an existing user for the given login
        when(userRepository.findByLogin(LOGIN)).thenReturn(Optional.of(user));

        // WHEN: Attempting to register the user
        // THEN: An IllegalArgumentException should be thrown because the login is already taken
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> userService.register(user));
    }

    @Test
    public void test_create_user_successful() {
        // GIVEN: A valid new user with a unique login
        User user = new User();
        user.setFirstName(FIRST_NAME);
        user.setLastName(LAST_NAME);
        user.setLogin(LOGIN);
        user.setPassword(PASSWORD);

        // Mocking dependencies: login is available in both user and student tables
        when(userRepository.findByLogin(LOGIN)).thenReturn(Optional.empty());
        when(studentService.existsByLogin(LOGIN)).thenReturn(false);
        when(passwordEncoder.encode(PASSWORD)).thenReturn("encodedPassword");

        // WHEN: Registering the new user
        userService.register(user);

        // THEN: The password should be encoded and the user must be saved in the repository
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getPassword()).isEqualTo("encodedPassword");
        assertThat(userCaptor.getValue().getLogin()).isEqualTo(LOGIN);
    }

    @Test
    public void test_login_successful() {
        // GIVEN: An existing user with correct credentials
        User user = new User();
        user.setLogin(LOGIN);
        user.setPassword("encodedPassword");

        // Mocking dependencies for successful authentication and token generation
        when(userRepository.findByLogin(LOGIN)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(PASSWORD, "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(any())).thenReturn("mocked-jwt-token");

        // WHEN: Attempting to log in with valid credentials
        String token = userService.login(LOGIN, PASSWORD);

        // THEN: A valid JWT token should be returned
        assertThat(token).isEqualTo("mocked-jwt-token");
        verify(jwtService).generateToken(any());
    }

    @Test
    public void test_login_invalid_password_throws_IllegalArgumentException() {
        // GIVEN: A user exists but provides an incorrect password
        User user = new User();
        user.setLogin(LOGIN);
        user.setPassword("encodedPassword");

        when(userRepository.findByLogin(LOGIN)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(PASSWORD, "encodedPassword")).thenReturn(false);

        // WHEN: Attempting to log in
        // THEN: An IllegalArgumentException should be thrown due to invalid credentials
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> userService.login(LOGIN, PASSWORD));
    }

    @Test
    public void test_login_user_not_found_throws_IllegalArgumentException() {
        // GIVEN: A login that does not exist in the database
        when(userRepository.findByLogin(LOGIN)).thenReturn(Optional.empty());

        // WHEN: Attempting to log in with a non-existent user
        // THEN: An IllegalArgumentException should be thrown
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> userService.login(LOGIN, PASSWORD));
    }
}
