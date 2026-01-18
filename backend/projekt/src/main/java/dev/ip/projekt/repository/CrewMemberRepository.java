package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.CrewMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrewMemberRepository extends JpaRepository<CrewMember, Integer> {
    List<CrewMember> findByCrewId(Integer crewId);
}
