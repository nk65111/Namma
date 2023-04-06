package com.namma.api.exception;

public class DriverAlreadyExistException extends IllegalArgumentException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public DriverAlreadyExistException(String message) {
		super(message);
	}
}
