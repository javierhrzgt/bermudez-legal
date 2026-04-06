'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'

export interface DaySchedule {
  active: boolean
  open: string
  close: string
}

export interface BusinessHours {
  lunes: DaySchedule
  martes: DaySchedule
  miercoles: DaySchedule
  jueves: DaySchedule
  viernes: DaySchedule
  sabado: DaySchedule
  domingo: DaySchedule
}

export const defaultBusinessHours: BusinessHours = {
  lunes: { active: true, open: '08:00', close: '17:00' },
  martes: { active: true, open: '08:00', close: '17:00' },
  miercoles: { active: true, open: '08:00', close: '17:00' },
  jueves: { active: true, open: '08:00', close: '17:00' },
  viernes: { active: true, open: '08:00', close: '17:00' },
  sabado: { active: false, open: '', close: '' },
  domingo: { active: false, open: '', close: '' },
}

const dayNames: Record<keyof BusinessHours, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

const dayKeys = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const

function formatTime12h(time24: string): string {
  if (!time24) return ''
  const [hours, minutes] = time24.split(':')
  const h = parseInt(hours, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${minutes || '00'} ${ampm}`
}

export function generateSummary(hours: BusinessHours): string {
  const activeDays = dayKeys.filter((day) => hours[day].active)

  if (activeDays.length === 0) {
    return 'Horario no configurado'
  }

  const groups: { label: string; days: string[] }[] = []
  let i = 0

  while (i < activeDays.length) {
    const day = activeDays[i]
    const schedule = hours[day]
    const sameSchedule: string[] = [dayNames[day]]

    for (let j = i + 1; j < activeDays.length; j++) {
      const nextDay = activeDays[j]
      if (hours[nextDay].open === schedule.open && hours[nextDay].close === schedule.close) {
        sameSchedule.push(dayNames[nextDay])
      } else {
        break
      }
    }

    if (sameSchedule.length >= 3) {
      groups.push({
        label: `${sameSchedule[0]} a ${sameSchedule[sameSchedule.length - 1]}: ${formatTime12h(schedule.open)} - ${formatTime12h(schedule.close)}`,
        days: sameSchedule,
      })
      i += sameSchedule.length
    } else {
      groups.push({
        label: `${dayNames[day as keyof BusinessHours]}: ${formatTime12h(schedule.open)} - ${formatTime12h(schedule.close)}`,
        days: [dayNames[day as keyof BusinessHours]],
      })
      i++
    }
  }

  return groups.map((g) => g.label).join('\n')
}

const timeOptions: string[] = []
for (let h = 6; h <= 21; h++) {
  timeOptions.push(`${h.toString().padStart(2, '0')}:00`)
  timeOptions.push(`${h.toString().padStart(2, '0')}:30`)
}

interface BusinessHoursEditorProps {
  value: BusinessHours
  onChange: (hours: BusinessHours) => void
}

export function BusinessHoursEditor({ value, onChange }: BusinessHoursEditorProps) {
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set())
  const [bulkOpen, setBulkOpen] = useState('08:00')
  const [bulkClose, setBulkClose] = useState('17:00')

  const toggleDay = (day: string) => {
    const newSet = new Set(selectedDays)
    if (newSet.has(day)) {
      newSet.delete(day)
    } else {
      newSet.add(day)
    }
    setSelectedDays(newSet)
  }

  const applyToSelectedDays = () => {
    if (selectedDays.size === 0) return

    const newHours = { ...value }
    selectedDays.forEach((day) => {
      newHours[day as keyof BusinessHours] = {
        active: true,
        open: bulkOpen,
        close: bulkClose,
      }
    })
    onChange(newHours)
    setSelectedDays(new Set())
  }

  const toggleDayActive = (day: keyof BusinessHours) => {
    const newHours = { ...value, [day]: { ...value[day], active: !value[day].active } }
    onChange(newHours)
  }

  const updateDayTime = (day: keyof BusinessHours, field: 'open' | 'close', time: string) => {
    const newHours = { ...value, [day]: { ...value[day], [field]: time } }
    onChange(newHours)
  }

  const summary = generateSummary(value)

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium">Aplicar horario a múltiples días</p>
        <div className="flex flex-wrap gap-1">
          {dayKeys.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedDays.has(day)
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-background border border-border hover:bg-muted'
              }`}
            >
              {dayNames[day].slice(0, 2)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>Horario:</span>
          <select
            value={bulkOpen}
            onChange={(e) => setBulkOpen(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {formatTime12h(t)}
              </option>
            ))}
          </select>
          <span>a</span>
          <select
            value={bulkClose}
            onChange={(e) => setBulkClose(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {formatTime12h(t)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={applyToSelectedDays}
            disabled={selectedDays.size === 0}
            className="ml-2 px-3 py-1 bg-primary text-primary-foreground text-xs rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aplicar
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-10 px-2 py-2 text-left"></th>
              <th className="px-2 py-2 text-left font-medium">Día</th>
              <th className="px-2 py-2 text-left font-medium">Horario</th>
            </tr>
          </thead>
          <tbody>
            {dayKeys.map((day) => {
              const schedule = value[day as keyof BusinessHours]
              return (
                <tr key={day} className="border-t">
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => toggleDayActive(day as keyof BusinessHours)}
                      className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                        schedule.active
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {schedule.active ? <Check className="h-3 w-3" /> : null}
                    </button>
                  </td>
                  <td className="px-2 py-2 font-medium">{dayNames[day as keyof BusinessHours]}</td>
                  <td className="px-2 py-2">
                    {schedule.active ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={schedule.open}
                          onChange={(e) =>
                            updateDayTime(day as keyof BusinessHours, 'open', e.target.value)
                          }
                          className="border rounded px-2 py-1 text-xs"
                        >
                          {timeOptions.map((t) => (
                            <option key={t} value={t}>
                              {formatTime12h(t)}
                            </option>
                          ))}
                        </select>
                        <span>a</span>
                        <select
                          value={schedule.close}
                          onChange={(e) =>
                            updateDayTime(day as keyof BusinessHours, 'close', e.target.value)
                          }
                          className="border rounded px-2 py-1 text-xs"
                        >
                          {timeOptions.map((t) => (
                            <option key={t} value={t}>
                              {formatTime12h(t)}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">Cerrado</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-muted/30 rounded-lg p-3">
        <p className="text-xs text-muted-foreground mb-1">Resumen:</p>
        <p className="text-sm whitespace-pre-line">{summary}</p>
      </div>
    </div>
  )
}
