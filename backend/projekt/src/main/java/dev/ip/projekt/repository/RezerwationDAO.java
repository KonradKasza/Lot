package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RezerwationDAO extends JpaRepository<Reservation, Long> {
}
