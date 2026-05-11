package com.liu.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductVO {
    private Integer id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private String image;
    private String description;
    private Integer category;
}
