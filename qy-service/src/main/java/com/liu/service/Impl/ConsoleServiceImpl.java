package com.liu.service.Impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.liu.dto.LogPageQueryDTO;
import com.liu.dto.UserPageQueryDTO;
import com.liu.mapper.ConsoleMapper;
import com.liu.result.PageResult;
import com.liu.service.ConsoleService;
import com.liu.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsoleServiceImpl implements ConsoleService {

    @Autowired
    private ConsoleMapper consoleMapper;


    /**
     * 用户分页查询
     * @param userPageQueryDTO
     * @return
     */
    public PageResult userpageQuery(UserPageQueryDTO userPageQueryDTO) {
        PageHelper.startPage(userPageQueryDTO.getPage(),userPageQueryDTO.getPageSize());

        List<UserVO> list = consoleMapper.userpageQuery(userPageQueryDTO);

        PageInfo<UserVO> pageInfo = new PageInfo<>(list);
        return new PageResult(pageInfo.getTotal(),pageInfo.getPages(),pageInfo.getList());
    }


    public PageResult logsPageQuery(LogPageQueryDTO logPageQueryDTO) {
        return null;
    }
}
