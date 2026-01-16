package dev.ip.projekt.model.entity_new;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "customer_account", schema = "public")
public class CustomerAccount {

    @Id
    @Column(name = "account_id", length = 29, nullable = false)
    public String accountId;

    @Column(name = "login", length = 50)
    public String login;

    @Column(name = "email", length = 100)
    public String email;

    @Column(name = "password_hash", length = 128)
    public String passwordHash;

    @Column(name = "login_date")
    public LocalDate loginDate;

    @Column(name = "consents", length = 50)
    public String consents;

    @Column(name = "preferences", length = 50)
    public String preferences;

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public LocalDate getLoginDate() {
        return loginDate;
    }

    public void setLoginDate(LocalDate loginDate) {
        this.loginDate = loginDate;
    }

    public String getConsents() {
        return consents;
    }

    public void setConsents(String consents) {
        this.consents = consents;
    }

    public String getPreferences() {
        return preferences;
    }

    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }

    @Override
    public String toString() {
        return "CustomerAccount{" +
                "accountId='" + accountId + '\'' +
                ", login='" + login + '\'' +
                ", email='" + email + '\'' +
                ", passwordHash='" + passwordHash + '\'' +
                ", loginDate=" + loginDate +
                ", consents='" + consents + '\'' +
                ", preferences='" + preferences + '\'' +
                '}';
    }
}

