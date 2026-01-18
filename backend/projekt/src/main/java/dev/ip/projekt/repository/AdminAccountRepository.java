package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.AdminAccount;
import dev.ip.projekt.model.entity_new.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminAccountRepository extends JpaRepository<AdminAccount, Long> {

    /**
     * Find admin by email (for login)
     */
    Optional<AdminAccount> findByEmail(String email);

    /**
     * Find admin by username (for login)
     */
    Optional<AdminAccount> findByUsername(String username);

    /**
     * Find admin by email or username (flexible login)
     */
    Optional<AdminAccount> findByEmailOrUsername(String email, String username);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if username exists
     */
    boolean existsByUsername(String username);

    /**
     * Find all admins by role
     */
    List<AdminAccount> findByRole(AdminRole role);

    /**
     * Find all active admins
     */
    List<AdminAccount> findByIsActiveTrue();

    /**
     * Find all admins by role and active status
     */
    List<AdminAccount> findByRoleAndIsActive(AdminRole role, Boolean isActive);

    /**
     * Update last login timestamp
     */
    @Modifying
    @Query("UPDATE AdminAccount a SET a.lastLogin = :lastLogin WHERE a.adminId = :adminId")
    void updateLastLogin(@Param("adminId") Long adminId, @Param("lastLogin") LocalDateTime lastLogin);

    /**
     * Deactivate an admin account
     */
    @Modifying
    @Query("UPDATE AdminAccount a SET a.isActive = false WHERE a.adminId = :adminId")
    void deactivateAccount(@Param("adminId") Long adminId);

    /**
     * Count admins by role
     */
    long countByRole(AdminRole role);

    /**
     * Count active admins
     */
    long countByIsActiveTrue();
}
