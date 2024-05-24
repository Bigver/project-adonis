import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import LogService from "App/Service/log_service";
import ProductService from "App/Service/product_service";
import uploadService from "App/Service/uploads_service";

export default class ProductsController {
  public async productListAdmin({ view }: HttpContextContract) {
    return view.render("admin/productListPage");
  }

  public async productAdmin({ view }: HttpContextContract) {
    return view.render("admin/productPage");
  }

  async createProduct({ request, response, view }: HttpContextContract) {
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
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to add product data"
      return view.render('error', { error })
    }
  }


  async updateProduct({ params, request, response, view }: HttpContextContract) {
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
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to update product data"
      return view.render('error', { error })
    }
  }

  async updateProductPage({ params, view }: HttpContextContract) {
    try {
      const { id } = params;
      let product = await ProductService.findById(id)
      return view.render("admin/updateProductPage", { product });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to open update product page"
      return view.render('error', { error })
    }
  }

  async editProduct({ params, view }: HttpContextContract) {
    try {
      const id = params.id;
      const product = await ProductService.findById(id);
      return view.render("admin/productUpdatePage", { product, productId: id });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to open edit product page"
      return view.render('error', { error })
    }
  }

  async deleteProduct({ response, params, view }: HttpContextContract) {
    try {
      await ProductService.delete(params.id);
      return response.redirect("back");
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to open delete product"
      return view.render('error', { error })
    }
  }

  async listProduct({ request, view }: HttpContextContract) {
    try {
      const filters: any = {};
      let page = request.input("page", 1); // รับค่าหน้าปัจจุบันจาก request
      const perPage = 5; // จำนวนรายการต่อหน้า
      // ดึงข้อมูลสินค้าพร้อมที่แบ่งหน้า
      const keyword = request.input("keyword");
      filters.keyword = keyword;

      const products: any = await ProductService.all({ filters });

      const startIndex = (page - 1) * perPage;
      const endIndex = Math.min(startIndex + perPage, products.length);
      const paginatedProducts = products.slice(startIndex, endIndex);

      return view.render("admin/productListPage", {
        products: paginatedProducts,
        pagination: products,
        total: products.length,
        perPage: perPage,
        currentPage: parseInt(page),
        lastPage: Math.ceil(products.length / perPage),
      });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      LogService.create(level, message);
      error = "Failed to open list product"
      return view.render('error', { error })
    }
  }
}

