//db.js
const mysql = require('mysql2');

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'kevjo-prueba.crwgus8mkh15.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'Senati456',
  database: 'mi_app_db',
  connectTimeout: 10000 // 10 segundos de timeout para la conexión
});

// Intentar la conexión
connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error('Código:', err.code);
    console.error('Mensaje:', err.message);
    console.error('Fatal:', err.fatal);
    return;
  }

  console.log('✅ Conexión exitosa a la base de datos');
});

// Exportar la conexión para usarla en otros módulos
module.exports = connection;
