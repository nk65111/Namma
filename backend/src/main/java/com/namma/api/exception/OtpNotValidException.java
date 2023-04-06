package com.namma.api.exception;

public class OtpNotValidException extends Exception{
	private static final long serialVersionUID = 1L;
	
	public OtpNotValidException(String message) {
		super(message);
	}
}
