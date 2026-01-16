package dev.ip.projekt.model.entity_new;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "customer", schema = "public")
public class Customer {

    @Id
    @Column(name = "customer_id", length = 29, nullable = false)
    public String customerId;

    @Column(name = "first_name", length = 29)
    public String firstName;

    @Column(name = "last_name", length = 29)
    public String lastName;

    @Column(name = "gender", length = 26)
    public String gender;

    @Column(name = "age")
    public Integer age;

    @Column(name = "nationality", length = 128)
    public String nationality;



    @Column(name = "phone", length = 20)
    public String phone;

    @Column(name = "birth_date")
    public LocalDate birthDate;

    @Column(name = "document_number", length = 50)
    public String documentNumber;

    @Column(name = "registration_date")
    public LocalDate registrationDate;

    @Column(name = "loyalty_status", length = 20)
    public String loyaltyStatus;

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
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

    @Override
    public String toString() {
        return "Customer{" +
                "customerId='" + customerId + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", gender='" + gender + '\'' +
                ", age=" + age +
                ", nationality='" + nationality + '\'' +
                ", phone='" + phone + '\'' +
                ", birthDate=" + birthDate +
                ", documentNumber='" + documentNumber + '\'' +
                ", registrationDate=" + registrationDate +
                ", loyaltyStatus='" + loyaltyStatus + '\'' +
                '}';
    }
}

