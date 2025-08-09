const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('¡Hola este es mi primer despliege web con aws y node.js!');
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});