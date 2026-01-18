package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AirportRepository extends JpaRepository<Airport, String> {
    
    List<Airport> findByCountryOrderByCity(String country);
    
    List<Airport> findAllByOrderByCountryAscCityAsc();
    
    @Query("SELECT DISTINCT a.country FROM Airport a ORDER BY a.country")
    List<String> findDistinctCountries();
    
    @Query("SELECT DISTINCT a.state FROM Airport a WHERE a.country = :country AND a.state IS NOT NULL ORDER BY a.state")
    List<String> findDistinctStatesByCountry(String country);
    
    List<Airport> findByCountryAndStateOrderByCity(String country, String state);
}
