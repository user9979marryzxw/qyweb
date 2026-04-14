package com.liu.dto;

import jdk.jfr.Description;
import lombok.Data;

import java.io.Serializable;

@Data
public class UserDTO implements Serializable {
    private String username;
    private String password;
}
