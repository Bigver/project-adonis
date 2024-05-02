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
          const product = await ProductService.createProduct(productData)
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
  
    async listProduct({ view , response}: HttpContextContract) {
      try {
        const filter = {};
        const products = await ProductService.all({ filter: filter }).paginate(1,10);
        const serializedProducts = products.serialize();
        return view.render('admin//productListPage', { products: serializedProducts })
      } catch (error) {
        console.error(error)
        return response.status(500).json({ error: 'Failed to fetch products' })
      }
    }
  }