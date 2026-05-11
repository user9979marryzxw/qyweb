package com.liu.service;

import com.liu.dto.UserPageQueryDTO;
import com.liu.result.PageResult;

public interface ConsoleService {

    /**
     * 用户分页查询
     * @param userPageQueryDTO
     * @return
     */
    PageResult pageQuery(UserPageQueryDTO userPageQueryDTO);
}
