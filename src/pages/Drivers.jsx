import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SIDEBAR = [
    { icon: "📊", label: "Dashboard", path: "/dashboard" },
    { icon: "👨‍✈️", label: "Водители", path: "/drivers", active: true },
    { icon: "🚗", label: "Автопарк", path: "/cars" },
    { icon: "📋", label: "Заказы", path: "/orders" },
    { icon: "💰", label: "Финансы", path: "/finance" },
    { icon: "⚙️", label: "Настройки", path: "/settings" },
];

const INITIAL_DRIVERS = [
    { id: 1, name: "Алишер Каримов", car: "Toyota Camry", phone: "+7 999 123 45 67", orders: 28, revenue: "12 400₽", status: "Онлайн", rating: 4.9 },
    { id: 2, name: "Бобур Марипов", car: "Hyundai Sonata", phone: "+7 999 234 56 78", orders: 24, revenue: "10 800₽", status: "Онлайн", rating: 4.8 },
    { id: 3, name: "Санжар Тошматов", car: "Kia K5", phone: "+7 999 345 67 89", orders: 19, revenue: "8 600₽", status: "Офлайн", rating: 4.7 },
    { id: 4, name: "Достон Усмонов", car: "Chevrolet Malibu", phone: "+7 999 456 78 90", orders: 17, revenue: "7 200₽", status: "В пути", rating: 4.6 },
    { id: 5, name: "Жавлон Рахимов", car: "Nexia 3", phone: "+7 999 567 89 01", orders: 15, revenue: "6 800₽", status: "Офлайн", rating: 4.5 },
];

const statusColor = (s) => s === "Онлайн" ? "#4ade80" : s === "В пути" ? "#f5c518" : "#555";

