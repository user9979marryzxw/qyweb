package com.liu.service.Impl;

import com.liu.dto.UserDTO;
import com.liu.entity.User;
import com.liu.mapper.UserMapper;
import com.liu.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserPrincipalLookupService;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    /**
     * 用户登录
     * @param userDTO
     */
    public User login(UserDTO userDTO) {
        //TODO 1.校验参数合法性

        String username = userDTO.getUsername();
        String password = userDTO.getPassword();

        //2、根据用户名查询数据库中的数据
        User user = userMapper.getByUsername(username);
        if(user == null) {
            //用户名不存在
            log.info("用户名不存在!");
            return null;
        }
        if(!password.equals(user.getPassword())) {
            //密码错误
            log.info("密码错误!");
            return null;
        }
        return user;

            //TODO 3.校验密码是否正确
            //TODO 4.登录成功后，生成jwt令牌，并返回给前端
    }
}
