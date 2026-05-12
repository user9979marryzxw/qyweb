package com.liu.controller;

import com.liu.dto.ProductDTO;
import com.liu.dto.ProductPageQueryDTO;
import com.liu.entity.Product;
import com.liu.result.PageResult;
import com.liu.result.Result;
import com.liu.service.ProductService;
import com.liu.vo.ProductVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/product")
@Api(tags="产品相关接口")
public class ProductController {

    @Autowired
    ProductService productService;

    /**
     * 新增产品
     * @param productDTO
     * @return
     */
    @PostMapping("/add")
    @ApiOperation("新增产品")
    public Result save(@RequestBody ProductDTO productDTO){
        log.info("新增产品: {}",productDTO);
        productService.saveProduct(productDTO);
        return Result.success();
    }

    /**
     * 产品分页查询
     * @param productPageQueryDTO
     * @return
     */
    @GetMapping("/page")
    @ApiOperation("产品分页查询")
    public Result<PageResult> page(ProductPageQueryDTO productPageQueryDTO){
        log.info("产品分页查询: {}",productPageQueryDTO);
        PageResult pageResult = productService.pageQuery(productPageQueryDTO);
        return Result.success(pageResult);
    }

    /**
     * 根据ID查询产品
     * @param id
     * @return
     */
    @GetMapping("/page/{id}")
    @ApiOperation("根据ID查询产品")
    public Result<ProductVO> pageById(@PathVariable Long id){
        log.info("根据ID查询产品: {}",id);
        ProductVO productVO = productService.pageQueryById(id);
        return Result.success(productVO);
    }

//    @PostMapping("/")
//    @ApiOperation("产品删除")
//    public Result delete(ProductDTO productDTO){
//        log.info("产品删除: {}",productDTO);
////        PageResult pageResult = productService.delete(productDTO);
//        return Result.success();
//    }
}
