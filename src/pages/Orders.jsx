import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SIDEBAR = [
    { icon: "📊", label: "Dashboard", path: "/dashboard" },
    { icon: "👨‍✈️", label: "Водители", path: "/drivers" },
    { icon: "🚗", label: "Автопарк", path: "/cars" },
    { icon: "📋", label: "Заказы", path: "/orders", active: true },
    { icon: "💰", label: "Финансы", path: "/finance" },
    { icon: "⚙️", label: "Настройки", path: "/settings" },
];

const INITIAL_ORDERS = [
    { id: 1, client: "Иван Петров", from: "ул. Ленина, 12", to: "Аэропорт Домодедово", driver: "Алишер К.", car: "Toyota Camry", price: "1 200₽", status: "Завершён", time: "10:30", date: "07.06.2026" },
    { id: 2, client: "Мария Сидорова", from: "Красная площадь", to: "ул. Арбат, 45", driver: "Бобур М.", car: "Hyundai Sonata", price: "450₽", status: "В пути", time: "11:15", date: "07.06.2026" },
    { id: 3, client: "Александр Иванов", from: "Москва-Сити", to: "Парк Горького", driver: "Санжар Т.", car: "Kia K5", price: "780₽", status: "Ожидание", time: "11:45", date: "07.06.2026" },
    { id: 4, client: "Елена Козлова", from: "ул. Тверская, 8", to: "Ярославский вокзал", driver: "Достон У.", car: "Chevrolet Malibu", price: "620₽", status: "Завершён", time: "09:20", date: "07.06.2026" },
    { id: 5, client: "Дмитрий Новиков", from: "ВДНХ", to: "Шереметьево", driver: "Жавлон Р.", car: "Nexia 3", price: "2 100₽", status: "Отменён", time: "08:50", date: "07.06.2026" },
    { id: 6, client: "Анна Морозова", from: "Курский вокзал", to: "ул. Садовая, 23", driver: "Алишер К.", car: "Toyota Camry", price: "380₽", status: "Завершён", time: "08:15", date: "07.06.2026" },
];

const statusColor = (s) => {
    if (s === "Завершён") return "#4ade80";
    if (s === "В пути") return "#f5c518";
    if (s === "Ожидание") return "#38bdf8";
    if (s === "Отменён") return "#ff5050";
    return "#555";
};

