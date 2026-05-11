package com.liu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPageQueryDTO {

    private int page = 1;

    private int pageSize = 10;

    private String sort;

    private Integer category;

    private String search;
}
