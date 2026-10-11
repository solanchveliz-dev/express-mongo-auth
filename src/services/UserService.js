import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@]).{8,}$/;

const normalizeRoleNames = (roles = []) => roles.map((role) => typeof role === 'string' ? role : (role && role.name) || 'user');

const toPublicUser = (user) => {
    if (!user) return null;

    return {
        _id: user._id || user.id,
        id: user._id || user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        birthdate: user.birthdate,
        url_profile: user.url_profile,
        adress: user.adress,
        roles: normalizeRoleNames(user.roles || []),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

class UserService {
    async getAll() {
        const users = await userRepository.getAll();
        return users.map((user) => toPublicUser(user));
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return toPublicUser(user);
    }

    async updateUser(id, input = {}) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        const payload = { ...input };
        if (payload.password) {
            if (!PASSWORD_REGEX.test(String(payload.password))) {
                const err = new Error('La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo (# $ % & * @).');
                err.status = 400;
                throw err;
            }

            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
            payload.password = await bcrypt.hash(payload.password, saltRounds);
        }

        if (payload.email) payload.email = String(payload.email).toLowerCase();
        if (payload.birthdate === '') delete payload.birthdate;

        const updated = await userRepository.updateById(id, payload);
        if (!updated) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        return toPublicUser(updated);
    }

    async deleteUser(id) {
        const deleted = await userRepository.deleteById(id);
        if (!deleted) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return { message: 'Usuario eliminado correctamente' };
    }
}

export default new UserService();