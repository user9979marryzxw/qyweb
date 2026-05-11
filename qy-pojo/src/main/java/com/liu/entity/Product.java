package com.liu.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class Product {
    private int id;
    private String name;
    private String description;
    private BigDecimal price; // 使用 BigDecimal 避免浮点精度问题
    private String image;
    private Integer category; // 1: 国内游, 2: 出境游, 3: 签证服务
    private Integer stock;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
