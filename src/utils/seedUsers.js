import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Role from '../models/Role.js';
import User from '../models/User.js';
import inMemoryDb from './inMemoryDb.js';

async function seedUsers() {
  if (global.isMemoryMode || mongoose.connection.readyState !== 1) {
    const ensureRole = (name) => {
      const existingRole = inMemoryDb.roles.find((role) => role.name === name);
      if (existingRole) return existingRole;

      const newRole = { _id: `role_${inMemoryDb.roleCounter++}`, name };
      inMemoryDb.roles.push(newRole);
      return newRole;
    };

    ensureRole('user');
    const adminRole = ensureRole('admin');

    const createMemoryUser = async (email, password, userData, roleName) => {
      const saved = inMemoryDb.users.find((user) => user.email === email);
      if (saved) return saved;

      const passwordHash = await bcrypt.hash(password, 10);
      const user = {
        _id: `user_${inMemoryDb.userCounter++}`,
        ...userData,
        email,
        password: passwordHash,
        roles: [roleName],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inMemoryDb.users.push(user);
      return user;
    };

    const existingAdmin = inMemoryDb.users.find((user) => user.email === 'admin@local.test');
    if (existingAdmin) {
      console.log('Admin user already exists. Skipping creation.');
    } else {
      await createMemoryUser('admin@local.test', 'Admin@123', {
        name: 'Administrador',
        lastName: 'Principal',
        phoneNumber: '999999999',
        birthdate: new Date('1990-01-01'),
        url_profile: 'https://example.com/admin',
        adress: 'Sede Central'
      }, adminRole.name);
      console.log('Admin user created successfully.');
    }

    const existingDemo = inMemoryDb.users.find((user) => user.email === 'usuario@demo.com');
    if (existingDemo) {
      console.log('Demo user already exists. Skipping creation.');
      return existingDemo;
    }

    const demoUser = await createMemoryUser('usuario@demo.com', 'Usuario#2026', {
      name: 'Usuario',
      lastName: 'Demo',
      phoneNumber: '900000000',
      birthdate: new Date('2000-01-01'),
      url_profile: 'https://example.com/demo',
      adress: 'Lima, Perú'
    }, 'user');

    console.log('Demo user created successfully.');
    return demoUser;
  }

  const adminRole = await Role.findOne({ name: 'admin' });
  const userRole = await Role.findOne({ name: 'user' });
  if (!adminRole || !userRole) {
    throw new Error('Roles are missing. Seed roles first.');
  }

  const existingAdmin = await User.findOne({ email: 'admin@local.test' }).populate('roles');
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Administrador',
      lastName: 'Principal',
      email: 'admin@local.test',
      password: passwordHash,
      phoneNumber: '999999999',
      birthdate: new Date('1990-01-01'),
      url_profile: 'https://example.com/admin',
      adress: 'Sede Central',
      roles: [adminRole._id]
    });
    console.log('Admin user created successfully.');
  }

  const existingDemo = await User.findOne({ email: 'usuario@demo.com' }).populate('roles');
  if (!existingDemo) {
    const passwordHash = await bcrypt.hash('Usuario#2026', 10);
    await User.create({
      name: 'Usuario',
      lastName: 'Demo',
      email: 'usuario@demo.com',
      password: passwordHash,
      phoneNumber: '900000000',
      birthdate: new Date('2000-01-01'),
      url_profile: 'https://example.com/demo',
      adress: 'Lima, Perú',
      roles: [userRole._id]
    });
    console.log('Demo user created successfully.');
  }

  return { admin: true, demo: true };
}

export default seedUsers;
