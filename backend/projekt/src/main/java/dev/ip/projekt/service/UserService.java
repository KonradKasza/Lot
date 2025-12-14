package dev.ip.projekt.service;

import dev.ip.projekt.model.dto.UserLoginDTO;
import dev.ip.projekt.model.dto.UserRegistrationDTO;
import dev.ip.projekt.model.entity.UserAccount;
import dev.ip.projekt.repository.UserDAO;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService{
    private final UserDAO userDAO;

    public UserService(UserDAO userDAO){
        this.userDAO = userDAO;
    }

    public UserAccount register(UserRegistrationDTO dto) {
        //Dodac hashowanie hasla przed zapisaniem w bazie


        UserAccount user = new UserAccount(dto.getUsername(), dto.getEmail(), dto.getPassword());
        return userDAO.save(user);
    }

    public Optional<UserAccount> login(UserLoginDTO dto) {
        return userDAO.findByEmail(dto.getEmail()).filter(user -> user.getPassword().equals(dto.getPassword()));
    }
}