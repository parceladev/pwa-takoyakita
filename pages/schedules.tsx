import { useEffect, useState } from "react"
import { useRouter } from "next/router"

const employeePreferences: {
  [code: string]: {
    name: string
    outletPriority: string[]
    minShifts: number
    maxShifts: number
  }
} = {
  A: { name: "Daude", outletPriority: ["🌟", "🌟", "🌟", "🍄", "🥦"], minShifts: 5, maxShifts: 7 },
  K: { name: "Komang", outletPriority: ["🌟", "🌟", "🌟", "🍄", "🥦"], minShifts: 6, maxShifts: 8 },
  N: { name: "Nara", outletPriority: ["🍄", "🥦", "🍄", "🥦", "🌟"], minShifts: 5, maxShifts: 6 },
  G: { name: "Gerry", outletPriority: ["🍄", "🥦", "🍄", "🥦", "🌟"], minShifts: 5, maxShifts: 6 },
  R: { name: "Rian", outletPriority: ["🌟", "🌟", "🌟", "🍄", "🥦"], minShifts: 6, maxShifts: 8 },
  I: { name: "Zia", outletPriority: ["🍄", "🥦", "🍄", "🥦", "🌟"], minShifts: 6, maxShifts: 8 },
  P: { name: "Pande", outletPriority: ["🥦", "🍄", "🌟"], minShifts: 4, maxShifts: 6 },
}

const outlets = ["🌟", "🍄", "🥦"]
const shifts = ["pagi", "malam"]
const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

interface Availability {
  [day: string]: {
    [shift: string]: {
      [outlet: string]: boolean
    }
  }
}

interface Schedule {
  [day: string]: {
    [shift: string]: {
      [outlet: string]: string[]
    }
  }
}

