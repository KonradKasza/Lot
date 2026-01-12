package dev.ip.projekt.model.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "zaloga")
public class Crew {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zaloga_id")
    private Long id;

    @Column(name = "nazwa_zalogi")
    private String crewName;

    @Column(name = "typ_zalogi")
    private String crewType;

    @OneToOne
    @JoinColumn(name = "lot_id")
    private Flight flight;

    @OneToMany(mappedBy = "crew")
    private List<CrewMember> members;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCrewName() {
        return crewName;
    }

    public void setCrewName(String crewName) {
        this.crewName = crewName;
    }

    public String getCrewType() {
        return crewType;
    }

    public void setCrewType(String crewType) {
        this.crewType = crewType;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }

    public List<CrewMember> getMembers() {
        return members;
    }

    public void setMembers(List<CrewMember> members) {
        this.members = members;
    }
}