package com.liu.service.Impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.liu.dto.ProductDTO;
import com.liu.dto.ProductPageQueryDTO;
import com.liu.entity.Product;
import com.liu.mapper.ProductMapper;
import com.liu.result.PageResult;
import com.liu.service.ProductService;
import com.liu.vo.ProductVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductMapper productMapper;

    /**
     * 新增产品
     * @param productDTO
     * @return
     */
    public void saveProduct(ProductDTO productDTO) {
        Product product = new Product();
        BeanUtils.copyProperties(productDTO, product);
        //向数据库中插入数据
        productMapper.insert(product);

    }

    /**
     * 产品分页查询
     * @param productPageQueryDTO
     * @return
     */
    //TODO:分页查询的total和pages计数出错
    public PageResult pageQuery(ProductPageQueryDTO productPageQueryDTO) {
        PageHelper.startPage(productPageQueryDTO.getPage(),productPageQueryDTO.getPageSize());

        List<ProductVO> list = productMapper.pageQuery(productPageQueryDTO);

        PageInfo<ProductVO> pageInfo = new PageInfo<>(list);
        Long total=pageInfo.getTotal();
        return new PageResult(total, pageInfo.getPages(), pageInfo.getList());
    }

    /**
     * 根据ID查询产品
     * @param id
     * @return
     */
    public ProductVO pageQueryById(Long id) {
        ProductVO productVO = new ProductVO();
        BeanUtils.copyProperties(productMapper.pageQueryById(id),productVO);
        return productVO;
    }
}
