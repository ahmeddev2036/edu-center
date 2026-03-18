import 'reflect-metadata';
import { AppDataSource } from './data-source';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository('users');

  const email = process.env.ADMIN_EMAIL || 'admin@edu.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existing = await repo.findOne({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    await AppDataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await repo.save(repo.create({ email, passwordHash, role: 'admin' }));
  console.log(`✅ Admin created: ${email} / ${password}`);
  await AppDataSource.destroy();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
