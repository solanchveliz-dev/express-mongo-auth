const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Role = require('../models/Role');
const User = require('../models/User');
const inMemoryDb = require('./inMemoryDb');

async function seedUsers() {
  if (mongoose.connection.readyState !== 1) {
    const adminRole = inMemoryDb.roles.find((role) => role.name === 'admin')
      || { _id: `role_${inMemoryDb.roleCounter++}`, name: 'admin' };

    if (!inMemoryDb.roles.some((role) => role.name === 'admin')) {
      inMemoryDb.roles.push(adminRole);
    }

    const existingAdmin = inMemoryDb.users.find((user) => user.email === 'admin@local.test');
    if (existingAdmin) {
      console.log('Admin user already exists. Skipping creation.');
      return existingAdmin;
    }

    const passwordHash = await bcrypt.hash('Admin@123', 10);
    const adminUser = {
      _id: `user_${inMemoryDb.userCounter++}`,
      name: 'Administrador',
      lastName: 'Principal',
      email: 'admin@local.test',
      password: passwordHash,
      phoneNumber: '999999999',
      birthdate: new Date('1990-01-01'),
      url_profile: 'https://example.com/admin',
      adress: 'Sede Central',
      roles: [adminRole._id],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    inMemoryDb.users.push(adminUser);
    console.log('Admin user created successfully.');
    return adminUser;
  }

  const adminRole = await Role.findOne({ name: 'admin' });
  if (!adminRole) {
    throw new Error('Admin role is missing. Seed roles first.');
  }

  const existingAdmin = await User.findOne({ email: 'admin@local.test' }).populate('roles');
  if (existingAdmin) {
    console.log('Admin user already exists. Skipping creation.');
    return existingAdmin;
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const adminUser = await User.create({
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
  return adminUser;
}

if (require.main === module) {
  seedUsers().catch((error) => {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  });
}

module.exports = { seedUsers };
