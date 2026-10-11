import mongoose from 'mongoose';
import Role from '../models/Role.js';
import inMemoryDb from '../utils/inMemoryDb.js';

const MEMORY_MODE = () => global.isMemoryMode || mongoose.connection.readyState !== 1;

class RoleRepository {
    async findByName(name) {
        if (MEMORY_MODE()) {
            const role = inMemoryDb.roles.find((item) => item.name === name);
            return role ? { ...role, id: role._id } : null;
        }

        return Role.findOne({ name }).exec();
    }

    async create(role) {
        if (MEMORY_MODE()) {
            const created = {
                _id: `role_${inMemoryDb.roleCounter++}`,
                name: role.name,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            inMemoryDb.roles.push(created);
            return created;
        }

        return Role.create(role);
    }

    async getAll() {
        if (MEMORY_MODE()) {
            return inMemoryDb.roles.map((role) => ({ ...role, id: role._id }));
        }

        return Role.find().exec();
    }
}

export default new RoleRepository();