export default function Drivers() {
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Все");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [form, setForm] = useState({ name: "", car: "", phone: "", status: "Офлайн" });

    const filtered = drivers.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.car.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "Все" || d.status === filter;
        return matchSearch && matchFilter;
    });

    const addDriver = () => {
        if (!form.name || !form.car || !form.phone) {
            toast.error("Заполните все поля!");
            return;
        }
        const newDriver = {
            id: Date.now(),
            name: form.name,
            car: form.car,
            phone: form.phone,
            status: form.status,
            orders: 0,
            revenue: "0₽",
            rating: 5.0,
        };
        setDrivers([...drivers, newDriver]);
        setForm({ name: "", car: "", phone: "", status: "Офлайн" });
        setShowModal(false);
        toast.success(`✅ Водитель ${form.name} добавлен!`);
    };

    const deleteDriver = (id) => {
        const driver = drivers.find(d => d.id === id);
        setDrivers(drivers.filter(d => d.id !== id));
        setShowDeleteModal(null);
        toast.error(`🗑️ Водитель ${driver.name} удалён`);
    };

    return (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#050508", color: "#fff", minHeight: "100vh", display: "flex" }}>
            <ToastContainer theme="dark" />

            {/* Delete Modal */}
            {showDeleteModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                    <div style={{ background: "#0f0f1a", border: "1px solid rgba(255,80,80,0.3)", borderRadius: "20px", padding: "40px", maxWidth: "400px", width: "90%", textAlign: "center" }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗑️</div>
                        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Удалить водителя?</h3>
                        <p style={{ color: "#555", marginBottom: "32px" }}>Это действие нельзя отменить</p>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={() => setShowDeleteModal(null)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                                Отмена
                            </button>
                            <button onClick={() => deleteDriver(showDeleteModal)} style={{ flex: 1, padding: "14px", background: "rgba(255,80,80,0.2)", color: "#ff5050", border: "1px solid rgba(255,80,80,0.3)", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                    <div style={{ background: "#0f0f1a", border: "1px solid rgba(245,197,24,0.2)", borderRadius: "24px", padding: "40px", maxWidth: "480px", width: "90%" }}>
                        <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}>➕ Добавить водителя</h3>

                        {[
                            { label: "Имя и фамилия", key: "name", placeholder: "Алишер Каримов", type: "text" },
                            { label: "Автомобиль", key: "car", placeholder: "Toyota Camry", type: "text" },
                            { label: "Телефон", key: "phone", placeholder: "+7 999 123 45 67", type: "tel" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontWeight: 500 }}>{f.label}</label>
                                <input
                                    type={f.type}
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
                            <div style={{ display: "flex", gap: "8px" }}>
                                {["Онлайн", "Офлайн", "В пути"].map(s => (
                                    <button key={s} onClick={() => setForm({ ...form, status: s })} style={{ flex: 1, padding: "10px", background: form.status === s ? `${statusColor(s)}20` : "rgba(255,255,255,0.03)", color: form.status === s ? statusColor(s) : "#555", border: `1px solid ${form.status === s ? statusColor(s) + "40" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 600, transition: "all 0.2s" }}>
                                        ● {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                                Отмена
                            </button>
                            <button onClick={addDriver} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px" }}>
                                Добавить →
                            </button>
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

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>Водители</h1>
                        <p style={{ color: "#444", marginTop: "4px" }}>Всего: {drivers.length} водителей</p>
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="🔍 Поиск..."
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "10px 20px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", width: "200px" }}
                        />
                        <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", padding: "12px 24px", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>
                            + Добавить
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                    {["Все", "Онлайн", "В пути", "Офлайн"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 20px", borderRadius: "50px", border: filter === f ? "1px solid rgba(245,197,24,0.4)" : "1px solid rgba(255,255,255,0.1)", background: filter === f ? "rgba(245,197,24,0.1)" : "transparent", color: filter === f ? "#f5c518" : "#555", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 500, transition: "all 0.2s" }}>
                            {f} {f !== "Все" && <span style={{ color: statusColor(f) }}>●</span>}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
                    {[
                        { label: "Онлайн", value: drivers.filter(d => d.status === "Онлайн").length, color: "#4ade80" },
                        { label: "В пути", value: drivers.filter(d => d.status === "В пути").length, color: "#f5c518" },
                        { label: "Офлайн", value: drivers.filter(d => d.status === "Офлайн").length, color: "#555" },
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

                {/* Drivers list */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700 }}>
                            Список водителей
                            {search && <span style={{ color: "#f5c518", fontSize: "14px", marginLeft: "8px" }}>({filtered.length} найдено)</span>}
                        </h3>
                    </div>

                    {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px", color: "#444" }}>
                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                            <div style={{ fontSize: "16px" }}>Водитель не найден</div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 80px", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "12px", marginBottom: "8px" }}>
                                {["Водитель", "Машина", "Заказов", "Выручка", "Рейтинг", "Статус", ""].map((h, i) => (
                                    <span key={i} style={{ fontSize: "12px", color: "#444", fontWeight: 600 }}>{h}</span>
                                ))}
                            </div>
                            {filtered.map((d, i) => (
                                <div key={d.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 80px", gap: "0", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", alignItems: "center", transition: "background 0.2s", borderRadius: "8px" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(245,197,24,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "#f5c518", flexShrink: 0 }}>{d.name[0]}</div>
                                        <div>
                                            <div style={{ fontSize: "14px", fontWeight: 600 }}>{d.name}</div>
                                            <div style={{ fontSize: "12px", color: "#444" }}>{d.phone}</div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: "13px", color: "#555" }}>{d.car}</span>
                                    <span style={{ fontSize: "14px" }}>{d.orders}</span>
                                    <span style={{ fontSize: "14px", color: "#4ade80" }}>{d.revenue}</span>
                                    <span style={{ fontSize: "14px", color: "#f5c518" }}>⭐ {d.rating}</span>
                                    <span style={{ fontSize: "13px", color: statusColor(d.status), fontWeight: 600 }}>● {d.status}</span>
                                    <button onClick={() => setShowDeleteModal(d.id)} style={{ background: "rgba(255,80,80,0.1)", color: "#ff5050", border: "1px solid rgba(255,80,80,0.2)", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "12px", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,80,80,0.2)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,80,80,0.1)"}>
                                        Удалить
                                    </button>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}