package com.liu.mapper;

import com.github.pagehelper.Page;
import com.liu.dto.ProductPageQueryDTO;
import com.liu.entity.Product;
import com.liu.vo.ProductVO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

public interface ProductMapper {

    /**
     * 产品总数查询
     * @return
     */
    Long countProducts();

    /**
     * 新增产品
     * @param product
     */
    @Insert("INSERT INTO product (name, price, stock, image, description, category, create_time, update_time) " +
            "VALUES (#{name}, #{price}, #{stock}, #{image}, #{description}, #{category}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    void insert(Product product);

    /**
     * 产品分页查询
     * @param productPageQueryDTO
     * @return
     */
    Page<ProductVO> pageQuery(ProductPageQueryDTO productPageQueryDTO);

    /**
     * 根据ID查询产品
     * @param id
     * @return
     */
    @Select("select * from product where id = #{id}")
    Product pageQueryById(Long id);
}