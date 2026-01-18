package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.Airplane;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirplaneRepository extends JpaRepository<Airplane, String> {
}
