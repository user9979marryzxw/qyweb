package com.liu.mapper;

import com.liu.entity.User;
import org.apache.ibatis.annotations.Select;

public interface UserMapper{

    @Select("select * from user where username=#{username}")
    User getByUsername(String username);
}
