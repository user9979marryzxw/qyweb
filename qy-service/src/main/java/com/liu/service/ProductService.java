package com.liu.service;

import com.liu.dto.ProductDTO;
import com.liu.dto.ProductPageQueryDTO;
import com.liu.result.PageResult;
import com.liu.vo.ProductVO;

public interface ProductService {

    /**
     * 新增产品
     * @param productDTO
     * @return
     */
    void saveProduct(ProductDTO productDTO);

    /**
     * 产品分页查询
     * @param productPageQueryDTO
     * @return
     */
    PageResult pageQuery(ProductPageQueryDTO productPageQueryDTO);

    /**
     * 根据ID查询产品
     * @param id
     * @return
     */
    ProductVO pageQueryById(Long id);
}
