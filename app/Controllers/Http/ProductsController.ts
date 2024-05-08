import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Product from "App/Models/Product";
import UrlService from "App/Service/getUrl_service";
import ProductService from "App/Service/product_service";
import uploadService from "App/Service/uploads_service";

export default class ProductsController {
  async createProduct({ request, response }: HttpContextContract) {
    try {
      const File1 = request.file("imagefile1", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const File2 = request.file("imagefile2", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const File3 = request.file("imagefile3", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });

      const fileName1 = await uploadService.upload(File1);
      const fileName2 = await uploadService.upload(File2);
      const fileName3 = await uploadService.upload(File3);
      
      const productData = request.only([
        "product_name",
        "price_product",
        "img_product",
        "img2_product",
        "img3_product",
        "detail_product",
      ]);

      if (File1) {
        await uploadService.deleteFile(productData.img_product);
        productData.img_product = `/uploads/${fileName1}`;
      }
      if (File2) {
        await uploadService.deleteFile(productData.img2_product);
        productData.img2_product = `/uploads/${fileName2}`;
      }
      if (File3) {
        await uploadService.deleteFile(productData.img3_product);
        productData.img3_product = `/uploads/${fileName3}`;
      }

      await ProductService.createProduct(productData);
      return response.redirect().back();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to create product" });
    }
  }

  async updateProduct({ params, request, response }: HttpContextContract) {
    try {
      const { id } = params;

      const File1 = request.file("imagefile1", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const File2 = request.file("imagefile2", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const File3 = request.file("imagefile3", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });

      const fileName1 = await uploadService.upload(File1);
      const fileName2 = await uploadService.upload(File2);
      const fileName3 = await uploadService.upload(File3);

      const productData = request.only([
        "product_name",
        "price_product",
        "img_product",
        "img2_product",
        "img3_product",
        "detail_product", // เพิ่ม detail_product ใน request.only
      ]);
      if (File1) {
        await uploadService.deleteFile(productData.img_product);
        productData.img_product = `/uploads/${fileName1}`;
      }
      if (File2) {
        await uploadService.deleteFile(productData.img2_product);
        productData.img2_product = `/uploads/${fileName2}`;
      }
      if (File3) {
        await uploadService.deleteFile(productData.img3_product);
        productData.img3_product = `/uploads/${fileName3}`;
      }

      await ProductService.updateProduct(id, productData);
      return response.redirect().back();
    } catch (error) {
      return response.badRequest(error.message);
    }
  }

  async updateProductPage({ params, view }: HttpContextContract) {
    const product = await Product.find(params.id);
    return view.render("admin/updateProductPage", { product });
  }

  async editProduct({ params, view }: HttpContextContract) {
    const Products = await ProductService.all({ filters: { id: params.id } });
    const Product = Products[0];
    const product = Product.serialize();
    return view.render("admin/UpdateProductPage", { product });
  }

  async deleteProduct({ response, params }: HttpContextContract) {
    await ProductService.delete(params.id);
    return response.redirect("back");
  }

  

  async listProduct({ request, view, response }: HttpContextContract) {
    try {
      const filter = {}
      let page = request.input('page', 1); // รับค่าหน้าปัจจุบันจาก request
      const limit = 10; // จำนวนรายการต่อหน้า
      page = Math.max(page, 1);
      // ดึงข้อมูลสินค้าพร้อมที่แบ่งหน้า
      let products : any
      const keyword = request.input('keyword')
      let productsPaginator : any
      if (keyword){
        productsPaginator = await ProductService.searchProduct(keyword , page);
        products = productsPaginator.serialize();
      } else {
        productsPaginator = await ProductService.all({filter}).paginate(page, limit);
        
        products = productsPaginator.serialize();
      }
      const paginationLinks = await UrlService.getUrlsForRange(1, productsPaginator.lastPage);
  
      return view.render('admin/productListPage', { products, pagination: productsPaginator, paginationLinks , keyword });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: error.message });
    }
  }
}
