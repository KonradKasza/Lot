package dev.ip.projekt.model.dto;

public class JourneyDTO {
    public String startAddr;
    public String endAddr;

    public JourneyDTO() {
    }

    public String getStartAddr() {
        return startAddr;
    }

    public void setStartAddr(String startAddr) {
        this.startAddr = startAddr;
    }

    public String getEndAddr() {
        return endAddr;
    }

    public void setEndAddr(String endAddr) {
        this.endAddr = endAddr;
    }
}
