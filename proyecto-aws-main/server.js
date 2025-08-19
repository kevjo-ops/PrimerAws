const express = require('express');
const app = express();
const connection = require('./db');  // Conexión a la base de datos

// Middleware para procesar el cuerpo de la solicitud en formato JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Esto es necesario para los formularios

// URL pública de tu imagen en S3
const imagenS3 = 'https://s3-ubuntu-proyect.s3.us-east-2.amazonaws.com/aws-servicios-principales.jpg';

// Ruta principal para mostrar la imagen y los usuarios de la base de datos
app.get('/', (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).send('Error al obtener usuarios');
        }

        let usuariosHTML = '';
        results.forEach(user => {
            usuariosHTML += `<li>
                ${user.nombre} - ${user.email} <br> Comentario: ${user.comentario}
                <form action="/usuarios/eliminar/${user.id}" method="POST" style="display:inline;">
                    <button type="submit">Eliminar</button>
                </form>
            </li>`;
        });

        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mi primer despliegue</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        padding: 20px;
                    }
                    
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: rgba(255, 255, 255, 0.95);
                        border-radius: 20px;
                        padding: 40px;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                        backdrop-filter: blur(10px);
                    }
                    
                    h1 {
                        color: #2c3e50;
                        margin-bottom: 30px;
                        font-size: 2.2em;
                        text-align: center;
                        font-weight: 700;
                        background: linear-gradient(45deg, #667eea, #764ba2);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    
                    .hero-image {
                        display: block;
                        margin: 30px auto;
                        max-width: 100%;
                        height: auto;
                        border-radius: 15px;
                        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
                        transition: transform 0.3s ease;
                    }
                    
                    .hero-image:hover {
                        transform: scale(1.02);
                    }
                    
                    h2 {
                        color: #2c3e50;
                        margin: 40px 0 20px;
                        font-size: 1.6em;
                        text-align: center;
                        position: relative;
                    }
                    
                    h2::after {
                        content: '';
                        position: absolute;
                        bottom: -8px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 50px;
                        height: 3px;
                        background: linear-gradient(45deg, #667eea, #764ba2);
                        border-radius: 2px;
                    }
                    
                    .usuarios-list {
                        list-style: none;
                        padding: 0;
                        margin: 20px 0;
                    }
                    
                    .usuarios-list li {
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                        margin: 15px 0;
                        padding: 20px;
                        border-radius: 12px;
                        border-left: 4px solid #667eea;
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                        transition: all 0.3s ease;
                    }
                    
                    .usuarios-list li:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                    }
                    
                    .form-container {
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                        padding: 30px;
                        border-radius: 15px;
                        margin-top: 30px;
                        box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
                    }
                    
                    .form-group {
                        margin-bottom: 20px;
                    }
                    
                    input[type="text"], 
                    input[type="email"], 
                    textarea {
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #e9ecef;
                        border-radius: 10px;
                        font-size: 16px;
                        transition: all 0.3s ease;
                        font-family: inherit;
                    }
                    
                    input[type="text"]:focus, 
                    input[type="email"]:focus, 
                    textarea:focus {
                        outline: none;
                        border-color: #667eea;
                        box-shadow: 0 0 15px rgba(102, 126, 234, 0.2);
                        transform: translateY(-2px);
                    }
                    
                    textarea {
                        resize: vertical;
                        min-height: 100px;
                    }
                    
                    .btn {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                    }
                    
                    .btn-delete {
                        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                        padding: 8px 16px;
                        font-size: 14px;
                        margin-left: 10px;
                    }
                    
                    .btn-delete:hover {
                        box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
                    }
                    
                    .btn-submit {
                        width: 100%;
                        padding: 15px;
                        font-size: 18px;
                    }
                    
                    @media (max-width: 768px) {
                        .container {
                            padding: 20px;
                            margin: 10px;
                        }
                        
                        h1 {
                            font-size: 1.8em;
                        }
                        
                        .hero-image {
                            max-width: 300px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Mi primer despliegue de Aplicación Web en AWS con Node.js</h1>
                    <img src="${imagenS3}" alt="Imagen desde S3" class="hero-image">
                    
                    <h2>Accediendo a los datos de la base de datos</h2>
                    <ul class="usuarios-list">
                        ${usuariosHTML}
                    </ul>

                    <h2>Añadir Comentario</h2>
                    <div class="form-container">
                        <form action="/usuarios" method="POST">
                            <div class="form-group">
                                <input type="text" name="nombre" placeholder="Tu nombre" required>
                            </div>
                            <div class="form-group">
                                <input type="email" name="email" placeholder="Tu email" required>
                            </div>
                            <div class="form-group">
                                <textarea name="comentario" placeholder="Tu comentario" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-submit">Añadir Comentario</button>
                        </form>
                    </div>
                </div>
            </body>
            </html>
        `);
    });
});

// Ruta para añadir un nuevo comentario
app.post('/usuarios', (req, res) => {
    const { nombre, email, comentario } = req.body;

    const query = 'INSERT INTO usuarios (nombre, email, comentario) VALUES (?, ?, ?)';
    connection.query(query, [nombre, email, comentario], (err, results) => {
        if (err) {
            console.error('Error al insertar el comentario:', err);
            return res.status(500).send('Error al agregar el comentario');
        }
        res.redirect('/');  // Redirigir a la página principal
    });
});

// Ruta para eliminar un comentario
app.post('/usuarios/eliminar/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar el comentario:', err);
            return res.status(500).send('Error al eliminar el comentario');
        }
        res.redirect('/');  // Redirigir a la página principal
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 80;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor en puerto ${PORT}`));
