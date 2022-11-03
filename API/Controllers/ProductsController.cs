using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Data;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Core.Interfaces;
using Core.Specifications;
using API.DTOs;
using AutoMapper;
using API.Errors;
using API.Helpers;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> productRepo;
        private readonly IGenericRepository<ProductBrand> productBrandRepo;
        private readonly IGenericRepository<ProductType> productTypeRepo;
        private readonly IMapper mapper;

        public ProductsController(IGenericRepository<Product> productRepo, 
            IGenericRepository<ProductBrand> productBrandRepo, 
            IGenericRepository<ProductType> productTypeRepo, 
            IMapper mapper)
        {
            this.productRepo = productRepo;
            this.productBrandRepo = productBrandRepo;
            this.productTypeRepo = productTypeRepo;
            this.mapper = mapper;
        }
        [CachedAttributes(600)]
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
                [FromQuery]ProductSpecParams? productParams)
        {
            var spec = new ProductsWithBrandsAndTypesSpecification(productParams!);
            var countSpec = new ProductsWithFiltersForCountSpecification(productParams!);
            var totalItems = await productRepo.CountAsync(countSpec);
            var products = await productRepo.ListAsync(spec);
            var data = mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);
            
            return Ok(new Pagination<ProductToReturnDto>(productParams!.PageIndex,
            productParams.PageSize, totalItems, data));
        }

        [CachedAttributes(600)]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id){
            var spec = new ProductsWithBrandsAndTypesSpecification(id);
            var product = await productRepo.GetEntityWithSpec(spec);

            if(product == null) return NotFound(new ApiResponse(404));
            
            return Ok(mapper.Map<Product, ProductToReturnDto>(product));
            
        }

        [CachedAttributes(600)]
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            return Ok(await productBrandRepo.ListAllAsync());
        }

        [CachedAttributes(600)]
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            return Ok(await productTypeRepo.ListAllAsync());
        }
    }
}