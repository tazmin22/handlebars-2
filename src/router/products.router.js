const {Router} = require('express')
const {PManager} = require ("../ProductManager")
const router = Router();

const productManager = new PManager ("./prueba.json")

router
.get ("/" ,async (req, res) => {
    const products = await productManager.getProducts();
    res.status(200).send({
        status:"sucess",
        payload: products
    }
    )
})
.get ("/:pid" , async (req, res) => {
    const {pid} = req.params
    const productos = await productManager.getProductsById(parseInt(pid))
    if (!productos){
        return res.status(400).send({error: 'Se produjo un error al recuperar productos.'})
    }
    res.send({productos});
    
})

.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
  
    const id = productManager.nextId++;
  
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
  
    productManager.products.push(newProduct);
    res.status(201).json({
      success: true,
      product: newProduct,
    })
  })


  .put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductsById(parseInt(pid));
    if (!product) {
      return res.status(400).send({ error: 'No se encontró el producto.' });
    }

    const updateData = {
      title: req.body.title || product.title,
      description: req.body.description || product.description,
      price: req.body.price || product.price,
      thumbnail: req.body.thumbnail || product.thumbnail,
      code: req.body.code || product.code,
      stock: req.body.stock || product.stock,
    };

    productManager.products[productManager.products.indexOf(product)] = updateData;
    res.status(200).send({ message: 'Producto actualizado correctamente.' });
  })






  .delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductsById(parseInt(pid));
    if (!product) {
      return res.status(400).send({ error: 'No se encontró el producto.' });
    }
    productManager.products.splice(productManager.products.indexOf(product), 1);
    res.status(200).send({ message: 'Producto eliminado correctamente.' });
  })




module.exports = router

