package com.liu.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private String image;
    private Integer category;
    private Integer stock;
}
