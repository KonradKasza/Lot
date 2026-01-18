package dev.ip.projekt.model.entity_new;

/**
 * Enum representing admin access levels.
 * 
 * WORKER - Can view all data but cannot modify anything
 * MANAGER - Can view and modify most data (add flights, edit reservations, etc.)
 * ADMIN - Full access except destructive database operations (DROP, schema changes)
 */
public enum AdminRole {
    WORKER("ROLE_WORKER"),
    MANAGER("ROLE_MANAGER"),
    ADMIN("ROLE_ADMIN");

    private final String authority;

    AdminRole(String authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return authority;
    }

    /**
     * Check if this role has at least the permissions of the given role.
     * ADMIN > MANAGER > WORKER
     */
    public boolean hasPermission(AdminRole requiredRole) {
        return this.ordinal() >= requiredRole.ordinal();
    }
}
