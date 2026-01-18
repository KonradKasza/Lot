package dev.ip.projekt.security;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom security annotations for admin role-based access control.
 * These provide cleaner, reusable authorization rules for controllers.
 */
public class AdminRoleAnnotations {

    /**
     * Requires WORKER role or higher (WORKER, MANAGER, ADMIN)
     * Use for: View-only endpoints
     */
    @Target({ElementType.METHOD, ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAnyRole('WORKER', 'MANAGER', 'ADMIN')")
    public @interface WorkerAccess {}

    /**
     * Requires MANAGER role or higher (MANAGER, ADMIN)
     * Use for: Add/Edit operations on flights, reservations, customers
     */
    @Target({ElementType.METHOD, ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public @interface ManagerAccess {}

    /**
     * Requires ADMIN role only
     * Use for: Delete operations, admin management, critical system changes
     */
    @Target({ElementType.METHOD, ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasRole('ADMIN')")
    public @interface AdminAccess {}

    /**
     * Requires any authenticated admin user
     * Use for: General admin-only endpoints
     */
    @Target({ElementType.METHOD, ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("isAuthenticated() and hasAnyRole('WORKER', 'MANAGER', 'ADMIN')")
    public @interface AnyAdminAccess {}
}
