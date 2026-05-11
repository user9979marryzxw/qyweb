package com.liu.service.Impl;

import com.liu.dto.UserDTO;
import com.liu.entity.User;
import com.liu.exception.AccountNotFoundException;
import com.liu.exception.PasswordErrorException;
import com.liu.mapper.UserMapper;
import com.liu.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.liu.constant.MessageConstant;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;


@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    /**
     * 用户登录
     * @param userDTO
     */
    public User login(UserDTO userDTO){
        //TODO 1.校验参数合法性

        String username = userDTO.getUsername();
        String password = userDTO.getPassword();

        //2、根据用户名查询数据库中的数据
        User user = userMapper.getByUsername(username);
        if(user == null) {
            //账号不存在
            throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);
        }
        //todo密码加密
        password = DigestUtils.md5DigestAsHex(password.getBytes());
        log.info("加密后的密码: {}", password);
        if(!password.equals(user.getPassword())) {
            //密码错误
            throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
        }
        return user;
    }
}
