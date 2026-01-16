package dev.ip.projekt.model.entity_new;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "crew_member", schema = "public")
public class CrewMember {

    @Id
    @Column(name = "crew_member_id", nullable = false)
    public Integer crewMemberId;

    @Column(name = "crew_id", nullable = false)
    public Integer crewId;

    @Column(name = "first_name", length = 50)
    public String firstName;

    @Column(name = "last_name", length = 50)
    public String lastName;

    @Column(name = "role", length = 50)
    public String role;

    @Column(name = "license_number", length = 50)
    public String licenseNumber;

    @Column(name = "employment_date")
    public LocalDate employmentDate;

    @Column(name = "status", length = 30)
    public String status;

    public Integer getCrewMemberId() {
        return crewMemberId;
    }

    public void setCrewMemberId(Integer crewMemberId) {
        this.crewMemberId = crewMemberId;
    }

    public Integer getCrewId() {
        return crewId;
    }

    public void setCrewId(Integer crewId) {
        this.crewId = crewId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public LocalDate getEmploymentDate() {
        return employmentDate;
    }

    public void setEmploymentDate(LocalDate employmentDate) {
        this.employmentDate = employmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "CrewMember{" +
                "crewMemberId=" + crewMemberId +
                ", crewId=" + crewId +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", role='" + role + '\'' +
                ", licenseNumber='" + licenseNumber + '\'' +
                ", employmentDate=" + employmentDate +
                ", status='" + status + '\'' +
                '}';
    }
}