const statusEmoji = (s) => {
    if (s === "Завершён") return "✅";
    if (s === "В пути") return "🚗";
    if (s === "Ожидание") return "⏳";
    if (s === "Отменён") return "❌";
    return "•";
};

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Все");
    const [showModal, setShowModal] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [form, setForm] = useState({ client: "", from: "", to: "", driver: "", price: "", status: "Ожидание" });

    const filtered = orders.filter(o => {
        const matchSearch =
            o.client.toLowerCase().includes(search.toLowerCase()) ||
            o.driver.toLowerCase().includes(search.toLowerCase()) ||
            o.from.toLowerCase().includes(search.toLowerCase()) ||
            o.to.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "Все" || o.status === filter;
        return matchSearch && matchFilter;
    });

    const addOrder = () => {
        if (!form.client || !form.from || !form.to || !form.price) {
            toast.error("Заполните все поля!");
            return;
        }
        const now = new Date();
        const newOrder = {
            id: Date.now(),
            client: form.client,
            from: form.from,
            to: form.to,
            driver: form.driver || "Не назначен",
            car: "—",
            price: form.price + "₽",
            status: form.status,
            time: now.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
            date: now.toLocaleDateString("ru"),
        };
        setOrders([newOrder, ...orders]);
        setForm({ client: "", from: "", to: "", driver: "", price: "", status: "Ожидание" });
        setShowModal(false);
        toast.success(`✅ Заказ для ${form.client} добавлен!`);
    };

    const cancelOrder = (id) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: "Отменён" } : o));
        toast.error("❌ Заказ отменён");
    };

    const completeOrder = (id) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: "Завершён" } : o));
        toast.success("✅ Заказ завершён!");
    };

    const totalRevenue = orders.filter(o => o.status === "Завершён").reduce((sum, o) => sum + parseInt(o.price.replace(/\D/g, "")), 0);

    return (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#050508", color: "#fff", minHeight: "100vh", display: "flex" }}>
            <ToastContainer theme="dark" />

            {/* Add Modal */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                    <div style={{ background: "#0f0f1a", border: "1px solid rgba(245,197,24,0.2)", borderRadius: "24px", padding: "40px", maxWidth: "480px", width: "90%" }}>
                        <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}>📋 Новый заказ</h3>
                        {[
                            { label: "Клиент", key: "client", placeholder: "Иван Петров" },
                            { label: "Откуда", key: "from", placeholder: "ул. Ленина, 12" },
                            { label: "Куда", key: "to", placeholder: "Аэропорт" },
                            { label: "Водитель", key: "driver", placeholder: "Алишер К." },
                            { label: "Цена (₽)", key: "price", placeholder: "1200" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: "14px" }}>
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
                            <div style={{ display: "flex", gap: "8px" }}>
                                {["Ожидание", "В пути"].map(s => (
                                    <button key={s} onClick={() => setForm({ ...form, status: s })} style={{ flex: 1, padding: "10px", background: form.status === s ? `${statusColor(s)}20` : "rgba(255,255,255,0.03)", color: form.status === s ? statusColor(s) : "#555", border: `1px solid ${form.status === s ? statusColor(s) + "40" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 600 }}>
                                        {statusEmoji(s)} {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>Отмена</button>
                            <button onClick={addOrder} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>Создать →</button>
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
                        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>Заказы</h1>
                        <p style={{ color: "#444", marginTop: "4px" }}>Сегодня: {orders.length} заказов</p>
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск..." style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "10px 20px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", width: "200px" }} />
                        <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", padding: "12px 24px", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>+ Новый заказ</button>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                    {[
                        { label: "Завершённых", value: orders.filter(o => o.status === "Завершён").length, color: "#4ade80" },
                        { label: "В пути", value: orders.filter(o => o.status === "В пути").length, color: "#f5c518" },
                        { label: "Ожидание", value: orders.filter(o => o.status === "Ожидание").length, color: "#38bdf8" },
                        { label: "Выручка", value: totalRevenue.toLocaleString() + "₽", color: "#a78bfa" },
                    ].map((s, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" }}>
                            <div style={{ color: "#444", fontSize: "13px", marginBottom: "8px" }}>{s.label}</div>
                            <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Filter */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                    {["Все", "В пути", "Ожидание", "Завершён", "Отменён"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 20px", borderRadius: "50px", border: filter === f ? "1px solid rgba(245,197,24,0.4)" : "1px solid rgba(255,255,255,0.1)", background: filter === f ? "rgba(245,197,24,0.1)" : "transparent", color: filter === f ? "#f5c518" : "#555", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 500 }}>
                            {f}
                        </button>
                    ))}
                </div>

                {/* Orders list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px", color: "#444", background: "rgba(255,255,255,0.02)", borderRadius: "20px" }}>
                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                            <div>Заказов не найдено</div>
                        </div>
                    ) : filtered.map(order => (
                        <div key={order.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "20px", transition: "all 0.3s" }}
                            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${statusColor(order.status)}30`; e.currentTarget.style.transform = "translateX(4px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateX(0)"; }}>

                            {/* Status icon */}
                            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${statusColor(order.status)}15`, border: `1px solid ${statusColor(order.status)}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                                {statusEmoji(order.status)}
                            </div>

                            {/* Route */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{order.client}</div>
                                <div style={{ fontSize: "13px", color: "#444", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.from}</span>
                                    <span>→</span>
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.to}</span>
                                </div>
                            </div>

                            {/* Driver */}
                            <div style={{ textAlign: "center", minWidth: "120px" }}>
                                <div style={{ fontSize: "13px", color: "#444", marginBottom: "4px" }}>Водитель</div>
                                <div style={{ fontSize: "14px", fontWeight: 600 }}>{order.driver}</div>
                            </div>

                            {/* Price */}
                            <div style={{ textAlign: "center", minWidth: "80px" }}>
                                <div style={{ fontSize: "18px", fontWeight: 800, color: "#4ade80" }}>{order.price}</div>
                                <div style={{ fontSize: "12px", color: "#444" }}>{order.time}</div>
                            </div>

                            {/* Status */}
                            <div style={{ minWidth: "100px", textAlign: "center" }}>
                                <span style={{ fontSize: "13px", color: statusColor(order.status), fontWeight: 600, background: `${statusColor(order.status)}15`, padding: "6px 14px", borderRadius: "50px", border: `1px solid ${statusColor(order.status)}30` }}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                                {order.status === "В пути" && (
                                    <button onClick={() => completeOrder(order.id)} style={{ padding: "8px 14px", background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "10px", cursor: "pointer", fontSize: "12px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>✅ Завершить</button>
                                )}
                                {(order.status === "Ожидание" || order.status === "В пути") && (
                                    <button onClick={() => cancelOrder(order.id)} style={{ padding: "8px 14px", background: "rgba(255,80,80,0.1)", color: "#ff5050", border: "1px solid rgba(255,80,80,0.2)", borderRadius: "10px", cursor: "pointer", fontSize: "12px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>❌ Отменить</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}