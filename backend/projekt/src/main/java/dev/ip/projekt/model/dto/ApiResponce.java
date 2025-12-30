package dev.ip.projekt.model.dto;

public class ApiResponce {
    private Boolean success;
    private String message;

    public ApiResponce() {
        this(true, "ok");
    }

    public ApiResponce(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    static public ApiResponce makeSuccess(String msg) {
        return new ApiResponce(true, msg);
    }

    static public ApiResponce makeFailure(String msg) {
        return new ApiResponce(false, msg);
    }

    static public ApiResponce makeDefaultSuccess() {
        return new ApiResponce(true, "success");
    }

    static public ApiResponce makeDefaultFailure() {
        return new ApiResponce(false, "failure");
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "ApiResponce{" +
                "success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
}
