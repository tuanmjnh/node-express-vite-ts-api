import { RoleModel } from '@modules/role/role.model';
import { GroupModel } from '@modules/group/group.model';
import { UserModel } from '@modules/user/user.model';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
  try {
    // Roles
    const roles = [
      { key: 'admin.full', name: 'Administrator', level: 10 },
      { key: 'user.read', name: 'User Read', level: 1 }
    ];
    for (const r of roles) {
      const exists = await RoleModel.findOne({ key: r.key });
      if (!exists) await RoleModel.create(r);
    }

    // Groups
    const groups = [
      { type: 'system', code: 'ADMIN', title: 'Admin Group' },
      { type: 'system', code: 'USER', title: 'User Group' }
    ];
    for (const g of groups) {
      const exists = await GroupModel.findOne({ code: g.code });
      if (!exists) await GroupModel.create(g);
    }

    // Default admin
    const admin = await UserModel.findOne({ account: 'admin' });
    if (!admin) {
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash('123456', salt);
      await UserModel.create({
        account: 'admin',
        password: hashed,
        salt,
        name: 'Administrator',
        email: 'admin@example.com',
        group: 'ADMIN',
        roles: ['admin.full']
      });
      console.log('✅ Seeded admin account: admin / 123456');
    }
  } catch (err) {
    console.error('❌ Seed error', err);
  }
}
