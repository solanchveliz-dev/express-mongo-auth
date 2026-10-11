import mongoose from 'mongoose';
import User from '../models/User.js';
import inMemoryDb from '../utils/inMemoryDb.js';

const MEMORY_MODE = () => global.isMemoryMode || mongoose.connection.readyState !== 1;

const normalizeRoles = (roles = []) => {
    return roles.map((role) => {
        if (typeof role === 'string') return role;
        if (role && typeof role === 'object') return role.name || role._id;
        return role;
    });
};

const normalizeUser = (user) => {
    if (!user) return null;

    return {
        ...user,
        _id: user._id,
        id: user._id,
        email: user.email ? user.email.toLowerCase() : user.email,
        roles: normalizeRoles(user.roles || [])
    };
};

class UserRepository {
    async create(userData) {
        if (MEMORY_MODE()) {
            const payload = {
                ...userData,
                _id: userData._id || `user_${inMemoryDb.userCounter++}`,
                email: (userData.email || '').toLowerCase(),
                roles: normalizeRoles(userData.roles || []),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            inMemoryDb.users.push(payload);
            return normalizeUser(payload);
        }

        const user = new User(userData);
        return user.save();
    }

    async findByEmail(email) {
        if (MEMORY_MODE()) {
            const normalizedEmail = (email || '').toLowerCase();
            const user = inMemoryDb.users.find((item) => (item.email || '').toLowerCase() === normalizedEmail);
            return normalizeUser(user);
        }

        return User.findOne({ email }).populate('roles').exec();
    }

    async findById(id) {
        if (MEMORY_MODE()) {
            const user = inMemoryDb.users.find((item) => String(item._id) === String(id));
            return normalizeUser(user);
        }

        return User.findById(id).populate('roles').exec();
    }

    async updatePassword(id, hashedPassword) {
        if (MEMORY_MODE()) {
            const user = inMemoryDb.users.find((item) => String(item._id) === String(id));
            if (!user) return null;
            user.password = hashedPassword;
            user.updatedAt = new Date();
            return normalizeUser(user);
        }

        return User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).exec();
    }

    async getAll() {
        if (MEMORY_MODE()) {
            return inMemoryDb.users.map((user) => normalizeUser(user));
        }

        return User.find().populate('roles').exec();
    }

    async updateById(id, payload) {
        if (MEMORY_MODE()) {
            const user = inMemoryDb.users.find((item) => String(item._id) === String(id));
            if (!user) return null;

            Object.assign(user, payload, {
                updatedAt: new Date()
            });
            return normalizeUser(user);
        }

        return User.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate('roles').exec();
    }

    async deleteById(id) {
        if (MEMORY_MODE()) {
            const index = inMemoryDb.users.findIndex((item) => String(item._id) === String(id));
            if (index === -1) return null;
            const [deleted] = inMemoryDb.users.splice(index, 1);
            return normalizeUser(deleted);
        }

        return User.findByIdAndDelete(id).exec();
    }
}

export default new UserRepository();