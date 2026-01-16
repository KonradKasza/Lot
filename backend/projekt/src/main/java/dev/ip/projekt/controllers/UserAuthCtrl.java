package dev.ip.projekt.controllers;

import dev.ip.projekt.model.entity_new.CustomerAccount;
import dev.ip.projekt.service.JwtService;
import dev.ip.projekt.model.dto.UserLoginDTO;
import dev.ip.projekt.model.dto.UserRegistrationDTO;
import dev.ip.projekt.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import dev.ip.projekt.model.dto.JwtResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // allow React dev server
public class UserAuthCtrl {
    private final UserService userService;
    private final JwtService jwtService;

    public UserAuthCtrl(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<CustomerAccount> register(@RequestBody UserRegistrationDTO dto) {
        System.out.println("registering : " + dto.toString());
        CustomerAccount saved = userService.register(dto);
        return ResponseEntity.ok(saved);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<JwtResponse> login(@RequestBody UserLoginDTO dto) {

        System.out.println("login : " + dto.toString());

        return userService.login(dto)
                .map(user -> {
                    String token = jwtService.generateToken(user.getEmail());
                    return ResponseEntity.ok(new JwtResponse(token));
                })
                .orElseGet(() -> {
                    JwtResponse response = new JwtResponse();
                    response.setStatus(JwtResponse.Status.ERROR);
                    response.setMessage("Niepoprawne dane logowania");
                    return ResponseEntity.status(401).body(response);
                });
    }

}
