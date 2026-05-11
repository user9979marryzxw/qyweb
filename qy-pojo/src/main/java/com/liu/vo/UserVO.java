package com.liu.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserVO {
    private String username;
    private String password;
    private String token;
    private String nickname;
    private String avatar;
    private Integer userId;
    private Boolean isAdmin;
}
