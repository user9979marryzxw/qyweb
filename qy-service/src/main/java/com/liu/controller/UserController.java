package com.liu.controller;

import com.liu.dto.UserDTO;
import com.liu.result.Result;
import com.liu.service.UserService;
import com.liu.vo.UserVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import com.liu.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.liu.constant.JwtConstant.USER_ID;
import static com.liu.utils.JwtUtil.generateToken;


@Slf4j
@RestController
@Api(tags = "C端用户相关接口")
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 用户登录
     * @param userDTO
     * @return
     */
    @PostMapping("/login")
    @ApiOperation("用户登录")
    public Result<UserVO> login(@RequestBody UserDTO userDTO){
        log.info("用户登录: {}", userDTO.getUsername());
        User user = userService.login(userDTO);

        //TODO登录成功后，生成jwt令牌
        Map<String,Object> claims = Map.of(USER_ID, user.getId());
        String token = generateToken(user.getUsername(),claims);
        log.info("生成jwt令牌: {}", token);
        UserVO userVO = UserVO.builder()
                .username(user.getUsername())
                .password("******")
                .token(token)
                .userId(user.getId())
                .avatar(user.getAvatar())
                .permissions(null)
                .nickname(user.getNickname())
                .build();
        return Result.success(userVO);
    }
}