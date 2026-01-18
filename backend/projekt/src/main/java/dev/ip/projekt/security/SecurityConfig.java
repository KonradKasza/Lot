package dev.ip.projekt.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Enable @PreAuthorize annotations
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow both customer frontend (5173) and admin frontend (5174)
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173", 
            "http://localhost:5174", 
            "http://localhost:3000"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no authentication required
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/register").permitAll()
                .requestMatchers("/api/admin/auth/login").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/flights/**").permitAll()
                
                // Admin dashboard - all admin roles can access
                .requestMatchers("/api/admin/dashboard/**").hasAnyRole("WORKER", "MANAGER", "ADMIN")
                .requestMatchers("/api/admin/auth/**").hasAnyRole("WORKER", "MANAGER", "ADMIN")
                
                // MANAGER level - can add/edit but not delete critical data
                .requestMatchers("/api/admin/flights/add").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers("/api/admin/flights/edit/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers("/api/admin/reservations/edit/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers("/api/admin/reservations/cancel/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers("/api/admin/customers/edit/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers("/api/admin/airplanes/add").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers("/api/admin/airplanes/edit/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers("/api/admin/crews/edit/**").hasAnyRole("MANAGER", "ADMIN")
                
                // ADMIN level - full access including delete operations
                .requestMatchers("/api/admin/flights/delete/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/customers/delete/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/reservations/delete/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/airports/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/admins/**").hasRole("ADMIN")
                
                // All other admin endpoints require at least WORKER role
                .requestMatchers("/api/admin/**").hasAnyRole("WORKER", "MANAGER", "ADMIN")
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
