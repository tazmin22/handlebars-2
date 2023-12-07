const fs = require("node:fs");


class productManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.nextId = 1;
  }

  async addProducts(title, description, price, thumbnail, code, stock) {
    const newProduct = {
      id: this.nextId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(newProduct);
    const productosEnString = JSON.stringify(this.products, null, 2);
    await fs.promises.writeFile(this.path, productosEnString);
  }

  async getProducts() {
    let productsEnElArchivo = await fs.promises.readFile(this.path, "utf-8");
    productsEnElArchivo = JSON.parse(productsEnElArchivo);
    return productsEnElArchivo;
  }

  async getProductsById(id) {
      const products = await this.getProducts();
      for (const product of products)
     {
      if (product.id === id) {
        return product;
      }
    }
    throw new Error("El producto con id " + id + " no existe");
  }

  async updateProduct(id, field, value) {
    const product = await this.getProductsById(id);
    if (field === "id") {
      throw new Error("No se puede actualizar el id del producto");
    }
    product[field] = value;
    const productosEnString = JSON.stringify(this.products, null, 2);
    await fs.promises.writeFile(this.path, productosEnString);
    return product;
  }
  async deleteProduct(id) {
    const product = await this.getProductsById(id);
    if (!product) {
      throw new Error("El producto con id " + id + " no existe");
    }

    this.products.splice(this.products.indexOf(product), 1);
    const productosEnString = JSON.stringify(this.products, null, 2);
    await fs.promises.writeFile(this.path, productosEnString);
  }
};
module.exports = { PManager: productManager }

// async function cosasAsincronicas() {
//   const usuariosManager = new productManager("prueba.json");
//   //const producto = await usuariosManager.getProductsById(1);
// //console.log(producto);
//   await usuariosManager.addProducts("producto 1", "Una buena descripcion", "110", "https://pbs.twimg.com/media/EqQyddcW8AEP5ur.jpg", "1", "10");
//   await usuariosManager.addProducts("producto 2", "description", "price", "thumbnail", "code", "stock");
//   await usuariosManager.addProducts("producto 3", "una buena descripcion", 123, "sin imagen", 3, 3);
//  await usuariosManager.addProducts("producto 4", "description", "price", "thumbnail", "code", "stock");
//   await usuariosManager.addProducts("producto 5", "description", "price", "thumbnail", "code", "stock");
//   await usuariosManager.addProducts("producto 6", "una buena descripcion", 123, "sin imagen", 3, 3);
//   await usuariosManager.addProducts("producto 7", "description", "price", "thumbnail", "code", "stock");
//   await usuariosManager.addProducts("producto 8", "description", "price", "thumbnail", "code", "stock");
//   await usuariosManager.addProducts("producto 9", "una buena descripcion", 123, "sin imagen", 3, 3);
// await usuariosManager.addProducts("producto 10", "una buena descripcion", 123, "sin imagen", 3, 3);
 
//  await usuariosManager.deleteProduct(3);

//  const producto = await usuariosManager.updateProduct(1, "title", "probando un nuevo titulo"  );
//  const producto1 = await usuariosManager.updateProduct(1, "description", "probando una nueva descripcion" );
//  console.log(producto);
// }

// return cosasAsincronicas();