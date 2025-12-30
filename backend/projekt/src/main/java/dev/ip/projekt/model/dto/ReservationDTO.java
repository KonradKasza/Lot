package dev.ip.projekt.model.dto;

public class ReservationDTO {
    private Long userId;
    private String sit; // A1, A12, B5 etc.
    private Long flightId;

    public ReservationDTO() {
        this.userId = 1L;
        this.sit = "sit";
        this.flightId = 1L;
    }

    public ReservationDTO(Long userId, String sit, Long flightId) {
        this.userId = userId;
        this.sit = sit;
        this.flightId = flightId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSit() {
        return sit;
    }

    public void setSit(String sit) {
        this.sit = sit;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    @Override
    public String toString() {
        return "ReservationDTO{" +
                "userId=" + userId +
                ", sit='" + sit + '\'' +
                ", flightId=" + flightId +
                '}';
    }
}
