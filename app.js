// app.js (backend)
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let cart = []; // ← después esto lo sacás a BD

// Obtener carrito
app.get("/cart", (req, res) => {
    res.json(cart);
});

// Agregar producto
app.post("/cart", (req, res) => {
    const item = req.body;
    cart.push(item);
    res.json({ msg: "Producto agregado", cart });
});

// Modificar cantidad
app.put("/cart/:index", (req, res) => {
    const index = req.params.index;
    const { count } = req.body;
    if (!cart[index]) return res.status(404).json({ error: "No existe el producto" });

    cart[index].count = count;
    res.json({ msg: "Cantidad actualizada", cart });
});

// Eliminar
app.delete("/cart/:index", (req, res) => {
    const index = req.params.index;
    if (!cart[index]) return res.status(404).json({ error: "No existe el producto" });

    cart.splice(index, 1);
    res.json({ msg: "Producto eliminado", cart });
});

app.listen(port, () => console.log("Backend funcionando en " + port));
