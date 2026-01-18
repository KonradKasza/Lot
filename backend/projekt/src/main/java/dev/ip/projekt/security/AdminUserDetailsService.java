package dev.ip.projekt.security;

import dev.ip.projekt.model.entity_new.AdminAccount;
import dev.ip.projekt.repository.AdminAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * UserDetailsService implementation for admin authentication.
 * Loads admin users from the admin_account table.
 */
@Service("adminUserDetailsService")
public class AdminUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminAccountRepository adminAccountRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        // Try to find by email first, then by username
        AdminAccount admin = adminAccountRepository.findByEmail(emailOrUsername)
                .or(() -> adminAccountRepository.findByUsername(emailOrUsername))
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " + emailOrUsername));

        if (!admin.getIsActive()) {
            throw new UsernameNotFoundException("Admin account is deactivated: " + emailOrUsername);
        }

        return new User(
                admin.getEmail(),
                admin.getPasswordHash(),
                admin.getIsActive(),
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                getAuthorities(admin)
        );
    }

    /**
     * Get authorities based on admin role.
     * Higher roles include all permissions of lower roles.
     */
    private Collection<? extends GrantedAuthority> getAuthorities(AdminAccount admin) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // Add the specific role authority
        authorities.add(new SimpleGrantedAuthority(admin.getRole().getAuthority()));
        
        // Add hierarchical permissions (higher roles get lower role permissions too)
        switch (admin.getRole()) {
            case ADMIN:
                authorities.add(new SimpleGrantedAuthority("ROLE_MANAGER"));
                authorities.add(new SimpleGrantedAuthority("ROLE_WORKER"));
                break;
            case MANAGER:
                authorities.add(new SimpleGrantedAuthority("ROLE_WORKER"));
                break;
            case WORKER:
                // Worker only has ROLE_WORKER
                break;
        }
        
        return authorities;
    }

    /**
     * Load admin by email specifically
     */
    public AdminAccount loadAdminByEmail(String email) {
        return adminAccountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with email: " + email));
    }
}
