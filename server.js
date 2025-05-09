const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta raíz
app.use(express.static(path.join(__dirname)));

// Ruta raíz: redirige a index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const pedidosPath = './data/pedidos.json';

function loadPedidos() {
  if (!fs.existsSync(pedidosPath)) return [];
  return JSON.parse(fs.readFileSync(pedidosPath));
}

function savePedidos(pedidos) {
  fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
}

// API endpoints
app.post('/api/pedidos', (req, res) => {
  const pedidos = loadPedidos();
  const pedido = { id: uuidv4(), ...req.body };
  pedidos.push(pedido);
  savePedidos(pedidos);
  res.json({ id: pedido.id });
});

app.get('/api/pedidos', (req, res) => {
  res.json(loadPedidos());
});

app.get('/api/pedidos/:id', (req, res) => {
  const pedidos = loadPedidos();
  const pedido = pedidos.find(p => p.id === req.params.id);
  if (pedido) res.json(pedido);
  else res.status(404).json({ error: 'Pedido no encontrado' });
});

app.put('/api/pedidos/:id', (req, res) => {
  const pedidos = loadPedidos();
  const index = pedidos.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    pedidos[index] = { ...pedidos[index], ...req.body };
    savePedidos(pedidos);
    res.json(pedidos[index]);
  } else {
    res.status(404).json({ error: 'Pedido no encontrado' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
