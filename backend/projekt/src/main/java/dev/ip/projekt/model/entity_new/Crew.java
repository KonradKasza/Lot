package dev.ip.projekt.model.entity_new;

import jakarta.persistence.*;

@Entity
@Table(name = "crew", schema = "public")
public class Crew {

    @Id
    @Column(name = "crew_id", nullable = false)
    public Integer crewId;

    @Column(name = "crew_name", length = 50)
    public String crewName;

    @Column(name = "crew_type", length = 30)
    public String crewType;

    public Integer getCrewId() {
        return crewId;
    }

    public void setCrewId(Integer crewId) {
        this.crewId = crewId;
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

    @Override
    public String toString() {
        return "Crew{" +
                "crewId=" + crewId +
                ", crewName='" + crewName + '\'' +
                ", crewType='" + crewType + '\'' +
                '}';
    }
}

