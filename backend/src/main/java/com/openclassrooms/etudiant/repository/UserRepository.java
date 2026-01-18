package com.openclassrooms.etudiant.repository;

import com.openclassrooms.etudiant.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.login = :login AND TYPE(u) = User")
    Optional<User> findByLogin(@Param("login") String login);
}
