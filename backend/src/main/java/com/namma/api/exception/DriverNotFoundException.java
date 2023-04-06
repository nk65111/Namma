package com.namma.api.exception;

public class DriverNotFoundException extends Exception {
    private static final long serialVersionUID = 1L;

    public DriverNotFoundException(String message) {
        super(message);
    }

}
