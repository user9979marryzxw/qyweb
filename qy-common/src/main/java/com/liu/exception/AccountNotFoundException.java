package com.liu.exception;

public class AccountNotFoundException extends BaseException {
    public AccountNotFoundException(String message) {
        super(message);
    }

    public AccountNotFoundException() {
    }
}
