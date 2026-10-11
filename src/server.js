import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import webRoutes from './routes/web.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

global.isMemoryMode = !process.env.MONGODB_URI || !process.env.MONGODB_URI.trim();

// Habilitar CORS para todos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

// Rutas web y API
app.use('/', webRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Validar estado del servidor
app.get('/health', (req, res) => {
    const connected = global.isMemoryMode ? false : mongoose.connection.readyState === 1;
    const databaseName = mongoose.connection && mongoose.connection.name ? mongoose.connection.name : null;

    return res.status(200).json({
        status: 'ok',
        message: 'API funcionando correctamente',
        database: {
            connected,
            name: databaseName,
            mode: global.isMemoryMode ? 'memory' : 'atlas'
        }
    });
});

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

if (global.isMemoryMode) {
    console.log('MONGODB_URI no definida. Ejecutando en modo memoria.');
    await seedRoles();
    await seedUsers();
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
} else {
    mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
        .then(async () => {
            console.log('Mongo connected');
            await seedRoles();
            await seedUsers();
            app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
        })
        .catch(err => {
            console.error('Error al conectar con Mongo:', err);
            process.exit(1);
        });
}