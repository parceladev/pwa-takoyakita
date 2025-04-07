import { useEffect, useState } from "react"
import { db, Transaksi } from "../lib/db"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import Papa from "papaparse"
import Layout from "../components/Layout"
import Link from "next/link"

export default function LaporanPage() {
  const [data, setData] = useState<Transaksi[]>([])

  const exportToCSV = () => {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "laporan_transaksi.csv"
    link.click()
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text("Laporan Transaksi", 14, 16)

    autoTable(doc, {
      startY: 20,
      head: [["Tanggal", "Pelanggan", "Produk", "Jumlah", "Harga", "Total"]],
      body: data.map((t) => [
        new Date(t.tanggal).toLocaleDateString(),
        t.namaPelanggan,
        t.produk,
        t.jumlah.toString(),
        `Rp ${t.harga.toLocaleString()}`,
        `Rp ${t.total.toLocaleString()}`
      ]),
    })

    doc.save("laporan_transaksi.pdf")
  }

  useEffect(() => {
    const fetchData = async () => {
      const all = await db.transaksi.orderBy("tanggal").reverse().toArray()
      setData(all)
    }

    fetchData()
  }, [])

  const handleDelete = async (id?: number) => {
    if (!id) return
    await db.transaksi.delete(id)
    setData(data.filter((item) => item.id !== id))
  }

  const total = data.reduce((sum, t) => sum + t.total, 0)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Laporan Transaksi</h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={exportToCSV}
            className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
          >
            📤 Export CSV
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
          >
            🧾 Export PDF
          </button>
        </div>

        <div className="mb-2 font-medium">Total: Rp {total.toLocaleString()}</div>

        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Pelanggan</th>
              <th className="border p-2">Produk</th>
              <th className="border p-2">Jumlah</th>
              <th className="border p-2">Harga</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((t) => (
              <tr key={t.id}>
                <td className="border p-1">{new Date(t.tanggal).toLocaleDateString()}</td>
                <td className="border p-1">{t.namaPelanggan}</td>
                <td className="border p-1">{t.produk}</td>
                <td className="border p-1 text-center">{t.jumlah}</td>
                <td className="border p-1 text-right">Rp {t.harga.toLocaleString()}</td>
                <td className="border p-1 text-right">Rp {t.total.toLocaleString()}</td>
                <td className="border p-1 text-center">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(t.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </Layout>
  )
}
