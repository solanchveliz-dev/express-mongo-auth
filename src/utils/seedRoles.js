import mongoose from 'mongoose';
import roleRepository from '../repositories/RoleRepository.js';
import inMemoryDb from './inMemoryDb.js';

export default async function seedRoles() {
    if (global.isMemoryMode || mongoose.connection.readyState !== 1) {
        const ensureRole = (name) => {
            const existing = inMemoryDb.roles.find((role) => role.name === name);
            if (existing) return existing;

            const created = { _id: `role_${inMemoryDb.roleCounter++}`, name };
            inMemoryDb.roles.push(created);
            return created;
        };

        ensureRole('user');
        ensureRole('admin');
        console.log('Seeded memory roles: user, admin');
        return inMemoryDb.roles;
    }

    const existing = await roleRepository.getAll();
    if (existing.length === 0) {
        await roleRepository.create({ name: 'user' });
        await roleRepository.create({ name: 'admin' });
        console.log('Seeded roles: user, admin');
    }
}