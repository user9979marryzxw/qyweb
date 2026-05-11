package com.liu.service;

import com.liu.dto.UserDTO;
import com.liu.entity.User;

import javax.security.auth.login.AccountNotFoundException;

public interface UserService{

    /**
     * 用户登录
     * @param userDTO
     */
    User login(UserDTO userDTO);
}
