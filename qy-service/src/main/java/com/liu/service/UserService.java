package com.liu.service;

import com.liu.dto.UserDTO;
import com.liu.entity.User;

public interface UserService{

    /**
     * 用户登录
     * @param userDTO
     */
    User login(UserDTO userDTO);
}
