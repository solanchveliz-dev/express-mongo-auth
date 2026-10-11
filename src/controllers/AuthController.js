import jwt from 'jsonwebtoken';
import authService from '../services/AuthService.js';
import userRepository from '../repositories/UserRepository.js';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@]).{8,}$/;

const toPublicUser = (user) => {
    if (!user) return null;

    const roles = Array.isArray(user.roles)
        ? user.roles.map((role) => (typeof role === 'string' ? role : (role && role.name) || 'user'))
        : ['user'];

    return {
        _id: user._id || user.id,
        id: user._id || user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        birthdate: user.birthdate,
        url_profile: user.url_profile,
        adress: user.adress,
        roles,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

class AuthController {
    async signUp(req, res) {
        try {
            const payload = req.body || {};
            if (!payload.email || !payload.password)
                return res.status(400).json({ message: 'El email y password son requeridos' });

            if (!payload.name || !payload.lastName || !payload.phoneNumber || !payload.birthdate)
                return res.status(400).json({ message: 'Completa todos los campos obligatorios.' });

            if (!PASSWORD_REGEX.test(String(payload.password))) {
                return res.status(400).json({
                    message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo (# $ % & * @).'
                });
            }

            const user = await authService.signUp(payload);
            const token = jwt.sign(
                { sub: user.id || user._id, roles: ['user'] },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
            );

            return res.status(201).json({
                token,
                user: toPublicUser({ ...user, roles: ['user'] })
            });
        } catch (err) {
            const message = String(err.message || '').toLowerCase();
            if (message.includes('email') && message.includes('uso')) {
                return res.status(409).json({ message: 'El email ya se encuentra en uso' });
            }
            return res.status(err.status || 500).json({
                message: err.message || 'No se pudo completar el registro.'
            });
        }
    }

    async signIn(req, res) {
        try {
            const { email, password } = req.body || {};

            if (!email || !password)
                return res.status(400).json({ message: 'El email y password son requeridos' });

            const tokenPayload = await authService.signIn({ email, password });
            const user = await userRepository.findByEmail(email);

            return res.status(200).json({
                token: tokenPayload.token,
                user: toPublicUser(user)
            });
        } catch (err) {
            return res.status(err.status || 500).json({
                message: err.message || 'Credenciales inválidas'
            });
        }
    }
}

export default new AuthController();