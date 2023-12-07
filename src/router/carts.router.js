const {Router} = require('express')
const CartsManagerFile = require ("../CartsManager.js")


const router = Router();
const carrito = new CartsManagerFile ('./carrito.json')



router.get('/:cid', async (req,res)=>{
    try {
        const {cid} = req.params
        const cart = await carrito.getCartById(parseInt(cid))
        res.send({
            status: 'success',
            payload: cart
        })
        
    } catch (error) {
        console.log("error")
    }
})



router.post('/:cid/product/:pid' , async (req, res) => {
 const cid = req.params.cid;
 const pid = req.params.pid;

 const resp = await carrito.addProduct(cid,pid)

 if (typeof (resp) === "string") {
  res.status(400).json({
   status: "fail",
   data: resp
 })} else {
  res.status(200).json({
   status: "ok",
   data: carrito.items.push(pid)
 })}
})




module.exports = router