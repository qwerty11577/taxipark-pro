import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SIDEBAR = [
    { icon: "📊", label: "Dashboard", path: "/dashboard" },
    { icon: "👨‍✈️", label: "Водители", path: "/drivers" },
    { icon: "🚗", label: "Автопарк", path: "/cars", active: true },
    { icon: "📋", label: "Заказы", path: "/orders" },
    { icon: "💰", label: "Финансы", path: "/finance" },
    { icon: "⚙️", label: "Настройки", path: "/settings" },
];

const INITIAL_CARS = [
    { id: 1, model: "Toyota Camry", plate: "A 123 BC", year: 2021, driver: "Алишер К.", status: "Онлайн", mileage: "45 200", insurance: "2026-08-15", techcheck: "2026-06-30", color: "#f5c518" },
    { id: 2, model: "Hyundai Sonata", plate: "B 456 CD", year: 2020, driver: "Бобур М.", status: "Онлайн", mileage: "62 800", insurance: "2026-09-20", techcheck: "2026-07-15", color: "#00d4aa" },
    { id: 3, model: "Kia K5", plate: "C 789 DE", year: 2022, driver: "Санжар Т.", status: "Офлайн", mileage: "28 400", insurance: "2026-10-05", techcheck: "2026-08-20", color: "#a78bfa" },
    { id: 4, model: "Chevrolet Malibu", plate: "D 012 EF", year: 2019, driver: "Достон У.", status: "В ремонте", mileage: "89 600", insurance: "2026-07-10", techcheck: "2026-05-30", color: "#ff6b35" },
    { id: 5, model: "Nexia 3", plate: "E 345 FG", year: 2021, driver: "Жавлон Р.", status: "Офлайн", mileage: "34 100", insurance: "2026-11-25", techcheck: "2026-09-10", color: "#f472b6" },
];

const statusColor = (s) => s === "Онлайн" ? "#4ade80" : s === "В ремонте" ? "#ff5050" : s === "В пути" ? "#f5c518" : "#555";

