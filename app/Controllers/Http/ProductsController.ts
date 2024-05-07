import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import ProductService from 'App/Service/product_service'

export default class ProductsController {
      async createProduct({ request, response }: HttpContextContract) {
        try {
          const productData = request.only([
            'product_name',
            'price_product',
            'img_product',
            'img2_product',
            'img3_product',
            'detail_product'
          ])
          await ProductService.createProduct(productData)
          return response.redirect().back()
        } catch (error) {
          console.error(error)
          return response.status(500).json({ error: 'Failed to create product' })
        }
      }


      async updateProduct({ params, request, response }: HttpContextContract) { 
        try {
            const { id } = params;
            const productData = request.only([
                'product_name',
                'price_product',
                'img_product',
                'img2_product',
                'img3_product',
                'detail_product' // เพิ่ม detail_product ใน request.only
            ]);

            await ProductService.updateProduct(id, productData);
            return response.redirect().back();
        } catch (error) {
            return response.badRequest(error.message);
        }
    }
    
    
    async updateProductPage({params, view }: HttpContextContract){ 
      const product = await Product.find(params.id)
      return view.render('admin//updateProductPage',{product});
    }
    
      async editProduct({ params, view }: HttpContextContract) {
        const Products = await ProductService.all({ filters: { id: params.id } })
        const Product = Products[0]
        const product = Product.serialize()
        return view.render('admin/UpdateProductPage', { product })
      }
    
      async deleteProduct({ response, params }: HttpContextContract) {
        await ProductService.delete(params.id)
        return response.redirect('back')
      }
  
      public async listProduct({ request, view, response }: HttpContextContract) {
        try {
          let page = request.input('page', 1); // รับค่าหน้าปัจจุบันจาก request
          const limit = 4; // จำนวนรายการต่อหน้า
          page = Math.max(page, 1);
          // ดึงข้อมูลสินค้าพร้อมที่แบ่งหน้า
          let products : any
          const keyword = request.input('keyword')
          let productsPaginator : any
          if (keyword){
    
            productsPaginator = await Product.query()
            .where('product_name', 'like', `%${keyword}%`)
            .orWhere('detail_product', 'like', `%${keyword}%`)
            .paginate(page);
            products = productsPaginator.serialize();
          } else {
            productsPaginator = await Product.query().paginate(page, limit);
            
            products = productsPaginator.serialize();
          }
          console.log(keyword);
          const paginationLinks = await ProductService.getUrlsForRange(1, productsPaginator.lastPage);
      
          return view.render('admin/productListPage', { products, pagination: productsPaginator, paginationLinks , keyword });
        } catch (error) {
          console.error(error);
          return response.status(500).json({ error: error.message });
        }
      }
//     public async search({ view,request, response }: HttpContextContract) {
//       try {
          
//           const keyword = request.input('keyword')
//           const products = await Product.query()
//               .where('product_name', 'like', `%${keyword}%`)
//               .orWhere('detail_product', 'like', `%${keyword}%`)
//               .paginate(1, 10)
              
//           const serializedProducts = products.serialize();

//           console.log(serializedProducts);
//           return view.render('admin/productListPage', { products:serializedProducts })
//       } catch (error) {
//         return response.status(500).json({ message: 'Internal Server Error' })
//       }
//   }
  
  
}