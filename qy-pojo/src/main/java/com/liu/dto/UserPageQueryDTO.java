package com.liu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPageQueryDTO implements Serializable {

    private int page = 1;

    private int pageSize = 10;

    private String sort;

    private Integer category;

    private String search;
}
