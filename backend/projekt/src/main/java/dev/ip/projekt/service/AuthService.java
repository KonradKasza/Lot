package dev.ip.projekt.service;

import dev.ip.projekt.model.dto.JwtResponse;
import dev.ip.projekt.model.dto.UserLoginDTO;
import dev.ip.projekt.model.dto.UserRegistrationDTO;
import dev.ip.projekt.model.entity_new.Customer;
import dev.ip.projekt.model.entity_new.CustomerAccount;
import dev.ip.projekt.repository.CustomerAccountRepository;
import dev.ip.projekt.repository.CustomerRepository;
import dev.ip.projekt.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponse login(UserLoginDTO loginDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getEmail(),
                            loginDTO.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            CustomerAccount account = customerAccountRepository.findByEmail(loginDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            String jwt = jwtUtils.generateJwtToken(account.getEmail(), account.getAccountId());

            JwtResponse response = new JwtResponse(jwt);
            response.setStatus(JwtResponse.Status.SUCCESS);
            response.setMessage("Login successful");
            return response;

        } catch (BadCredentialsException e) {
            JwtResponse response = new JwtResponse();
            response.setStatus(JwtResponse.Status.ERROR);
            response.setMessage("Incorrect email or password");
            return response;
        }
    }

    @Transactional
    public JwtResponse register(UserRegistrationDTO registrationDTO) {
        // Check if email already exists
        if (customerAccountRepository.existsByEmail(registrationDTO.getEmail())) {
            JwtResponse response = new JwtResponse();
            response.setStatus(JwtResponse.Status.ERROR);
            response.setMessage("Email already registered");
            return response;
        }

        // Check if username already exists
        if (customerAccountRepository.existsByLogin(registrationDTO.getUsername())) {
            JwtResponse response = new JwtResponse();
            response.setStatus(JwtResponse.Status.ERROR);
            response.setMessage("Username already taken");
            return response;
        }

        try {
            // Generate unique customer ID (CUS + 26 chars = 29 chars total)
            String customerId = "CUS" + UUID.randomUUID().toString().replace("-", "").substring(0, 26).toUpperCase();

            // Create customer record first (required for FK constraint)
            Customer customer = new Customer();
            customer.setCustomerId(customerId);
            customer.setRegistrationDate(LocalDate.now());
            customer.setLoyaltyStatus("Bronze");
            customerRepository.save(customer);

            // Create customer account
            CustomerAccount account = new CustomerAccount();
            account.setAccountId(customerId);  // Same as customer_id (FK constraint)
            account.setLogin(registrationDTO.getUsername());
            account.setEmail(registrationDTO.getEmail());
            account.setPasswordHash(passwordEncoder.encode(registrationDTO.getPassword()));
            account.setLoginDate(LocalDate.now());
            account.setConsents("essential");
            account.setPreferences("email");
            customerAccountRepository.save(account);

            // Generate JWT token for immediate login
            String jwt = jwtUtils.generateJwtToken(account.getEmail(), account.getAccountId());

            JwtResponse response = new JwtResponse(jwt);
            response.setStatus(JwtResponse.Status.SUCCESS);
            response.setMessage("Registration successful");
            return response;

        } catch (Exception e) {
            JwtResponse response = new JwtResponse();
            response.setStatus(JwtResponse.Status.ERROR);
            response.setMessage("Registration failed: " + e.getMessage());
            return response;
        }
    }
}
