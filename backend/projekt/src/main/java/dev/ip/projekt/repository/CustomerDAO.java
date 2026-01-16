package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component // todo
public interface CustomerDAO extends JpaRepository<Customer, String> {

}