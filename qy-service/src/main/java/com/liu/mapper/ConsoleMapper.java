package com.liu.mapper;


import com.liu.dto.UserPageQueryDTO;
import com.liu.vo.UserVO;

import java.util.List;

public interface ConsoleMapper {

    /**
     * 用户分页查询
     * @param userPageQueryDTO
     * @return
     */
    List<UserVO> pageQuery(UserPageQueryDTO userPageQueryDTO);
}
