package com.namma.api.exception;

public class InsufficientFundsException extends Exception{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public InsufficientFundsException(String message){
		super(message);
	}

}
