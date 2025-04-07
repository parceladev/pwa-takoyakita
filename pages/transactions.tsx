import { useState } from "react"
import { db } from "../lib/db"
import Layout from "../components/Layout"
import Link from "next/link"

export default function TransaksiPage() {
  const [form, setForm] = useState({
    namaPelanggan: "",
    produk: "",
    jumlah: 1,
    harga: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const total = Number(form.jumlah) * Number(form.harga)

    await db.transaksi.add({
      tanggal: new Date().toISOString(),
      namaPelanggan: form.namaPelanggan,
      produk: form.produk,
      jumlah: Number(form.jumlah),
      harga: Number(form.harga),
      total,
    })

    alert("Transaksi disimpan ✅")
    setForm({
      namaPelanggan: "",
      produk: "",
      jumlah: 1,
      harga: 0,
    })
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Input Transaksi</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="namaPelanggan"
            placeholder="Nama Pelanggan"
            value={form.namaPelanggan}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="produk"
            placeholder="Produk"
            value={form.produk}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="jumlah"
            placeholder="Jumlah"
            value={form.jumlah}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="harga"
            placeholder="Harga per unit"
            value={form.harga}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Simpan Transaksi
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </Layout>
  )
}
