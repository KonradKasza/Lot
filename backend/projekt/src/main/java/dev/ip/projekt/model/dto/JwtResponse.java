package dev.ip.projekt.model.dto;

public class JwtResponse {
    private String jwt;
    private Status status;
    private String message;

    public enum Status { SUCCESS, ERROR }

    public JwtResponse(String jwt) {
        this.jwt = jwt;
        this.status = Status.SUCCESS;
    }

    public JwtResponse() {}

    public void setStatus(Status status) { this.status = status; }
    public void setMessage(String message) { this.message = message; }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getJwt() {
        return jwt;
    }

    public Status getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
