package dev.ip.projekt.controllers;

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

    public UserAuthCtrl(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<UserAccount> register(@RequestBody UserRegistrationDTO dto) {
        UserAccount saved = userService.register(dto);
        return ResponseEntity.ok(saved);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<String> login(@RequestBody UserLoginDTO dto) {
        return userService.login(dto).map(user -> ResponseEntity.ok("Login successful")).orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }
}
