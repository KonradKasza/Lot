package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.CustomerAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerAccountRepository extends JpaRepository<CustomerAccount, String> {
    
    Optional<CustomerAccount> findByEmail(String email);
    
    Optional<CustomerAccount> findByLogin(String login);
    
    boolean existsByEmail(String email);
    
    boolean existsByLogin(String login);
}
