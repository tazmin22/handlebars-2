const express = require('express')
const handlebars = require ('express-handlebars')
const { Server } = require('socket.io')  
const {PManager} = require ("./ProductManager.js")
const productsRouter = require ("./router/products.router.js")
const cartsRouter = require ("./router/carts.router.js")

const app = express()
const port = 8080
const ViewsRouter = require ('./router/api/views.router')


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'))

app.engine('handlebars', handlebars.engine())
app.set('view engine', "handlebars")
app.set('views', __dirname + '/views')


app.use('/views', ViewsRouter)


app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)


app.use(( err, req, res, next)=>{
  console.error(err.stack)
  res.status(500).send('Error de server')
})


app.get('/', (req, res) => {
  res.render('index', {
    title: 'e-commerse',
    name: 'Online',
    style: 'index.css'
  });
})

const productManager = new PManager ("./prueba.json")

app.get("/", async (req, res) => {
  res.render('index', {
    products : await productManager.getProducts()
  });
});

app.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    products: await productManager.getProducts(),
  });
});

app.post("/", async (req, res) => {
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

  // Emite el evento "products"
  io.emit("products", productManager.getProducts());

  res.status(201).json({
    success: true,
    product: newProduct,
  });
});

app.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  const product = await productManager.getProductsById(parseInt(pid));
  if (!product) {
    return res.status(400).send({ error: 'No se encontró el producto.' });
  }

  const index = productManager.products.indexOf(product);
  productManager.products.splice(index, 1);

  // Emite el evento "products"
  io.emit("products", productManager.getProducts());

  res.status(200).send({ message: 'Producto eliminado correctamente.' });
});


const serverHttp = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



const socketServer = new Server(serverHttp)
socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado')

    socket.on('recibirMensajeCliente', data => {
        console.log(data)
    })


    //esto sirve para cargar un producto
    socketServer.emit('evento-para-todos', 'este mensaje lo reciben todos')
  })