import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Warehouse from '#models/warehouse'

export default class extends BaseSeeder {
  async run() {
    // Buat gudang dulu, biar user bisa di-assign ke situ
    const warehouse = await Warehouse.create({
      name: 'Gudang Pusat',
      address: 'Jl. Industri No. 10, Jakarta',
    })

    // Buat akun admin
    await User.create({
      fullName: 'Admin StokKu',
      email: 'admin@stokku.test',
      password: 'password123',
      role: 'admin',
      warehouseId: null, // admin akses semua gudang, tidak terikat 1 gudang
    })

    // Buat akun staff, terikat ke 1 gudang
    await User.create({
      fullName: 'Staff Gudang Pusat',
      email: 'staff@stokku.test',
      password: 'password123',
      role: 'staff',
      warehouseId: warehouse.id,
    })

    console.log('✅ Users & Warehouse seeded')
  }
}