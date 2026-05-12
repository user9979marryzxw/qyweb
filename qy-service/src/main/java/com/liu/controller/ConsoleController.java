package com.liu.controller;

import com.liu.dto.LogPageQueryDTO;
import com.liu.dto.UserPageQueryDTO;
import com.liu.result.PageResult;
import com.liu.result.Result;
import com.liu.service.ConsoleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags="控制台相关接口")
@Slf4j
@RequestMapping("/console")
public class ConsoleController {

    @Autowired
    private ConsoleService consoleService;

    /**
     * 用户分页查询
     * @param userPageQueryDTO
     * @return
     */
    @ApiOperation("用户分页查询")
    @GetMapping("/users")
    public Result<PageResult> page(UserPageQueryDTO userPageQueryDTO){
        log.info("用户分页查询: {}",userPageQueryDTO);
        PageResult pageResult = consoleService.userpageQuery(userPageQueryDTO);
        return Result.success(pageResult);
    }

    /**
     * 日志分页查询
     * @param logPageQueryDTO
     * @return
     */
    @ApiOperation("日志分页查询")
    @GetMapping("/logs")
    public Result<PageResult> page(LogPageQueryDTO logPageQueryDTO){
        log.info("日志分页查询: {}",logPageQueryDTO);
        PageResult pageResult = consoleService.logsPageQuery(logPageQueryDTO);
        return Result.success(pageResult);
    }

}
