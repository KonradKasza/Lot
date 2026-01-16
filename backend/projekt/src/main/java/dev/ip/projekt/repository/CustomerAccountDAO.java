package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.CustomerAccount;
import dev.ip.projekt.model.entity_new.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component // todo
public interface CustomerAccountDAO extends JpaRepository<CustomerAccount, String> {

    Optional<CustomerAccount> findByEmail(String email);

}
