import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('landing', { title: 'Express Auth | Seguridad JWT' });
});

router.get('/signIn', (req, res) => {
  res.render('signin', { title: 'Iniciar sesión' });
});

router.get('/signUp', (req, res) => {
  res.render('signup', { title: 'Crear cuenta' });
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

router.get('/profile', (req, res) => {
  res.render('profile', { title: 'Mi cuenta' });
});

router.get('/admin', (req, res) => {
  res.render('admin', { title: 'Panel administrador' });
});

router.get('/403', (req, res) => {
  res.render('403', { title: 'Acceso denegado' });
});

router.get('/404', (req, res) => {
  res.render('404', { title: 'Página no encontrada' });
});

export default router;