export default function Cars() {
    const navigate = useNavigate();
    const [cars, setCars] = useState(INITIAL_CARS);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Все");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [form, setForm] = useState({ model: "", plate: "", year: "", driver: "", status: "Офлайн" });

    const filtered = cars.filter(c => {
        const matchSearch = c.model.toLowerCase().includes(search.toLowerCase()) ||
            c.plate.toLowerCase().includes(search.toLowerCase()) ||
            c.driver.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "Все" || c.status === filter;
        return matchSearch && matchFilter;
    });

    const addCar = () => {
        if (!form.model || !form.plate || !form.year) {
            toast.error("Заполните все поля!");
            return;
        }
        const newCar = {
            id: Date.now(),
            model: form.model,
            plate: form.plate,
            year: parseInt(form.year),
            driver: form.driver || "Не назначен",
            status: form.status,
            mileage: "0",
            insurance: "—",
            techcheck: "—",
            color: "#f5c518",
        };
        setCars([...cars, newCar]);
        setForm({ model: "", plate: "", year: "", driver: "", status: "Офлайн" });
        setShowModal(false);
        toast.success(`✅ Машина ${form.model} добавлена!`);
    };

    const deleteCar = (id) => {
        const car = cars.find(c => c.id === id);
        setCars(cars.filter(c => c.id !== id));
        setShowDeleteModal(null);
        toast.error(`🗑️ ${car.model} удалена`);
    };

    return (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#050508", color: "#fff", minHeight: "100vh", display: "flex" }}>
            <ToastContainer theme="dark" />

            {/* Delete Modal */}
            {showDeleteModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                    <div style={{ background: "#0f0f1a", border: "1px solid rgba(255,80,80,0.3)", borderRadius: "20px", padding: "40px", maxWidth: "400px", width: "90%", textAlign: "center" }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗑️</div>
                        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Удалить машину?</h3>
                        <p style={{ color: "#555", marginBottom: "32px" }}>Это действие нельзя отменить</p>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={() => setShowDeleteModal(null)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>Отмена</button>
                            <button onClick={() => deleteCar(showDeleteModal)} style={{ flex: 1, padding: "14px", background: "rgba(255,80,80,0.2)", color: "#ff5050", border: "1px solid rgba(255,80,80,0.3)", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>Удалить</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                    <div style={{ background: "#0f0f1a", border: "1px solid rgba(245,197,24,0.2)", borderRadius: "24px", padding: "40px", maxWidth: "480px", width: "90%" }}>
                        <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}>🚗 Добавить машину</h3>
                        {[
                            { label: "Модель", key: "model", placeholder: "Toyota Camry" },
                            { label: "Гос. номер", key: "plate", placeholder: "A 123 BC" },
                            { label: "Год выпуска", key: "year", placeholder: "2022" },
                            { label: "Водитель", key: "driver", placeholder: "Алишер Каримов" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontWeight: 500 }}>{f.label}</label>
                                <input
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box" }}
                                    onFocus={e => e.target.style.border = "1px solid rgba(245,197,24,0.5)"}
                                    onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
                                />
                            </div>
                        ))}
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontWeight: 500 }}>Статус</label>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {["Онлайн", "Офлайн", "В ремонте"].map(s => (
                                    <button key={s} onClick={() => setForm({ ...form, status: s })} style={{ flex: 1, padding: "10px", background: form.status === s ? `${statusColor(s)}20` : "rgba(255,255,255,0.03)", color: form.status === s ? statusColor(s) : "#555", border: `1px solid ${form.status === s ? statusColor(s) + "40" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 600 }}>
                                        ● {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>Отмена</button>
                            <button onClick={addCar} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>Добавить →</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div style={{ width: sidebarCollapsed ? "72px" : "260px", background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "24px 16px", display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🚗</div>
                        {!sidebarCollapsed && <span style={{ fontSize: "18px", fontWeight: 800, whiteSpace: "nowrap" }}>TaxiPark <span style={{ color: "#f5c518" }}>Pro</span></span>}
                    </div>
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: "transparent", border: "none", color: "#444", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}>
                        {sidebarCollapsed ? "→" : "←"}
                    </button>
                </div>
                {SIDEBAR.map((item, i) => (
                    <button key={i} onClick={() => navigate(item.path)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", marginBottom: "4px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 500, background: item.active ? "rgba(245,197,24,0.1)" : "transparent", color: item.active ? "#f5c518" : "#555", textAlign: "left", width: "100%", transition: "all 0.2s", whiteSpace: "nowrap" }}
                        onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#fff"; } }}
                        onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; } }}>
                        <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                        {!sidebarCollapsed && item.label}
                    </button>
                ))}
                <div style={{ marginTop: "auto" }}>
                    <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", background: "transparent", color: "#555", width: "100%", whiteSpace: "nowrap" }}>
                        <span style={{ flexShrink: 0 }}>🚪</span>
                        {!sidebarCollapsed && "Выйти"}
                    </button>
                </div>
            </div>

            {/* Main */}
            <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>Автопарк</h1>
                        <p style={{ color: "#444", marginTop: "4px" }}>Всего: {cars.length} машин</p>
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск..." style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "10px 20px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", width: "200px" }} />
                        <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", padding: "12px 24px", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>+ Добавить</button>
                    </div>
                </div>

                {/* Filter */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                    {["Все", "Онлайн", "В пути", "Офлайн", "В ремонте"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 20px", borderRadius: "50px", border: filter === f ? "1px solid rgba(245,197,24,0.4)" : "1px solid rgba(255,255,255,0.1)", background: filter === f ? "rgba(245,197,24,0.1)" : "transparent", color: filter === f ? "#f5c518" : "#555", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 500 }}>
                            {f}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                    {[
                        { label: "Онлайн", value: cars.filter(c => c.status === "Онлайн").length, color: "#4ade80" },
                        { label: "В пути", value: cars.filter(c => c.status === "В пути").length, color: "#f5c518" },
                        { label: "Офлайн", value: cars.filter(c => c.status === "Офлайн").length, color: "#555" },
                        { label: "В ремонте", value: cars.filter(c => c.status === "В ремонте").length, color: "#ff5050" },
                    ].map((s, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}`, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
                                <div style={{ color: "#444", fontSize: "14px" }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cars grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                    {filtered.map(car => (
                        <div key={car.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px", transition: "all 0.3s" }}
                            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${car.color}40`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${car.color}15`, border: `1px solid ${car.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🚗</div>
                                <span style={{ fontSize: "13px", color: statusColor(car.status), fontWeight: 600, background: `${statusColor(car.status)}15`, padding: "4px 12px", borderRadius: "50px", border: `1px solid ${statusColor(car.status)}30` }}>● {car.status}</span>
                            </div>
                            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>{car.model}</h3>
                            <div style={{ color: car.color, fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>{car.plate} • {car.year}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                    <span style={{ color: "#444" }}>👨‍✈️ Водитель</span>
                                    <span>{car.driver}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                    <span style={{ color: "#444" }}>📍 Пробег</span>
                                    <span>{car.mileage} км</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                    <span style={{ color: "#444" }}>🛡️ Страховка</span>
                                    <span style={{ color: "#4ade80" }}>{car.insurance}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                    <span style={{ color: "#444" }}>🔧 Техосмотр</span>
                                    <span style={{ color: "#f5c518" }}>{car.techcheck}</span>
                                </div>
                            </div>
                            <button onClick={() => setShowDeleteModal(car.id)} style={{ width: "100%", padding: "10px", background: "rgba(255,80,80,0.08)", color: "#ff5050", border: "1px solid rgba(255,80,80,0.2)", borderRadius: "12px", cursor: "pointer", fontSize: "13px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, transition: "all 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,80,80,0.15)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,80,80,0.08)"}>
                                🗑️ Удалить
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}