import userService from '../services/UserService.js';

class UserController {
    async getAll(req, res, next) {
        try {
            const users = await userService.getAll();
            return res.status(200).json(users);
        } catch (err) {
            return next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = await userService.getById(req.userId);
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async updateMe(req, res, next) {
        try {
            const updated = await userService.updateUser(req.userId, req.body || {});
            return res.status(200).json(updated);
        } catch (err) {
            return res.status(err.status || 500).json({ message: err.message || 'No se pudo actualizar el perfil.' });
        }
    }

    async getById(req, res, next) {
        try {
            const user = await userService.getById(req.params.id);
            return res.status(200).json(user);
        } catch (err) {
            return res.status(err.status || 500).json({ message: err.message || 'Usuario no encontrado' });
        }
    }

    async updateById(req, res) {
        try {
            const updated = await userService.updateUser(req.params.id, req.body || {});
            return res.status(200).json(updated);
        } catch (err) {
            return res.status(err.status || 500).json({ message: err.message || 'No se pudo actualizar usuario.' });
        }
    }

    async deleteById(req, res) {
        try {
            if (String(req.userId) === String(req.params.id)) {
                return res.status(400).json({ message: 'El admin no puede borrarse a sí mismo' });
            }

            const result = await userService.deleteUser(req.params.id);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(err.status || 500).json({ message: err.message || 'No se pudo eliminar usuario.' });
        }
    }
}

export default new UserController();