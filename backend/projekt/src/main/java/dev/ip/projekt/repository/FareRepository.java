package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.Fare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FareRepository extends JpaRepository<Fare, Integer> {
    
    List<Fare> findAllByOrderByBasePriceAsc();
}
