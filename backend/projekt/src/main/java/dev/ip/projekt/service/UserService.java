package dev.ip.projekt.service;

import dev.ip.projekt.model.dto.UserLoginDTO;
import dev.ip.projekt.model.dto.UserRegistrationDTO;

import dev.ip.projekt.model.entity_new.CustomerAccount;
import dev.ip.projekt.repository.CustomerAccountDAO;
import dev.ip.projekt.repository.CustomerDAO;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


import java.util.Optional;

@Service
public class UserService{

    private final CustomerDAO customerDAO;
    private final CustomerAccountDAO customerAccountDAO;
    private final BCryptPasswordEncoder passwordEncoder;


    public UserService(CustomerDAO customerDAO, CustomerAccountDAO customerAccountDAO){
        this.customerDAO = customerDAO;
        this.customerAccountDAO = customerAccountDAO;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public CustomerAccount register(UserRegistrationDTO dto) {
        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        CustomerAccount accout = new CustomerAccount();
        accout.setAccountId(dto.getUsername());
        accout.setLogin(dto.getUsername());
        accout.setPasswordHash(hashedPassword);
        accout.setEmail(dto.getEmail());

        return customerAccountDAO.save(accout);
    }

    public Optional<CustomerAccount> login(UserLoginDTO dto) {
        return customerAccountDAO.findByEmail(dto.getEmail()).filter(user -> passwordEncoder.matches(dto.getPassword(), user.getPasswordHash()));
    }

    public String findUserIdByEmail(String email) {
        return customerAccountDAO.findByEmail(email)
                .map(CustomerAccount::getAccountId)
                .orElse(null);
    }

}