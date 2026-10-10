const express = require('express');

const router = express.Router();

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

module.exports = router;
