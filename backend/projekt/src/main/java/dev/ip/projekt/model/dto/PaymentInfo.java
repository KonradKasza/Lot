package dev.ip.projekt.model.dto;

import java.sql.Timestamp;

public class PaymentInfo {
    private String Id;
    private String userName;
    private String userSurname;
    private long value;
    private String currency; // USD, PLN, etc
    private Timestamp date;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserSurname() {
        return userSurname;
    }

    public void setUserSurname(String userSurname) {
        this.userSurname = userSurname;
    }

    public long getValue() {
        return value;
    }

    public void setValue(long value) {
        this.value = value;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public String getReservationId() {
        return Id;
    }

    public void setReservationId(String Id) {
        Id = Id;
    }

    @Override
    public String toString() {
        return "PaymentInfo{" +
                "Id='" + Id + '\'' +
                ", userName='" + userName + '\'' +
                ", userSurname='" + userSurname + '\'' +
                ", value=" + value +
                ", currency='" + currency + '\'' +
                ", date=" + date +
                '}';
    }
}
