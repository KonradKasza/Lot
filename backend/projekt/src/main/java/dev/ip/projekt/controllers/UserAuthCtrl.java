package dev.ip.projekt.controllers;

import dev.ip.projekt.service.JwtService;
import dev.ip.projekt.model.dto.UserLoginDTO;
import dev.ip.projekt.model.dto.UserRegistrationDTO;
import dev.ip.projekt.model.entity.UserAccount;
import dev.ip.projekt.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // allow React dev server
public class UserAuthCtrl {
    private final UserService userService;
    private final JwtService jwtService;

    public UserAuthCtrl(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<UserAccount> register(@RequestBody UserRegistrationDTO dto) {
        UserAccount saved = userService.register(dto);
        return ResponseEntity.ok(saved);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestBody UserLoginDTO dto) {
        return userService.login(dto).map(user -> {
            String token = jwtService.generateToken(user.getEmail());
            return ResponseEntity.ok(token);
        })
                .orElse(ResponseEntity.status(401).body("Niepoprawne dane logowania"));
    }
}
