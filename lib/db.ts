import Dexie, { Table } from 'dexie'

export interface Transaksi {
  id?: number
  tanggal: string
  namaPelanggan: string
  produk: string
  jumlah: number
  harga: number
  total: number
}

class UMKMDatabase extends Dexie {
  transaksi!: Table<Transaksi, number>

  constructor() {
    super('UMKMDatabase')
    this.version(1).stores({
      transaksi: '++id, tanggal, namaPelanggan, produk'
    })
  }
}

export const db = new UMKMDatabase()
