package dev.ip.projekt.service;

import dev.ip.projekt.model.dto.UserLoginDTO;
import dev.ip.projekt.model.dto.UserRegistrationDTO;
import dev.ip.projekt.model.entity.UserAccount;
import dev.ip.projekt.repository.UserDAO;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


import java.util.Optional;

@Service
public class UserService{
    private final UserDAO userDAO;
    private final BCryptPasswordEncoder passwordEncoder;


    public UserService(UserDAO userDAO){
        this.userDAO = userDAO;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public UserAccount register(UserRegistrationDTO dto) {
        String hashedPassword = passwordEncoder.encode(dto.getPassword());


        UserAccount user = new UserAccount(dto.getUsername(), dto.getEmail(), hashedPassword);
        return userDAO.save(user);
    }

    public Optional<UserAccount> login(UserLoginDTO dto) {
        return userDAO.findByEmail(dto.getEmail()).filter(user -> passwordEncoder.matches(dto.getPassword(), user.getPassword()));
    }
}