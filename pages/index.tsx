import Layout from "../components/Layout"
import Link from "next/link"

export default function Home() {
  return (
    <Layout title="Takoyakita App">
      <div className="">
        <div className="text-center flex flex-col gap-5 mb-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase text-gray-100">Portion All Outlets</p>
            <p className="text-6xl font-bold">42</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase text-gray-100">Cash All Outlets</p>
            <p className="text-xl font-bold">Rp. 385.000</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-sm text-gray-300">Features</p>
          <div className="flex gap-2">
            <div className="p-4 flex-1 text-center bg-amber-700 rounded">
              <p>Ingredients</p>
            </div>
            <div className="p-4 flex-1 text-center bg-amber-700 rounded">
              <p>Finances</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="p-4 flex-1 text-center bg-amber-700 rounded">
              <p>All Reports</p>
            </div>
            <div className="p-4 flex-1 text-center bg-amber-700 rounded">
              <Link href="/schedules">Create Schedules</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-2 mb-4">
          <p className="text-sm text-gray-300">Outlets</p>
          <div className="text-left p-2 bg-amber-600 rounded flex justify-between flex-1">
            <p className="text-lg">Pusat</p>
            <div className="flex flex-col text-right">
              <p>Rp. 356.000</p>
              <p>Porsi 56</p>
            </div>
          </div>
          <div className="text-left p-2 bg-amber-500 rounded flex justify-between flex-1">
            <p className="text-lg">K1</p>
            <div className="flex flex-col text-right">
              <p>Rp. 356.000</p>
              <p>Porsi 56</p>
            </div>
          </div>
          <div className="text-left p-2 bg-amber-400 rounded flex justify-between flex-1">
            <p className="text-lg">K2</p>
            <div className="flex flex-col text-right">
              <p>Rp. 356.000</p>
              <p>Porsi 56</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
