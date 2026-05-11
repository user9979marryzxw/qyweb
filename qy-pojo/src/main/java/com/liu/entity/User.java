package com.liu.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class User {
    private int id;
    private String username;
    private String password;
    private String name;
    private String phone;
    private String avatar;
    private String openid;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String nickname;
    private Boolean isAdmin;
}