export default function SchedulePage() {
  const router = useRouter()
  const [customScheduleText, setCustomScheduleText] = useState("");
  const [availability, setAvailability] = useState<{
    [employeeCode: string]: Availability
  }>(() => {
    const initial: any = {}
    Object.keys(employeePreferences).forEach((code) => {
      initial[code] = {}
      days.forEach((day) => {
        initial[code][day] = {}
        shifts.forEach((shift) => {
          initial[code][day][shift] = {}
          outlets.forEach((outlet) => {
            initial[code][day][shift][outlet] = day !== "Minggu"
          })
        })
      })
    })
    return initial
  })

  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [shiftSummary, setShiftSummary] = useState<{ [code: string]: number }>({})

  useEffect(() => {
    if (schedule) {
      setCustomScheduleText(formatScheduleText());
    }
  }, [schedule]);  

  const toggleAvailability = (emp: string, day: string, shift: string, outlet: string) => {
    setAvailability((prev) => ({
      ...prev,
      [emp]: {
        ...prev[emp],
        [day]: {
          ...prev[emp][day],
          [shift]: {
            ...prev[emp][day][shift],
            [outlet]: !prev[emp][day][shift][outlet],
          },
        },
      },
    }))
  }

    const generateSchedule = () => {
        const newSchedule: Schedule = {}
        const shiftCount: { [code: string]: number } = {}
        const outletAssignments: { [code: string]: { [day: string]: string[] } } = {}

        Object.keys(employeePreferences).forEach((code) => {
        shiftCount[code] = 0
        outletAssignments[code] = {}
        })

        const getPreviousDay = (day: string) => {
        const idx = days.indexOf(day)
        return idx > 0 ? days[idx - 1] : null
        }

        const getAvailableAndEligible = (day: string, shift: string, outlet: string) => {
        return Object.keys(employeePreferences)
            .filter((emp) => {
            if (!availability[emp][day][shift][outlet]) return false
            if (shiftCount[emp] >= employeePreferences[emp].maxShifts) return false

            const prevDay = getPreviousDay(day)

            // Hindari shift pagi setelah malam sebelumnya
            if (shift === "pagi" && prevDay) {
                for (const o of outlets) {
                if (schedule?.[prevDay]?.["malam"]?.[o]?.includes(emp)) return false
                }
            }

            // Hindari double shift di hari yang sama
            const prevShift = shift === "malam" ? "pagi" : null
            if (prevShift && schedule?.[day]?.[prevShift]) {
                for (const o of outlets) {
                if (schedule[day][prevShift][o]?.includes(emp)) return false
                }
            }

            // Batasan khusus outlet
            if ((emp === "R" || emp === "A") && outlet !== "🌟") return false

            // Hindari satu pegawai di dua outlet dalam 1 hari
            const assignedOutlets = outletAssignments[emp][day] || []
            if (assignedOutlets.length > 0 && !assignedOutlets.every((o) => o === outlet)) return false

            return true
            })
            .sort((a, b) => {
            const aNeed = shiftCount[a] < employeePreferences[a].minShifts ? 0 : 1
            const bNeed = shiftCount[b] < employeePreferences[b].minShifts ? 0 : 1
            if (aNeed !== bNeed) return aNeed - bNeed

            const outletScore = (emp: string) => {
                let score = employeePreferences[emp].outletPriority.filter((x) => x === outlet).length
                if (emp === "K" && outlet !== "🌟") score -= 0.5
                return score
            }

            return outletScore(b) - outletScore(a)
            })
        }

        days.forEach((day) => {
        newSchedule[day] = {}
        shifts.forEach((shift) => {
            newSchedule[day][shift] = {}

            const sortedOutlets = ["🌟", "🥦", "🍄"]
            sortedOutlets.forEach((outlet) => {
            const candidates = getAvailableAndEligible(day, shift, outlet)
            let selected: string[] = []

            if (outlet === "🌟" && shift === "malam") {
                selected = candidates.slice(0, 2)
            } else {
                selected = candidates.length > 0 ? [candidates[0]] : []
            }

            selected.forEach((emp) => {
                shiftCount[emp]++
                if (!outletAssignments[emp][day]) outletAssignments[emp][day] = []
                outletAssignments[emp][day].push(outlet)
            })

            newSchedule[day][shift][outlet] = selected
            })
        })
        })

        setSchedule(newSchedule)
        setShiftSummary(shiftCount)
    }

    const formatScheduleText = () => {
        if (!schedule) return ""
      
        let text = "Hasil Jadwal - Made By System\n"
        days.forEach((day) => {
          text += `${day}\n`
          outlets.forEach((outlet) => {
            const pagi = schedule[day]?.pagi?.[outlet]?.join(" ") || ""
            const malam = schedule[day]?.malam?.[outlet]?.join(" ") || ""
            text += `${outlet}: ${pagi} - ${malam}\n`
          })
          text += "\n"
        })
      
        return text.trim()
      }
      
      const copyToClipboard = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(formatScheduleText());
        } else {
          // Fallback: misalnya, gunakan document.execCommand
          const textarea = document.createElement("textarea");
          textarea.value = formatScheduleText();
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
      }

  return (
    <div className="p-4 space-y-6 bg-white text-black">
      <div className="flex items-center space-x-2">
        <span onClick={() => router.back()} className="cursor-pointer text-2xl hover:text-blue-600">←</span>
        <h1 className="text-xl font-bold">Atur Ketersediaan Jadwal Karyawan</h1>
      </div>

      <div className="space-y-4">
        {Object.entries(employeePreferences).map(([code, { name }]) => (
          <div key={code} className="border border-gray-300 rounded-md p-3 bg-white text-black">
            <h2 className="text-base font-semibold mb-2">{name} ({code})</h2>
            <div className="overflow-auto">
              <table className="table-auto border-collapse w-full text-sm">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Hari</th>
                    {shifts.map((shift) => (
                      <th key={shift} colSpan={outlets.length} className="border px-2 py-1 capitalize text-center">{shift}</th>
                    ))}
                  </tr>
                  <tr>
                    <th></th>
                    {shifts.map(() =>
                      outlets.map((outlet) => (
                        <th key={outlet} className="border px-1 text-xs font-medium text-center">{outlet}</th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day}>
                      <td className="border px-2 py-1 font-medium">{day}</td>
                      {shifts.map((shift) =>
                        outlets.map((outlet) => {
                          const active = availability[code][day][shift][outlet]
                          return (
                            <td key={outlet + shift} className="border text-center">
                              <button
                                onClick={() => toggleAvailability(code, day, shift, outlet)}
                                className={`w-5 h-5 rounded-full border transition ${active ? "bg-green-500" : "bg-red-500"}`}
                                title={`${outlet} - ${shift}`}
                              />
                            </td>
                          )
                        })
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <button onClick={generateSchedule} className="px-4 py-2 bg-blue-600 text-white rounded shadow">Generate Jadwal Otomatis</button>

      {schedule && (
        <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Hasil Jadwal - Made By System</h2>

            {/* Tombol copy, textarea editable, dan kirim ke WA */}
            <div className="mb-4">
                <textarea
                    className="w-full h-60 p-2 border rounded text-sm font-mono"
                    value={customScheduleText}
                    onChange={(e) => setCustomScheduleText(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={copyToClipboard}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                        Copy to Clipboard
                    </button>


                    {/* <button
                        onClick={() => {
                            const encodedText = encodeURIComponent(customScheduleText);
                            const waUrl = `https://wa.me/?text=${encodedText}`;
                            window.open(waUrl, "_blank");
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                        Send to WhatsApp
                    </button> */}

                </div>
            </div>


            {/* Tampilan biasa */}
            <div className="space-y-4">
            {days.map((day) => (
                <div key={day}>
                <h3 className="text-md font-semibold">{day}</h3>
                {outlets.map((outlet) => {
                    const pagi = schedule[day]?.pagi?.[outlet]?.join(" ") || ""
                    const malam = schedule[day]?.malam?.[outlet]?.join(" ") || ""
                    return (
                    <div key={outlet} className="ml-4">
                        <span className="font-medium">{outlet}:</span>{" "}
                        {pagi || malam ? `${pagi} - ${malam}` : ""}
                    </div>
                    )
                })}
                </div>
            ))}
            </div>
        </div>
        )}


    </div>
  )
}
