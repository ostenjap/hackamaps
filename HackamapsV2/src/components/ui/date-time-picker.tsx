import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, X } from "lucide-react"
import { createPortal } from "react-dom"

import { cn } from "../../lib/utils"
import { Calendar } from "./calendar"

interface DateTimePickerProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    label?: string
}

export function DateTimePicker({ date, setDate, label }: DateTimePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 })
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const popoverRef = React.useRef<HTMLDivElement>(null)

    const toggleOpen = () => {
        if (isOpen) {
            setIsOpen(false)
        } else {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect()
                // Calculate position - prefer bottom, flip if needed (simplified for now: just bottom)
                setPosition({
                    top: rect.bottom + window.scrollY + 8,
                    left: rect.left + window.scrollX,
                    width: rect.width
                })
            }
            setIsOpen(true)
        }
    }

    // Handle click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            // Also close on window resize/scroll to avoid detaching
            window.addEventListener("resize", () => setIsOpen(false))
            window.addEventListener("scroll", () => setIsOpen(false), true)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("resize", () => setIsOpen(false))
            window.removeEventListener("scroll", () => setIsOpen(false), true)
        }
    }, [isOpen])

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) {
            setDate(undefined)
            return
        }

        // Preserve time if existing date, else default to 09:00
        const newDate = new Date(selectedDate)
        if (date) {
            newDate.setHours(date.getHours())
            newDate.setMinutes(date.getMinutes())
        } else {
            newDate.setHours(9)
            newDate.setMinutes(0)
        }
        setDate(newDate)
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeStr = e.target.value
        if (!date) return

        const [hours, minutes] = timeStr.split(':').map(Number)
        const newDate = new Date(date)
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        setDate(newDate)
    }

    return (
        <div className="relative">
            {label && <label className="text-xs text-neutral-400 mb-1 block">{label}</label>}
            <button
                type="button"
                ref={buttonRef}
                onClick={toggleOpen}
                className={cn(
                    "w-full flex justify-between items-center bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-left font-normal transition-colors hover:bg-white/5 outline-none focus:border-blue-500/50",
                    !date && "text-neutral-500"
                )}
            >
                <span className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                    {date ? format(date, "PPP p") : <span>Pick a date</span>}
                </span>
            </button>

            {isOpen && createPortal(
                <div
                    ref={popoverRef}
                    style={{
                        position: 'absolute',
                        top: position.top,
                        left: position.left,
                        zIndex: 9999, // High z-index to be on top of modal
                    }}
                    className="w-auto p-0 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-100"
                >
                    <div className="p-3 border-b border-white/10 flex justify-between items-center bg-neutral-900/50 rounded-t-xl">
                        <span className="text-sm font-medium text-neutral-300">Select Date & Time</span>
                        <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                        <div className="p-2">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                        </div>

                        <div className="p-4 flex flex-col gap-4 min-w-[200px] bg-neutral-900/30">
                            <div className="space-y-2">
                                <label className="text-xs text-neutral-400 font-medium flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    Time
                                </label>
                                <input
                                    type="time"
                                    value={date ? format(date, "HH:mm") : ""}
                                    onChange={handleTimeChange}
                                    disabled={!date}
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:border-blue-500/50 outline-none color-scheme-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="mt-auto space-y-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-md transition-all"
                                >
                                    Done
                                </button>
                                <button
                                    onClick={() => { setDate(undefined); setIsOpen(false); }}
                                    className="w-full bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white text-xs py-2 rounded-md transition-all"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
