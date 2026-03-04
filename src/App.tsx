import { useState, useEffect, useCallback } from "react";

// ─── FONTS ───────────────────────────────────────────────────────────────────
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0A0A0A; }
::-webkit-scrollbar { width: 4px; } 
::-webkit-scrollbar-track { background: #111; }
::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }
input, textarea, select { font-family: 'Barlow', sans-serif; }
button { cursor: pointer; font-family: 'Barlow', sans-serif; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
.fade-in { animation: fadeIn 0.25s ease forwards; }
`;

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0A0A", bg1: "#0F0F0F", bg2: "#141414", bg3: "#1A1A1A",
  border: "#222", border2: "#2A2A2A",
  text: "#E0E0D8", text2: "#888", text3: "#444",
  accent: "#CCFF00", accent2: "#00FFCC", accent3: "#FF6B35", accent4: "#FF3366",
  gold: "#FFD700", purple: "#AA77FF", cyan: "#7DF9FF",
  font: "'Barlow', sans-serif", mono: "'IBM Plex Mono', monospace", display: "'Bebas Neue', sans-serif",
};

const SPORTS = {
  general:   { label: "General Athletic", icon: "⚡", color: C.accent },
  field:     { label: "Field Sports",     icon: "🏉", color: C.accent2 },
  court:     { label: "Court Sports",     icon: "🏀", color: C.accent3 },
  combat:    { label: "Combat Sports",    icon: "🥊", color: C.accent4 },
  track:     { label: "Track & Field",    icon: "🏃", color: C.gold },
  endurance: { label: "Endurance",        icon: "🚴", color: C.cyan },
};

const PHASES = {
  offseason:  { label: "Off-Season",   abbr: "OFF",  color: C.accent2 },
  preseason:  { label: "Pre-Season",   abbr: "PRE",  color: C.accent },
  inseason:   { label: "In-Season",    abbr: "IN",   color: C.accent3 },
  peak:       { label: "Peak / Taper", abbr: "PEAK", color: C.accent4 },
};

const STRENGTH_DAYS = [
  { label: "Day 1 — Squat + H. Pull",       abbr: "D1" },
  { label: "Day 2 — Hinge + H. Push",       abbr: "D2" },
  { label: "Day 3 — Single-Leg + Vertical", abbr: "D3" },
];

const MOVEMENT_PATTERNS = {
  general: [
    { day: 0, tag: "SQUAT",   color: C.accent,  exercises: ["Back Squat — 4×4 @ 83–87% 1RM","Front Squat — 3×4 @ 77%","Paused Squat — 2×3 @ 70% (3s hold)"] },
    { day: 0, tag: "H. PULL", color: C.accent4, exercises: ["Barbell Row — 4×5 @ 75%","Seated Cable Row — 3×8","Face Pull — 3×12"] },
    { day: 1, tag: "HINGE",   color: C.accent2, exercises: ["Trap Bar Deadlift — 4×3 @ 85–90%","Romanian DL — 3×5 (3s ecc)","Hip Thrust — 3×6 @ 75%"] },
    { day: 1, tag: "H. PUSH", color: C.accent3, exercises: ["Bench Press — 4×4 @ 80–85%","DB Incline Press — 3×8","Weighted Push-Up — 3×10"] },
    { day: 2, tag: "SINGLE-LEG", color: C.gold,   exercises: ["Bulgarian Split Squat — 4×6 each","Weighted Step-Up — 3×8 each","Single-Leg RDL — 3×6 each"] },
    { day: 2, tag: "V. PUSH",    color: C.purple, exercises: ["Overhead Press — 4×4 @ 78%","Push Press — 3×4 @ 82%"] },
    { day: 2, tag: "V. PULL",    color: C.cyan,   exercises: ["Weighted Pull-Up — 4×5","Lat Pulldown — 3×8"] },
  ],
  field: [
    { day: 0, tag: "SQUAT",   color: C.accent,  exercises: ["Trap Bar Squat — 4×4 @ 82–87%","Jump Squat @ 30% BW — 3×4","Box Squat — 3×3 @ 80%"] },
    { day: 0, tag: "H. PULL", color: C.accent4, exercises: ["Barbell Row — 4×5","Single-Arm DB Row — 3×8 each","Band Pull-Apart — 3×15"] },
    { day: 1, tag: "HINGE",   color: C.accent2, exercises: ["Romanian DL (3s ecc) — 4×4 @ 82%","Flywheel Nordic Curl — 3×5","Hip Thrust — 3×6 @ 75%"] },
    { day: 1, tag: "H. PUSH", color: C.accent3, exercises: ["Push Press — 4×4 @ 80%","DB Bench Press — 3×8","Cable Fly — 3×12"] },
    { day: 2, tag: "SINGLE-LEG", color: C.gold,   exercises: ["Bulgarian Split Squat — 4×6 each","Lateral Step-Up — 3×8 each","Single-Leg Press — 3×8 each"] },
    { day: 2, tag: "V. PUSH",    color: C.purple, exercises: ["Split-Stance OHP — 3×6 each","Landmine Press — 3×8 each"] },
    { day: 2, tag: "V. PULL",    color: C.cyan,   exercises: ["Weighted Pull-Up — 4×5","Lat Pulldown — 3×8"] },
  ],
  court: [
    { day: 0, tag: "SQUAT",   color: C.accent,  exercises: ["Front Squat — 4×4 @ 78–83%","Paused Squat — 3×3 @ 72%","Box Squat — 3×4 @ 75%"] },
    { day: 0, tag: "H. PULL", color: C.accent4, exercises: ["Seated Cable Row — 4×6","Single-Arm DB Row — 3×8 each","Band Face Pull — 3×15"] },
    { day: 1, tag: "HINGE",   color: C.accent2, exercises: ["Romanian DL — 4×5 @ 77%","Kettlebell Swing — 4×8 (explosive)","Hip Thrust — 3×6 @ 73%"] },
    { day: 1, tag: "H. PUSH", color: C.accent3, exercises: ["Bench Press — 4×4 @ 78–83%","DB Incline Press — 3×8","Push-Up (weighted) — 3×10"] },
    { day: 2, tag: "SINGLE-LEG", color: C.gold,   exercises: ["Split Squat — 4×6 each @ 68%","Lateral Lunge — 3×8 each","Single-Leg Press — 3×8 each"] },
    { day: 2, tag: "V. PUSH",    color: C.purple, exercises: ["Landmine Press — 3×8 each","Dumbbell OHP — 3×8"] },
    { day: 2, tag: "V. PULL",    color: C.cyan,   exercises: ["Weighted Pull-Up — 4×4","Lat Pulldown — 3×10"] },
  ],
  combat: [
    { day: 0, tag: "SQUAT",   color: C.accent,  exercises: ["Back Squat — 4×3 @ 87–90%","Safety Bar Squat — 3×4 @ 80%","Front Squat — 3×4 @ 77%"] },
    { day: 0, tag: "H. PULL", color: C.accent4, exercises: ["Weighted Pull-Up — 4×4","Barbell Row — 4×5 @ 77%","Renegade Row — 3×6 each"] },
    { day: 1, tag: "HINGE",   color: C.accent2, exercises: ["Deadlift — 4×3 @ 88–92%","Romanian DL — 3×5 @ 75%","Good Morning — 3×6 @ 50%"] },
    { day: 1, tag: "H. PUSH", color: C.accent3, exercises: ["Floor Press — 4×4 @ 80%","Overhead Press — 4×4 @ 78%","Weighted Push-Up — 3×8"] },
    { day: 2, tag: "SINGLE-LEG", color: C.gold,   exercises: ["Single-Leg Deadlift — 4×5 each","Reverse Lunge (weighted) — 3×8 each","Single-Leg Hip Thrust — 3×6 each"] },
    { day: 2, tag: "V. PUSH",    color: C.purple, exercises: ["Push Press — 4×4 @ 82%","Landmine Press — 3×8 each"] },
    { day: 2, tag: "V. PULL",    color: C.cyan,   exercises: ["Chin-Up (supinated) — 4×5","Lat Pulldown — 3×8"] },
  ],
  track: [
    { day: 0, tag: "SQUAT",   color: C.accent,  exercises: ["Back Squat (Triphasic) — 4×3 @ 87–92%","Pause Squat — 3×3 @ 75%","Isometric Squat Hold — 3×5s @ 90°"] },
    { day: 0, tag: "H. PULL", color: C.accent4, exercises: ["Barbell Row — 4×5 @ 75%","Cable Row — 3×8","Isometric Row Hold — 3×5s maximal"] },
    { day: 1, tag: "HINGE",   color: C.accent2, exercises: ["Clean Pull / Deadlift — 4×3 @ 87%","Romanian DL — 3×5 @ 75% (3s ecc)","Good Morning — 3×6 @ 55%"] },
    { day: 1, tag: "H. PUSH", color: C.accent3, exercises: ["Push Press — 4×3 @ 82%","Incline DB Press — 3×6 @ 72%"] },
    { day: 2, tag: "SINGLE-LEG", color: C.gold,   exercises: ["Single-Leg Hip Thrust — 4×6 each","RFESS — 4×5 each","Adductor Squeeze — 3×10"] },
    { day: 2, tag: "V. PUSH",    color: C.purple, exercises: ["Overhead Press — 3×5 @ 75%","Push Press — 3×4 @ 80%"] },
    { day: 2, tag: "V. PULL",    color: C.cyan,   exercises: ["Weighted Pull-Up — 4×4","Lat Pulldown — 3×8"] },
  ],
  endurance: [
    { day: 0, tag: "SQUAT",   color: C.accent,  exercises: ["HSR Squat (3s ecc / 2s con) — 4×6 @ 75%","Front Squat — 3×6 @ 70%","Step-Up — 3×8 each"] },
    { day: 0, tag: "H. PULL", color: C.accent4, exercises: ["Seated Row (slow tempo) — 4×8","TRX Row — 3×12","Face Pull — 3×15"] },
    { day: 1, tag: "HINGE",   color: C.accent2, exercises: ["Romanian DL (HSR) — 4×6 @ 72% (3s ecc)","Hip Thrust — 3×8 @ 70%","Good Morning — 3×8 @ 50% (slow)"] },
    { day: 1, tag: "H. PUSH", color: C.accent3, exercises: ["DB Press — 3×10 @ 65%","Push-Up (controlled) — 3×15"] },
    { day: 2, tag: "SINGLE-LEG", color: C.gold,   exercises: ["Single-Leg Press — 4×8 each @ 68%","Step-Up (heavy slow) — 3×10 each","Calf Raise (HSR) — 4×8 @ 75% (3s ecc)"] },
    { day: 2, tag: "V. PUSH",    color: C.purple, exercises: ["Dumbbell OHP — 3×10 @ 65%","Landmine Press — 3×10 each"] },
    { day: 2, tag: "V. PULL",    color: C.cyan,   exercises: ["Assisted Pull-Up / Band — 3×8","Lat Pulldown — 3×10"] },
  ],
};

const NEURAL_BLOCKS = {
  general:   ["Ankle Pogo Jumps — 3×10","Depth Jump (30cm) — 3×4","CMJ — 3×4","Broad Jump — 3×3","Isometric Squat Hold @ 90° — 3×5s","Med Ball Chest Throw — 3×5"],
  field:     ["Depth Jump → Sprint 10m — 4×3","Ankle Pogo Lateral — 3×8 each","Lateral Bound → Stick — 3×4 each","Broad Jump — 3×3","Alternate-Leg Bounding +10% BW — 3×10","Med Ball Rotational Pass — 3×6"],
  court:     ["Reactive Drop Jump — 4×4","Lateral Pogo Bound — 3×6 each","CMJ → Max Height — 3×4","Squat Jump @ 20% BW — 3×4","Isometric Squat Hold — 3×5s","Med Ball Rotational Slam — 3×6"],
  combat:    ["Clap Push-Up — 3×5","Reactive Lateral Bound — 3×4 each","Broad Jump — 3×4","Rotational Med Ball Throw — 4×5","Isometric MVC Knee Extension — 3×3s","Med Ball Hip Rotation Throw — 3×6 each"],
  track:     ["Depth Jump → Max Sprint 20m — 3×3","Single-Leg Ankle Stiffness Hop — 3×8","Triple Hop for Distance — 3×3","CMJ Loaded @ 20% BW — 3×3","Isometric Mid-Thigh Pull — 3×5s","Alternate-Leg Bound × 10 contacts — 3 sets"],
  endurance: ["Ankle Pogo (bilateral) — 3×15","Single-Leg Ankle Hop — 3×8 each","Single-Leg Broad Jump → Stick — 3×4","CMJ — 3×3","Isometric Calf Press — 3×5s","Med Ball Throw (light 2kg) — 3×5"],
};

const ACCESSORY_BLOCKS = {
  general:   ["Bulgarian Split Squat — 3×8","Copenhagen Plank — 3×20s","Pallof Press — 3×10","Dead Bug — 3×8 each"],
  field:     ["Single-Leg RDL — 3×8","Lateral Band Walk — 3×15m","Anti-Rotation Press — 3×10","Copenhagen Plank — 3×20s"],
  court:     ["Lateral Lunge — 3×8 each","Ankle Pogo — 3×15s","Shoulder External Rotation — 3×12","Side Plank — 3×30s each"],
  combat:    ["Wrestler's Bridge — 3×30s","Rotational Med Ball Slam — 3×8","Grip Holds — 3×30s","Side Plank Rotation — 3×10"],
  track:     ["Single-Leg Hip Thrust — 3×8","Adductor Squeeze — 3×10","Calf Raise (heavy) — 4×6","Sprint Mechanic Drills — 15 min"],
  endurance: ["Calf Raise (heavy slow) — 4×8","Hip Abductor Machine — 3×12","Core Anti-Extension — 3×30s","Single-Leg Calf Raise — 3×10 each"],
};

const ENERGY_BLOCKS = {
  general:   ["General Aerobic Circuit — 20 min","Sprint Intervals 6×30s / 90s rest","Bike Tabata — 8×20s on / 10s off"],
  field:     ["RSA: 6×40m / 20s rest","Repeated Sprint Block: 3×6×30m","Agility Ladder + Cone Drill — 15 min"],
  court:     ["COD Shuttle — 6×15s / 45s rest","Court Agility Patterns — 8 reps","Suicides × 5 sets"],
  combat:    ["Lactic Intervals: 4×2min @ 85% HR","Alactic Bursts: 8×10s max / 50s rest","Grappling Circuit — 3×3min rounds"],
  track:     ["Alactic Speed Endurance: 4×60m / 4min","Sprint Mechanic Drills — 15 min","Tempo Runs: 6×100m @ 75%"],
  endurance: ["Sport-specific aerobic intervals","Zone 2 Steady State — 20 min","Threshold Intervals: 3×8min @ 85% HRmax"],
};

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
const store = {
  get: async (key) => { try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  set: async (key, val) => { try { await window.storage.set(key, JSON.stringify(val)); return true; } catch { return false; } },
  del: async (key) => { try { await window.storage.delete(key); return true; } catch { return false; } },
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : "—";
const daysSince = (d) => d ? Math.floor((Date.now() - new Date(d + "T00:00:00")) / 86400000) : null;

// ─── UI PRIMITIVES ───────────────────────────────────────────────────────────
const Mono = ({ children, style }) => <span style={{ fontFamily: C.mono, ...style }}>{children}</span>;
const Label = ({ children, style }) => <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.text3, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, ...style }}>{children}</div>;
const Divider = ({ style }) => <div style={{ borderTop: `1px solid ${C.border}`, margin: "16px 0", ...style }} />;
const Tag = ({ children, color = C.accent, style }) => (
  <span style={{ fontFamily: C.mono, fontSize: "0.58rem", color, border: `1px solid ${color}`, borderRadius: 2, padding: "2px 7px", letterSpacing: "0.08em", ...style }}>{children}</span>
);
const Btn = ({ children, onClick, variant = "ghost", color = C.accent, style, disabled }) => {
  const variants = {
    ghost:   { background: "transparent", border: `1px solid ${C.border2}`, color: C.text2 },
    solid:   { background: color, border: `1px solid ${color}`, color: "#000", fontWeight: 700 },
    outline: { background: "transparent", border: `1px solid ${color}`, color },
    danger:  { background: "transparent", border: `1px solid ${C.accent4}`, color: C.accent4 },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily: C.font, fontSize: "0.8rem", borderRadius: 2, padding: "8px 16px",
      transition: "all 0.15s", letterSpacing: "0.04em", opacity: disabled ? 0.4 : 1,
      ...variants[variant], ...style,
    }}>{children}</button>
  );
};
const Input = ({ label, value, onChange, type = "text", placeholder, style }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <Label>{label}</Label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 2,
        color: C.text, fontFamily: C.font, fontSize: "0.85rem", padding: "9px 12px", outline: "none", ...style }} />
  </div>
);
const Select = ({ label, value, onChange, options, style }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <Label>{label}</Label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 2,
        color: C.text, fontFamily: C.font, fontSize: "0.85rem", padding: "9px 12px", outline: "none", ...style }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} className="fade-in" style={{
    background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 3,
    padding: 20, cursor: onClick ? "pointer" : "default", ...style,
  }}>{children}</div>
);
const Modal = ({ children, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    onClick={onClose}>
    <div onClick={e => e.stopPropagation()} className="fade-in" style={{
      background: C.bg1, border: `1px solid ${C.border2}`, borderRadius: 4,
      width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto",
    }}>
      {children}
    </div>
  </div>
);

// ─── SCREENS ─────────────────────────────────────────────────────────────────

// LOGIN
function LoginScreen({ onLogin }) {
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState("check"); // check | set | enter
  const [newPin, setNewPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    store.get("coach_pin").then(p => { setMode(p ? "enter" : "set"); setLoading(false); });
  }, []);

  const handleSet = async () => {
    if (newPin.length < 4) return setErr("PIN must be at least 4 characters");
    if (newPin !== confirm) return setErr("PINs don't match");
    await store.set("coach_pin", newPin);
    setMode("enter"); setErr(""); setNewPin(""); setConfirm("");
  };
  const handleEnter = async () => {
    const stored = await store.get("coach_pin");
    if (pin === stored) { onLogin(); } else { setErr("Incorrect PIN"); setPin(""); }
  };

  if (loading) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Mono style={{ color: C.text3, fontSize: "0.7rem", letterSpacing: "0.2em", animation: "pulse 1.5s infinite" }}>LOADING...</Mono>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{FONTS}</style>
      <div className="fade-in" style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{ fontFamily: C.display, fontSize: "3.2rem", color: C.accent, letterSpacing: "0.05em", lineHeight: 1 }}>S&C OS</div>
          <div style={{ fontFamily: C.mono, fontSize: "0.62rem", color: C.text3, letterSpacing: "0.15em", marginTop: 6 }}>STRENGTH & CONDITIONING PLATFORM</div>
        </div>
        <Card style={{ padding: 28 }}>
          <Label style={{ textAlign: "center", marginBottom: 20 }}>
            {mode === "set" ? "// Create your coach PIN" : "// Coach Login"}
          </Label>
          {mode === "set" ? (
            <>
              <Input label="Set PIN (4+ characters)" type="password" value={newPin} onChange={setNewPin} placeholder="Enter new PIN" />
              <Input label="Confirm PIN" type="password" value={confirm} onChange={setConfirm} placeholder="Confirm PIN" />
              {err && <div style={{ color: C.accent4, fontFamily: C.mono, fontSize: "0.65rem", marginBottom: 12 }}>{err}</div>}
              <Btn variant="solid" onClick={handleSet} style={{ width: "100%" }}>Create PIN & Enter</Btn>
            </>
          ) : (
            <>
              <Input label="Enter PIN" type="password" value={pin} onChange={setPin} placeholder="••••" />
              {err && <div style={{ color: C.accent4, fontFamily: C.mono, fontSize: "0.65rem", marginBottom: 12 }}>{err}</div>}
              <Btn variant="solid" onClick={handleEnter} style={{ width: "100%" }}>Enter App</Btn>
              <div style={{ marginTop: 12, textAlign: "center" }}>
                <button onClick={() => { setMode("set"); setErr(""); }} style={{ background: "none", border: "none", color: C.text3, fontFamily: C.mono, fontSize: "0.6rem", letterSpacing: "0.1em", textDecoration: "underline" }}>
                  Reset PIN
                </button>
              </div>
            </>
          )}
        </Card>
        <div style={{ textAlign: "center", marginTop: 20, fontFamily: C.mono, fontSize: "0.55rem", color: C.text3 }}>
          DATA STORED LOCALLY · SECURE · PRIVATE
        </div>
      </div>
    </div>
  );
}

// SIDEBAR NAV
function Sidebar({ screen, setScreen, athleteCount }) {
  const nav = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "roster",    icon: "◉", label: "Roster", badge: athleteCount },
    { id: "session",   icon: "◆", label: "Session Builder" },
    { id: "program",   icon: "▦", label: "Program View" },
  ];
  return (
    <div style={{ width: 200, background: C.bg1, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0 }}>
      <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: C.display, fontSize: "1.6rem", color: C.accent, letterSpacing: "0.05em", lineHeight: 1 }}>S&C OS</div>
        <div style={{ fontFamily: C.mono, fontSize: "0.52rem", color: C.text3, letterSpacing: "0.12em", marginTop: 3 }}>COACH PLATFORM</div>
      </div>
      <nav style={{ padding: "12px 8px", flex: 1 }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 10px",
            background: screen === n.id ? `${C.accent}14` : "transparent",
            border: `1px solid ${screen === n.id ? C.accent + "44" : "transparent"}`,
            borderRadius: 3, color: screen === n.id ? C.accent : C.text2,
            fontFamily: C.font, fontWeight: 600, fontSize: "0.82rem", marginBottom: 2,
            transition: "all 0.15s", textAlign: "left",
          }}>
            <span style={{ fontFamily: C.mono, fontSize: "0.9rem", width: 16, flexShrink: 0 }}>{n.icon}</span>
            <span>{n.label}</span>
            {n.badge !== undefined && <span style={{ marginLeft: "auto", fontFamily: C.mono, fontSize: "0.6rem", background: C.bg3, color: C.text3, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1px 6px" }}>{n.badge}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: C.mono, fontSize: "0.52rem", color: C.text3, letterSpacing: "0.1em" }}>{today()}</div>
      </div>
    </div>
  );
}

// DASHBOARD
function Dashboard({ athletes, sessions, setScreen, setSelectedAthlete }) {
  const recentSessions = [...sessions].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  const activeAthletes = athletes.filter(a => {
    const last = sessions.filter(s => s.athleteId === a.id).sort((x,y) => y.createdAt - x.createdAt)[0];
    return last && daysSince(last.date) < 14;
  });

  const statCards = [
    { label: "Total Athletes", value: athletes.length, color: C.accent },
    { label: "Total Sessions", value: sessions.length, color: C.accent2 },
    { label: "Active (14 days)", value: activeAthletes.length, color: C.accent3 },
    { label: "This Week", value: sessions.filter(s => daysSince(s.date) < 7).length, color: C.gold },
  ];

  return (
    <div className="fade-in">
      <div style={{ padding: "24px 32px 12px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: C.display, fontSize: "2.2rem", color: C.text, letterSpacing: "0.04em" }}>Dashboard</div>
        <div style={{ fontFamily: C.mono, fontSize: "0.62rem", color: C.text3, letterSpacing: "0.12em", marginTop: 4 }}>// OVERVIEW · {fmtDate(today())}</div>
      </div>
      <div style={{ padding: "24px 32px" }}>
        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 2, marginBottom: 28 }}>
          {statCards.map((s, i) => (
            <div key={i} style={{ background: C.bg2, borderTop: `2px solid ${s.color}`, border: `1px solid ${C.border}`, borderTop: `2px solid ${s.color}`, padding: "16px 18px" }}>
              <div style={{ fontFamily: C.display, fontSize: "2.4rem", color: s.color, letterSpacing: "0.04em" }}>{s.value}</div>
              <div style={{ fontFamily: C.mono, fontSize: "0.58rem", color: C.text3, letterSpacing: "0.1em", marginTop: 2 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Recent Sessions */}
          <div>
            <Label>// Recent Sessions</Label>
            {recentSessions.length === 0 ? (
              <div style={{ color: C.text3, fontFamily: C.mono, fontSize: "0.7rem", padding: "20px 0" }}>No sessions yet. Build your first session →</div>
            ) : recentSessions.map(s => {
              const ath = athletes.find(a => a.id === s.athleteId);
              const sp = SPORTS[s.sport];
              return (
                <div key={s.id} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${sp?.color || C.accent}`, padding: "10px 14px", marginBottom: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.83rem", color: C.text }}>{ath?.name || "Unknown"}</div>
                    <div style={{ fontFamily: C.mono, fontSize: "0.58rem", color: C.text3, marginTop: 2 }}>{sp?.icon} {sp?.label} · {STRENGTH_DAYS[s.strengthDay]?.abbr || ""}</div>
                  </div>
                  <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.text3 }}>{fmtDate(s.date)}</div>
                </div>
              );
            })}
          </div>

          {/* Athletes at a glance */}
          <div>
            <Label>// Roster Snapshot</Label>
            {athletes.length === 0 ? (
              <div style={{ color: C.text3, fontFamily: C.mono, fontSize: "0.7rem", padding: "20px 0" }}>No athletes added yet. Go to Roster →</div>
            ) : athletes.slice(0, 6).map(a => {
              const sp = SPORTS[a.sport];
              const lastSession = sessions.filter(s => s.athleteId === a.id).sort((x,y) => y.createdAt - x.createdAt)[0];
              return (
                <div key={a.id} onClick={() => { setSelectedAthlete(a.id); setScreen("roster"); }} style={{
                  background: C.bg2, border: `1px solid ${C.border}`, padding: "10px 14px", marginBottom: 2,
                  display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: sp?.color + "22", border: `1px solid ${sp?.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>{sp?.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.83rem", color: C.text }}>{a.name}</div>
                      <div style={{ fontFamily: C.mono, fontSize: "0.56rem", color: C.text3 }}>{PHASES[a.phase]?.abbr} · {sp?.label}</div>
                    </div>
                  </div>
                  <Tag color={PHASES[a.phase]?.color}>{PHASES[a.phase]?.abbr}</Tag>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ROSTER
function Roster({ athletes, setAthletes, sessions, selectedId, setSelectedId }) {
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState("list"); // list | profile
  const [form, setForm] = useState({ name: "", sport: "general", phase: "offseason", dob: "", position: "", notes: "" });
  const [editing, setEditing] = useState(false);

  const selectedAthlete = athletes.find(a => a.id === selectedId);

  useEffect(() => { if (selectedId) setView("profile"); }, [selectedId]);

  const saveAthlete = async () => {
    if (!form.name.trim()) return;
    let updated;
    if (editing) {
      updated = athletes.map(a => a.id === editing ? { ...a, ...form } : a);
    } else {
      const newA = { id: uid(), createdAt: Date.now(), ...form };
      updated = [...athletes, newA];
    }
    setAthletes(updated);
    await store.set("athletes", updated);
    setShowAdd(false); setEditing(false);
    setForm({ name: "", sport: "general", phase: "offseason", dob: "", position: "", notes: "" });
  };

  const deleteAthlete = async (id) => {
    const updated = athletes.filter(a => a.id !== id);
    setAthletes(updated);
    await store.set("athletes", updated);
    setView("list"); setSelectedId(null);
  };

  const editAthlete = (a) => {
    setForm({ name: a.name, sport: a.sport, phase: a.phase, dob: a.dob || "", position: a.position || "", notes: a.notes || "" });
    setEditing(a.id); setShowAdd(true);
  };

  const athleteSessions = selectedId ? sessions.filter(s => s.athleteId === selectedId).sort((a, b) => b.createdAt - a.createdAt) : [];

  return (
    <div className="fade-in">
      <div style={{ padding: "24px 32px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {view === "profile" && (
              <button onClick={() => { setView("list"); setSelectedId(null); }} style={{ background: "none", border: "none", color: C.text3, fontFamily: C.mono, fontSize: "0.8rem", padding: "0 8px 0 0" }}>← </button>
            )}
            <div style={{ fontFamily: C.display, fontSize: "2.2rem", color: C.text, letterSpacing: "0.04em" }}>
              {view === "profile" ? selectedAthlete?.name : "Roster"}
            </div>
          </div>
          <div style={{ fontFamily: C.mono, fontSize: "0.62rem", color: C.text3, letterSpacing: "0.12em", marginTop: 4 }}>
            {view === "profile" ? `// ATHLETE PROFILE · ${SPORTS[selectedAthlete?.sport]?.label}` : `// ${athletes.length} ATHLETES`}
          </div>
        </div>
        {view === "list" && <Btn variant="solid" onClick={() => { setEditing(false); setShowAdd(true); }}>+ Add Athlete</Btn>}
        {view === "profile" && (
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="outline" color={C.accent2} onClick={() => editAthlete(selectedAthlete)}>Edit</Btn>
            <Btn variant="danger" onClick={() => deleteAthlete(selectedId)}>Delete</Btn>
          </div>
        )}
      </div>

      <div style={{ padding: "24px 32px" }}>
        {view === "list" ? (
          athletes.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60, color: C.text3, fontFamily: C.mono, fontSize: "0.75rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>◉</div>
              No athletes yet. Add your first athlete to get started.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
              {athletes.map(a => {
                const sp = SPORTS[a.sport];
                const ph = PHASES[a.phase];
                const lastS = sessions.filter(s => s.athleteId === a.id).sort((x,y) => y.createdAt - x.createdAt)[0];
                return (
                  <Card key={a.id} onClick={() => { setSelectedId(a.id); setView("profile"); }} style={{ borderTop: `2px solid ${sp.color}`, padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: sp.color + "18", border: `1px solid ${sp.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>{sp.icon}</div>
                      <Tag color={ph.color}>{ph.abbr}</Tag>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: C.text, marginBottom: 2 }}>{a.name}</div>
                    {a.position && <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.text3, marginBottom: 4 }}>{a.position}</div>}
                    <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: sp.color }}>{sp.label}</div>
                    <Divider style={{ margin: "12px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontFamily: C.mono, fontSize: "0.58rem", color: C.text3 }}>
                        {sessions.filter(s => s.athleteId === a.id).length} sessions
                      </div>
                      <div style={{ fontFamily: C.mono, fontSize: "0.58rem", color: C.text3 }}>
                        {lastS ? `${daysSince(lastS.date)}d ago` : "No sessions"}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )
        ) : selectedAthlete ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Profile info */}
            <div>
              <Card>
                <Label>// Athlete Details</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                  {[
                    { l: "Sport", v: `${SPORTS[selectedAthlete.sport]?.icon} ${SPORTS[selectedAthlete.sport]?.label}` },
                    { l: "Phase", v: PHASES[selectedAthlete.phase]?.label },
                    { l: "Position", v: selectedAthlete.position || "—" },
                    { l: "DOB", v: selectedAthlete.dob ? fmtDate(selectedAthlete.dob) : "—" },
                    { l: "Added", v: selectedAthlete.createdAt ? new Date(selectedAthlete.createdAt).toLocaleDateString("en-AU", { day:"numeric",month:"short",year:"numeric"}) : "—" },
                    { l: "Total Sessions", v: athleteSessions.length },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ fontFamily: C.mono, fontSize: "0.56rem", color: C.text3, marginBottom: 2 }}>{item.l.toUpperCase()}</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: C.text }}>{item.v}</div>
                    </div>
                  ))}
                </div>
                {selectedAthlete.notes && <>
                  <Divider />
                  <div style={{ fontFamily: C.mono, fontSize: "0.58rem", color: C.text3, marginBottom: 6 }}>NOTES</div>
                  <div style={{ fontSize: "0.8rem", color: C.text2, lineHeight: 1.6 }}>{selectedAthlete.notes}</div>
                </>}
              </Card>
            </div>
            {/* Session history */}
            <div>
              <Label>// Session History</Label>
              {athleteSessions.length === 0 ? (
                <div style={{ color: C.text3, fontFamily: C.mono, fontSize: "0.7rem", padding: "20px 0" }}>No sessions recorded yet.</div>
              ) : athleteSessions.map(s => {
                const sp = SPORTS[s.sport];
                return (
                  <div key={s.id} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${sp?.color || C.accent}`, padding: "10px 14px", marginBottom: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.83rem", color: C.text }}>{STRENGTH_DAYS[s.strengthDay]?.label}</div>
                      <div style={{ fontFamily: C.mono, fontSize: "0.58rem", color: C.text3 }}>{fmtDate(s.date)}</div>
                    </div>
                    <div style={{ fontFamily: C.mono, fontSize: "0.58rem", color: sp?.color }}>{sp?.icon} {sp?.label} · {PHASES[s.phase]?.label}</div>
                    {s.notes && <div style={{ fontSize: "0.75rem", color: C.text3, marginTop: 6, fontStyle: "italic" }}>{s.notes}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {showAdd && (
        <Modal onClose={() => { setShowAdd(false); setEditing(false); }}>
          <div style={{ padding: 28 }}>
            <Label style={{ marginBottom: 20 }}>{editing ? "// Edit Athlete" : "// Add New Athlete"}</Label>
            <Input label="Full Name *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Jordan Smith" />
            <Select label="Sport Profile" value={form.sport} onChange={v => setForm(f => ({ ...f, sport: v }))} options={Object.entries(SPORTS).map(([k, v]) => ({ value: k, label: `${v.icon} ${v.label}` }))} />
            <Select label="Training Phase" value={form.phase} onChange={v => setForm(f => ({ ...f, phase: v }))} options={Object.entries(PHASES).map(([k, v]) => ({ value: k, label: v.label }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Position / Discipline" value={form.position} onChange={v => setForm(f => ({ ...f, position: v }))} placeholder="e.g. Midfielder" />
              <Input label="Date of Birth" type="date" value={form.dob} onChange={v => setForm(f => ({ ...f, dob: v }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <Label>Notes / Injury History</Label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 2, color: C.text, fontFamily: C.font, fontSize: "0.85rem", padding: "9px 12px", outline: "none", resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn onClick={() => { setShowAdd(false); setEditing(false); }}>Cancel</Btn>
              <Btn variant="solid" onClick={saveAthlete}>{editing ? "Save Changes" : "Add Athlete"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// SESSION BUILDER
function SessionBuilder({ athletes, sessions, setSessions }) {
  const [step, setStep] = useState(1); // 1=setup 2=neural 3=strength 4=accessory 5=energy 6=review
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    athleteId: athletes[0]?.id || "",
    date: today(),
    sport: athletes[0]?.sport || "general",
    phase: athletes[0]?.phase || "offseason",
    strengthDay: 0,
    notes: "",
    neuralSelected: [],
    strengthSelected: {},
    accessorySelected: [],
    energySelected: [],
  });

  const selectedAthlete = athletes.find(a => a.id === form.athleteId);

  const setAthlete = (id) => {
    const a = athletes.find(x => x.id === id);
    if (a) setForm(f => ({ ...f, athleteId: id, sport: a.sport, phase: a.phase }));
  };

  const toggleNeural = (ex) => setForm(f => ({
    ...f, neuralSelected: f.neuralSelected.includes(ex) ? f.neuralSelected.filter(x => x !== ex) : [...f.neuralSelected, ex]
  }));
  const toggleAccessory = (ex) => setForm(f => ({
    ...f, accessorySelected: f.accessorySelected.includes(ex) ? f.accessorySelected.filter(x => x !== ex) : [...f.accessorySelected, ex]
  }));
  const toggleEnergy = (ex) => setForm(f => ({
    ...f, energySelected: f.energySelected.includes(ex) ? f.energySelected.filter(x => x !== ex) : [...f.energySelected, ex]
  }));
  const toggleStrength = (patTag, ex) => setForm(f => {
    const cur = f.strengthSelected[patTag] || [];
    return { ...f, strengthSelected: { ...f.strengthSelected, [patTag]: cur.includes(ex) ? cur.filter(x => x !== ex) : [...cur, ex] } };
  });

  const saveSession = async () => {
    const session = { id: uid(), createdAt: Date.now(), ...form };
    const updated = [...sessions, session];
    setSessions(updated);
    await store.set("sessions", updated);
    setSaved(true);
  };

  const reset = () => {
    setStep(1); setSaved(false);
    setForm({ athleteId: athletes[0]?.id || "", date: today(), sport: athletes[0]?.sport || "general", phase: athletes[0]?.phase || "offseason", strengthDay: 0, notes: "", neuralSelected: [], strengthSelected: {}, accessorySelected: [], energySelected: [] });
  };

  const stepLabels = ["Setup", "Neural Primer", "Main Strength", "Accessory", "Energy System", "Review & Save"];
  const dayPatterns = MOVEMENT_PATTERNS[form.sport]?.filter(p => p.day === form.strengthDay) || [];
  const sp = SPORTS[form.sport];

  if (athletes.length === 0) return (
    <div style={{ padding: "60px 32px", textAlign: "center" }}>
      <div style={{ fontFamily: C.mono, fontSize: "0.75rem", color: C.text3 }}>Add athletes to the roster first before building sessions.</div>
    </div>
  );

  if (saved) return (
    <div className="fade-in" style={{ padding: "60px 32px", textAlign: "center" }}>
      <div style={{ fontFamily: C.display, fontSize: "3rem", color: C.accent, letterSpacing: "0.05em", marginBottom: 12 }}>SESSION SAVED</div>
      <div style={{ fontFamily: C.mono, fontSize: "0.7rem", color: C.text3, marginBottom: 32 }}>
        {selectedAthlete?.name} · {STRENGTH_DAYS[form.strengthDay]?.label} · {fmtDate(form.date)}
      </div>
      <Btn variant="solid" onClick={reset}>Build Another Session</Btn>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ padding: "24px 32px 12px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: C.display, fontSize: "2.2rem", color: C.text, letterSpacing: "0.04em" }}>Session Builder</div>
        <div style={{ fontFamily: C.mono, fontSize: "0.62rem", color: C.text3, letterSpacing: "0.12em", marginTop: 4 }}>// BUILD & SAVE SESSION TO ATHLETE PROFILE</div>
      </div>

      {/* Step bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        {stepLabels.map((l, i) => (
          <button key={i} onClick={() => i < step && setStep(i + 1)} style={{
            padding: "10px 16px", fontFamily: C.mono, fontSize: "0.6rem", letterSpacing: "0.08em",
            background: step === i + 1 ? C.accent + "18" : "transparent",
            borderBottom: step === i + 1 ? `2px solid ${C.accent}` : "2px solid transparent",
            color: step === i + 1 ? C.accent : step > i + 1 ? C.text2 : C.text3,
            border: "none", cursor: i < step ? "pointer" : "default", whiteSpace: "nowrap",
          }}>
            {step > i + 1 ? "✓ " : `${i + 1}. `}{l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 32px", maxWidth: 800 }}>

        {/* Step 1: Setup */}
        {step === 1 && (
          <div className="fade-in">
            <Label>// Session Setup</Label>
            <Select label="Athlete *" value={form.athleteId} onChange={setAthlete}
              options={athletes.map(a => ({ value: a.id, label: `${SPORTS[a.sport]?.icon} ${a.name}` }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Session Date" type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
              <Select label="Training Phase" value={form.phase} onChange={v => setForm(f => ({ ...f, phase: v }))} options={Object.entries(PHASES).map(([k, v]) => ({ value: k, label: v.label }))} />
            </div>
            <Select label="Sport Profile" value={form.sport} onChange={v => setForm(f => ({ ...f, sport: v }))} options={Object.entries(SPORTS).map(([k, v]) => ({ value: k, label: `${v.icon} ${v.label}` }))} />
            <div style={{ marginBottom: 14 }}>
              <Label>Strength Day (Movement Pattern Focus)</Label>
              <div style={{ display: "flex", gap: 6 }}>
                {STRENGTH_DAYS.map((d, i) => (
                  <button key={i} onClick={() => setForm(f => ({ ...f, strengthDay: i }))} style={{
                    background: form.strengthDay === i ? C.accent : C.bg2,
                    border: `1px solid ${form.strengthDay === i ? C.accent : C.border}`,
                    color: form.strengthDay === i ? "#000" : C.text2,
                    fontFamily: C.mono, fontSize: "0.62rem", padding: "7px 14px", borderRadius: 2,
                    letterSpacing: "0.06em", flex: 1, cursor: "pointer",
                  }}>{d.label}</button>
                ))}
              </div>
            </div>
            <Btn variant="solid" onClick={() => setStep(2)} style={{ marginTop: 8 }}>Next: Neural Primer →</Btn>
          </div>
        )}

        {/* Step 2: Neural */}
        {step === 2 && (
          <div className="fade-in">
            <Label>// Block 01 — Neural Primer & RFD Activation</Label>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, padding: "10px 14px", marginBottom: 16, fontFamily: C.mono, fontSize: "0.62rem", color: C.text3 }}>
              Select exercises for this athlete. Tick all that apply. Aim for 4–6 exercises max.
            </div>
            {(NEURAL_BLOCKS[form.sport] || []).map((ex, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", background: form.neuralSelected.includes(ex) ? C.accent + "12" : C.bg2, border: `1px solid ${form.neuralSelected.includes(ex) ? C.accent + "55" : C.border}`, borderRadius: 2, marginBottom: 2, cursor: "pointer" }}>
                <input type="checkbox" checked={form.neuralSelected.includes(ex)} onChange={() => toggleNeural(ex)} style={{ accentColor: C.accent }} />
                <span style={{ fontSize: "0.83rem", color: C.text }}>{ex}</span>
              </label>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Btn onClick={() => setStep(1)}>← Back</Btn>
              <Btn variant="solid" onClick={() => setStep(3)}>Next: Main Strength →</Btn>
            </div>
          </div>
        )}

        {/* Step 3: Strength (movement patterns) */}
        {step === 3 && (
          <div className="fade-in">
            <Label>// Block 02 — Main Strength · {STRENGTH_DAYS[form.strengthDay]?.label}</Label>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${sp?.color}`, padding: "10px 14px", marginBottom: 16, fontFamily: C.mono, fontSize: "0.62rem", color: C.text3 }}>
              Select exercises per movement pattern. Primary = 3–4 exercises. Secondary = 2–3.
            </div>
            {dayPatterns.map((pat, pi) => (
              <div key={pi} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Tag color={pat.color}>{pat.tag}</Tag>
                </div>
                {pat.exercises.map((ex, ei) => (
                  <label key={ei} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", background: (form.strengthSelected[pat.tag] || []).includes(ex) ? pat.color + "12" : C.bg2, border: `1px solid ${(form.strengthSelected[pat.tag] || []).includes(ex) ? pat.color + "55" : C.border}`, borderRadius: 2, marginBottom: 2, cursor: "pointer" }}>
                    <input type="checkbox" checked={(form.strengthSelected[pat.tag] || []).includes(ex)} onChange={() => toggleStrength(pat.tag, ex)} style={{ accentColor: pat.color }} />
                    <span style={{ fontSize: "0.83rem", color: C.text }}>{ex}</span>
                  </label>
                ))}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Btn onClick={() => setStep(2)}>← Back</Btn>
              <Btn variant="solid" onClick={() => setStep(4)}>Next: Accessory →</Btn>
            </div>
          </div>
        )}

        {/* Step 4: Accessory */}
        {step === 4 && (
          <div className="fade-in">
            <Label>// Block 03 — Accessory & Sport-Specific</Label>
            {(ACCESSORY_BLOCKS[form.sport] || []).map((ex, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", background: form.accessorySelected.includes(ex) ? C.accent2 + "12" : C.bg2, border: `1px solid ${form.accessorySelected.includes(ex) ? C.accent2 + "55" : C.border}`, borderRadius: 2, marginBottom: 2, cursor: "pointer" }}>
                <input type="checkbox" checked={form.accessorySelected.includes(ex)} onChange={() => toggleAccessory(ex)} style={{ accentColor: C.accent2 }} />
                <span style={{ fontSize: "0.83rem", color: C.text }}>{ex}</span>
              </label>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Btn onClick={() => setStep(3)}>← Back</Btn>
              <Btn variant="solid" onClick={() => setStep(5)}>Next: Energy System →</Btn>
            </div>
          </div>
        )}

        {/* Step 5: Energy */}
        {step === 5 && (
          <div className="fade-in">
            <Label>// Block 04 — Energy System Work</Label>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent3}`, padding: "10px 14px", marginBottom: 16, fontFamily: C.mono, fontSize: "0.62rem", color: C.text3 }}>
              Keep this last. Concurrent training interference (Wilson et al., 2012) — endurance after strength preserves adaptation.
            </div>
            {(ENERGY_BLOCKS[form.sport] || []).map((ex, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", background: form.energySelected.includes(ex) ? C.accent3 + "12" : C.bg2, border: `1px solid ${form.energySelected.includes(ex) ? C.accent3 + "55" : C.border}`, borderRadius: 2, marginBottom: 2, cursor: "pointer" }}>
                <input type="checkbox" checked={form.energySelected.includes(ex)} onChange={() => toggleEnergy(ex)} style={{ accentColor: C.accent3 }} />
                <span style={{ fontSize: "0.83rem", color: C.text }}>{ex}</span>
              </label>
            ))}
            <div style={{ marginTop: 16, marginBottom: 14 }}>
              <Label>Session Notes</Label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="e.g. athlete reported fatigue, modified loading…"
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 2, color: C.text, fontFamily: C.font, fontSize: "0.85rem", padding: "9px 12px", outline: "none", resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => setStep(4)}>← Back</Btn>
              <Btn variant="solid" onClick={() => setStep(6)}>Review & Save →</Btn>
            </div>
          </div>
        )}

        {/* Step 6: Review */}
        {step === 6 && (
          <div className="fade-in">
            <Label>// Review Session</Label>
            <Card style={{ marginBottom: 16, borderTop: `2px solid ${sp?.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: C.display, fontSize: "1.5rem", color: C.text, letterSpacing: "0.04em" }}>{selectedAthlete?.name}</div>
                  <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: sp?.color, marginTop: 2 }}>{sp?.icon} {sp?.label} · {PHASES[form.phase]?.label}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: C.mono, fontSize: "0.65rem", color: C.text2 }}>{fmtDate(form.date)}</div>
                  <Tag color={sp?.color} style={{ marginTop: 4 }}>{STRENGTH_DAYS[form.strengthDay]?.abbr}</Tag>
                </div>
              </div>

              {[
                { label: "⚡ Neural Primer", exercises: form.neuralSelected, color: C.accent },
                { label: "🏋️ Strength", exercises: Object.values(form.strengthSelected).flat(), color: SPORTS[form.sport]?.color },
                { label: "🔩 Accessory", exercises: form.accessorySelected, color: C.accent2 },
                { label: "🔥 Energy System", exercises: form.energySelected, color: C.accent3 },
              ].map((block, i) => block.exercises.length > 0 && (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: block.color, letterSpacing: "0.1em", marginBottom: 6 }}>{block.label.toUpperCase()}</div>
                  {block.exercises.map((ex, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderBottom: `1px solid ${C.border}`, fontSize: "0.82rem", color: C.text }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: block.color, flexShrink: 0, display: "inline-block" }} />
                      {ex}
                    </div>
                  ))}
                </div>
              ))}

              {form.notes && (
                <>
                  <Divider />
                  <div style={{ fontFamily: C.mono, fontSize: "0.58rem", color: C.text3, marginBottom: 4 }}>NOTES</div>
                  <div style={{ fontSize: "0.8rem", color: C.text2, fontStyle: "italic" }}>{form.notes}</div>
                </>
              )}
            </Card>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => setStep(5)}>← Edit</Btn>
              <Btn variant="solid" onClick={saveSession}>💾 Save Session</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// PROGRAM VIEW
function ProgramView({ athletes, sessions }) {
  const [filterAthlete, setFilterAthlete] = useState("all");
  const [filterSport, setFilterSport] = useState("all");

  const filtered = sessions.filter(s => {
    if (filterAthlete !== "all" && s.athleteId !== filterAthlete) return false;
    if (filterSport !== "all" && s.sport !== filterSport) return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Group by week
  const grouped = filtered.reduce((acc, s) => {
    const d = new Date(s.date + "T00:00:00");
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const wk = monday.toISOString().split("T")[0];
    if (!acc[wk]) acc[wk] = [];
    acc[wk].push(s);
    return acc;
  }, {});

  const patternLoad = athletes.reduce((acc, a) => {
    const asSessions = sessions.filter(s => s.athleteId === a.id);
    const counts = { 0: 0, 1: 0, 2: 0 };
    asSessions.forEach(s => counts[s.strengthDay] = (counts[s.strengthDay] || 0) + 1);
    acc[a.id] = counts;
    return acc;
  }, {});

  return (
    <div className="fade-in">
      <div style={{ padding: "24px 32px 12px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: C.display, fontSize: "2.2rem", color: C.text, letterSpacing: "0.04em" }}>Program View</div>
        <div style={{ fontFamily: C.mono, fontSize: "0.62rem", color: C.text3, letterSpacing: "0.12em", marginTop: 4 }}>// SESSION HISTORY · PATTERN LOAD DISTRIBUTION</div>
      </div>

      <div style={{ padding: "20px 32px 0", display: "flex", gap: 12, flexWrap: "wrap", borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
        <Select value={filterAthlete} onChange={setFilterAthlete} options={[{ value: "all", label: "All Athletes" }, ...athletes.map(a => ({ value: a.id, label: a.name }))]} style={{ width: "auto", minWidth: 180 }} />
        <Select value={filterSport} onChange={setFilterSport} options={[{ value: "all", label: "All Sports" }, ...Object.entries(SPORTS).map(([k, v]) => ({ value: k, label: `${v.icon} ${v.label}` }))]} style={{ width: "auto", minWidth: 180 }} />
      </div>

      <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
        {/* Session log */}
        <div>
          <Label>// Session Log — {filtered.length} sessions</Label>
          {filtered.length === 0 ? (
            <div style={{ color: C.text3, fontFamily: C.mono, fontSize: "0.7rem", padding: "20px 0" }}>No sessions match your filters.</div>
          ) : Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([wk, wkSessions]) => (
            <div key={wk} style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.text3, letterSpacing: "0.1em", marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${C.border}` }}>
                WEEK OF {fmtDate(wk).toUpperCase()}
              </div>
              {wkSessions.map(s => {
                const ath = athletes.find(a => a.id === s.athleteId);
                const sp = SPORTS[s.sport];
                return (
                  <div key={s.id} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${sp?.color}`, padding: "12px 16px", marginBottom: 2, display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: C.text, marginBottom: 3 }}>{ath?.name || "Unknown"} <span style={{ color: C.text3, fontWeight: 400, fontSize: "0.8rem" }}>— {STRENGTH_DAYS[s.strengthDay]?.label}</span></div>
                      <div style={{ fontFamily: C.mono, fontSize: "0.58rem", display: "flex", gap: 10 }}>
                        <span style={{ color: sp?.color }}>{sp?.icon} {sp?.label}</span>
                        <span style={{ color: C.text3 }}>·</span>
                        <span style={{ color: PHASES[s.phase]?.color }}>{PHASES[s.phase]?.abbr}</span>
                      </div>
                      {s.notes && <div style={{ fontSize: "0.72rem", color: C.text3, marginTop: 5, fontStyle: "italic" }}>{s.notes}</div>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.text3 }}>{fmtDate(s.date)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Pattern load sidebar */}
        <div>
          <Label>// Pattern Load Distribution</Label>
          {athletes.map(a => (
            <Card key={a.id} style={{ marginBottom: 8, padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: C.text, marginBottom: 10 }}>{a.name}</div>
              {STRENGTH_DAYS.map((d, i) => {
                const count = patternLoad[a.id]?.[i] || 0;
                const total = sessions.filter(s => s.athleteId === a.id).length || 1;
                const pct = Math.round((count / total) * 100);
                const patColors = [C.accent, C.accent2, C.gold];
                return (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <div style={{ fontFamily: C.mono, fontSize: "0.56rem", color: C.text3 }}>{d.abbr}</div>
                      <div style={{ fontFamily: C.mono, fontSize: "0.56rem", color: patColors[i] }}>{count}×</div>
                    </div>
                    <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: patColors[i], borderRadius: 2, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                );
              })}
            </Card>
          ))}
          {athletes.length === 0 && <div style={{ color: C.text3, fontFamily: C.mono, fontSize: "0.65rem" }}>Add athletes to see load distribution.</div>}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("dashboard");
  const [athletes, setAthletes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);

  useEffect(() => {
    Promise.all([store.get("athletes"), store.get("sessions")]).then(([a, s]) => {
      if (a) setAthletes(a);
      if (s) setSessions(s);
      setLoading(false);
    });
  }, []);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  if (loading) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{FONTS}</style>
      <Mono style={{ color: C.text3, fontSize: "0.7rem", letterSpacing: "0.2em", animation: "pulse 1.5s infinite" }}>LOADING DATA...</Mono>
    </div>
  );

  return (
    <div style={{ display: "flex", background: C.bg, minHeight: "100vh", fontFamily: C.font, color: C.text }}>
      <style>{FONTS}</style>
      <Sidebar screen={screen} setScreen={setScreen} athleteCount={athletes.length} />
      <main style={{ flex: 1, overflowY: "auto", minHeight: "100vh" }}>
        {screen === "dashboard" && <Dashboard athletes={athletes} sessions={sessions} setScreen={setScreen} setSelectedAthlete={setSelectedAthlete} />}
        {screen === "roster"    && <Roster athletes={athletes} setAthletes={setAthletes} sessions={sessions} selectedId={selectedAthlete} setSelectedId={setSelectedAthlete} />}
        {screen === "session"   && <SessionBuilder athletes={athletes} sessions={sessions} setSessions={setSessions} />}
        {screen === "program"   && <ProgramView athletes={athletes} sessions={sessions} />}
      </main>
    </div>
  );