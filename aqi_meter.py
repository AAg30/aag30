import tkinter as tk

SAFE_LIMIT = 100
BG       = "#0d1117"
CARD     = "#161b22"
INPUT_BG = "#21262d"
BLUE     = "#58a6ff"
GREEN    = "#3fb950"
ORANGE   = "#d29922"
RED      = "#f85149"
FG       = "#e6edf3"
MUTED    = "#8b949e"
BORDER   = "#30363d"
FONT     = ("Courier New", 10)

def analyze():
    try:
        aqi  = int(entry_aqi.get())
        temp = int(entry_temp.get())
        hum  = int(entry_hum.get())
    except ValueError:
        show_result("⚠  Enter valid integers.", RED, [])
        return

    if aqi <= 100:
        status, color, tips = "GOOD", GREEN, [
            "✅ Safe for outdoor activities.",
            "✅ Air quality is healthy."
        ]
    elif aqi <= 150:
        status, color, tips = "MODERATE", ORANGE, [
            "⚠️ Sensitive groups stay indoors.",
            "🚗 Reduce vehicle use."
        ]
    else:
        status, color, tips = "DANGEROUS", RED, [
            "🏠 Avoid going outside.",
            "😷 Wear a mask outdoors.",
            "🚫 No burning or heavy activity."
        ]

    show_result(f"Air Quality: {status}  |  AQI {aqi}  Temp {temp}°C  Humidity {hum}%",
                color, tips)

def show_result(header, color, tips):
    for w in result_frame.winfo_children():
        w.destroy()
    tk.Label(result_frame, text=header, bg=CARD, fg=color,
             font=("Courier New", 11, "bold"), wraplength=400).pack(pady=(14, 8))
    for t in tips:
        tk.Label(result_frame, text=t, bg=CARD, fg=FG,
                 font=FONT, anchor="w").pack(fill="x", padx=20, pady=2)
    tk.Label(result_frame, text="", bg=CARD).pack(pady=4)

def clear_all():
    for e in (entry_aqi, entry_temp, entry_hum):
        e.delete(0, tk.END)
    for w in result_frame.winfo_children():
        w.destroy()
    tk.Label(result_frame, text="Enter values and click Analyze.",
             bg=CARD, fg=MUTED, font=FONT).pack(pady=20)

# ── Window ──
root = tk.Tk()
root.title("Pollution Tracker")
root.configure(bg=BG)
root.resizable(False, False)
root.geometry("440x480+{}+{}".format(
    (root.winfo_screenwidth()-440)//2,
    (root.winfo_screenheight()-480)//2))

# ── Header ──
tk.Label(root, text="🌍 AI Smart Pollution Tracker", bg=BG, fg=BLUE,
         font=("Courier New", 13, "bold")).pack(pady=(18, 2))
tk.Label(root, text="Real-time air quality analysis", bg=BG, fg=MUTED,
         font=FONT).pack()
tk.Frame(root, bg=BORDER, height=1).pack(fill="x", padx=20, pady=10)

# ── Inputs ──
form = tk.Frame(root, bg=CARD, padx=20, pady=14)
form.pack(fill="x", padx=20)

def field(parent, label, unit):
    row = tk.Frame(parent, bg=CARD)
    row.pack(fill="x", pady=4)
    tk.Label(row, text=label, bg=CARD, fg=MUTED, font=FONT, width=13, anchor="w").pack(side="left")
    e = tk.Entry(row, bg=INPUT_BG, fg=FG, insertbackground=FG,
                 font=("Courier New", 11, "bold"), bd=0,
                 highlightthickness=1, highlightbackground=BORDER,
                 highlightcolor=BLUE, width=10)
    e.pack(side="left", ipady=4, padx=(0, 6))
    tk.Label(row, text=unit, bg=CARD, fg=MUTED, font=FONT).pack(side="left")
    return e

entry_aqi  = field(form, "AQI Value",   "index")
entry_temp = field(form, "Temperature", "°C")
entry_hum  = field(form, "Humidity",    "%")

# ── Buttons ──
btn_row = tk.Frame(root, bg=BG)
btn_row.pack(pady=12)
tk.Button(btn_row, text="Analyze", command=analyze,
          bg=BLUE, fg=BG, font=("Courier New", 10, "bold"),
          bd=0, padx=16, pady=7, cursor="hand2").pack(side="left", padx=6)
tk.Button(btn_row, text="Clear", command=clear_all,
          bg=INPUT_BG, fg=MUTED, font=("Courier New", 10),
          bd=0, padx=16, pady=7, cursor="hand2").pack(side="left", padx=6)

# ── Result ──
tk.Frame(root, bg=BORDER, height=1).pack(fill="x", padx=20)
result_frame = tk.Frame(root, bg=CARD)
result_frame.pack(fill="both", expand=True, padx=20, pady=10)
tk.Label(result_frame, text="Enter values and click Analyze.",
         bg=CARD, fg=MUTED, font=FONT).pack(pady=20)

# ── Footer ──
tk.Label(root, text="Safe AQI ≤ 100  •  Python & Tkinter",
         bg=BG, fg=MUTED, font=("Courier New", 8)).pack(pady=(0, 8))

root.mainloop()
