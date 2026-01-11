package dev.ip.projekt.model.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "klient")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "klient_id")
    private Long id;

    @Column(name = "imie")
    private String firstName;

    @Column(name = "nazwisko")
    private String lastName;

    private String email;

    private String telefon;

    @Column(name = "data_urodzenia")
    private LocalDate dateOfBirth;

    @Column(name = "nr_dokumentu")
    private String documentNumber;

    @Column(name = "data_rejestracji")
    private LocalDate registrationDate;

    @Column(name = "status_lojalnosci")
    private String loyaltyStatus;

    @OneToOne(mappedBy = "client", cascade = CascadeType.ALL)
    private UserAccount account;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getLoyaltyStatus() {
        return loyaltyStatus;
    }

    public void setLoyaltyStatus(String loyaltyStatus) {
        this.loyaltyStatus = loyaltyStatus;
    }

    public UserAccount getAccount() {
        return account;
    }

    public void setAccount(UserAccount account) {
        this.account = account;
    }
}