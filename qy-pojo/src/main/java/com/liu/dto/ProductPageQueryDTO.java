package com.liu.dto;

import lombok.Data;

@Data
public class ProductPageQueryDTO {
    private int page = 1;

    private int pageSize = 10;

    private String sort;

    private Integer category;

    private String search;
}
