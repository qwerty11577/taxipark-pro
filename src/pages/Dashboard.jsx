import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    LineElement, PointElement, Title, Tooltip, Legend, Filler
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const SIDEBAR = [
    { icon: "📊", label: "Dashboard", path: "/dashboard", active: true },
    { icon: "👨‍✈️", label: "Водители", path: "/drivers" },
    { icon: "🚗", label: "Автопарк", path: "/cars" },
    { icon: "📋", label: "Заказы", path: "/orders" },
    { icon: "💰", label: "Финансы", path: "/finance" },
    { icon: "⚙️", label: "Настройки", path: "/settings" },
];

const NOTIFICATIONS = [
    { id: 1, text: "Алишер принял новый заказ", time: "2 мин", type: "success", read: false },
    { id: 2, text: "ТО машины Toyota Camry истекает", time: "1 час", type: "warning", read: false },
    { id: 3, text: "Новый водитель зарегистрирован", time: "2 час", type: "info", read: true },
    { id: 4, text: "Выручка превысила план на 12%", time: "3 час", type: "success", read: true },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(false);
    const [notifications, setNotifications] = useState(NOTIFICATIONS);
    const [search, setSearch] = useState("");
    const [chartType, setChartType] = useState("bar");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const timer = setInterval(() => {
            toast.success("🚗 Новый заказ принят!", { position: "top-right", autoClose: 3000 });
        }, 15000);
        return () => clearInterval(timer);
    }, []);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.info("Все уведомления прочитаны");
    };

    const weekData = {
        labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
        datasets: [{
            label: "Выручка (₽)",
            data: [29400, 46200, 35300, 65600, 52100, 84200, 60500],
            backgroundColor: chartType === "bar"
                ? ["rgba(245,197,24,0.3)", "rgba(245,197,24,0.3)", "rgba(245,197,24,0.3)", "rgba(245,197,24,0.3)", "rgba(245,197,24,0.3)", "rgba(245,197,24,0.8)", "rgba(245,197,24,0.3)"]
                : "rgba(245,197,24,0.1)",
            borderColor: "#f5c518",
            borderWidth: 2,
            borderRadius: chartType === "bar" ? 8 : 0,
            fill: chartType === "line",
            tension: 0.4,
            pointBackgroundColor: "#f5c518",
            pointRadius: 5,
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#1a1a2e",
                titleColor: "#f5c518",
                bodyColor: "#fff",
                borderColor: "rgba(245,197,24,0.3)",
                borderWidth: 1,
                callbacks: {
                    label: (ctx) => `${ctx.raw.toLocaleString()} ₽`
                }
            }
        },
        scales: {
            x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#555" } },
            y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#555", callback: v => `${(v / 1000).toFixed(0)}K` } }
        }
    };

    const drivers = [
        { name: "Алишер К.", car: "Toyota Camry", orders: 28, revenue: "12 400₽", status: "Онлайн" },
        { name: "Бобур М.", car: "Hyundai Sonata", orders: 24, revenue: "10 800₽", status: "Онлайн" },
        { name: "Санжар Т.", car: "Kia K5", orders: 19, revenue: "8 600₽", status: "Офлайн" },
        { name: "Достон У.", car: "Chevrolet Malibu", orders: 17, revenue: "7 200₽", status: "В пути" },
    ];

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.car.toLowerCase().includes(search.toLowerCase())
    );

    const statusColor = (s) => s === "Онлайн" ? "#4ade80" : s === "В пути" ? "#f5c518" : "#555";

    return (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#050508", color: "#fff", minHeight: "100vh", display: "flex" }}>
            <ToastContainer theme="dark" />

            {/* Sidebar */}
            <div style={{ width: sidebarCollapsed ? "72px" : "260px", background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "24px 16px", display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🚗</div>
                        {!sidebarCollapsed && <span style={{ fontSize: "18px", fontWeight: 800, whiteSpace: "nowrap" }}>TaxiPark <span style={{ color: "#f5c518" }}>Pro</span></span>}
                    </div>
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: "transparent", border: "none", color: "#444", cursor: "pointer", fontSize: "18px", padding: "4px", flexShrink: 0 }}>
                        {sidebarCollapsed ? "→" : "←"}
                    </button>
                </div>

                {SIDEBAR.map((item, i) => (
                    <button key={i} onClick={() => navigate(item.path)} title={item.label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", marginBottom: "4px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 500, background: item.active ? "rgba(245,197,24,0.1)" : "transparent", color: item.active ? "#f5c518" : "#555", textAlign: "left", width: "100%", transition: "all 0.2s", whiteSpace: "nowrap" }}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <div>
                        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>Главная панель</h1>
                        <p style={{ color: "#444", marginTop: "4px" }}>Воскресенье, 7 июня 2026</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

                        {/* Search */}
                        <div style={{ position: "relative" }}>
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="🔍 Поиск..."
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "10px 20px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", width: "200px" }}
                            />
                        </div>

                        {/* Notifications */}
                        <div style={{ position: "relative" }}>
                            <button onClick={() => setShowNotif(!showNotif)} style={{ position: "relative", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: "44px", height: "44px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                🔔
                                {unreadCount > 0 && (
                                    <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "18px", height: "18px", background: "#ff4757", borderRadius: "50%", fontSize: "11px", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>
                                )}
                            </button>

                            {showNotif && (
                                <div style={{ position: "absolute", right: 0, top: "52px", width: "320px", background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "16px", zIndex: 1000, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                        <span style={{ fontWeight: 700, fontSize: "15px" }}>Уведомления</span>
                                        <button onClick={markAllRead} style={{ background: "transparent", border: "none", color: "#f5c518", cursor: "pointer", fontSize: "12px", fontFamily: "'Space Grotesk', sans-serif" }}>Прочитать все</button>
                                    </div>
                                    {notifications.map(n => (
                                        <div key={n.id} style={{ padding: "12px", borderRadius: "10px", marginBottom: "8px", background: n.read ? "transparent" : "rgba(245,197,24,0.05)", border: n.read ? "1px solid transparent" : "1px solid rgba(245,197,24,0.15)", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                            <span style={{ fontSize: "16px" }}>{n.type === "success" ? "✅" : n.type === "warning" ? "⚠️" : "ℹ️"}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: "13px", fontWeight: n.read ? 400 : 600 }}>{n.text}</div>
                                                <div style={{ fontSize: "11px", color: "#444", marginTop: "4px" }}>{n.time} назад</div>
                                            </div>
                                            {!n.read && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f5c518", flexShrink: 0, marginTop: "4px" }} />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #f5c518, #ff8c00)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#000" }}>B</div>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                    {[
                        { label: "Водителей", value: "47", trend: "+3", icon: "👨‍✈️", color: "#f5c518" },
                        { label: "Машин онлайн", value: "38", trend: "из 52", icon: "🚗", color: "#00d4aa" },
                        { label: "Заказов сегодня", value: "284", trend: "+12%", icon: "📋", color: "#a78bfa" },
                        { label: "Выручка", value: "84 200₽", trend: "+8%", icon: "💰", color: "#f472b6" },
                    ].map((s, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px", transition: "all 0.3s", cursor: "default" }}
                            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${s.color}40`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                                <span style={{ color: "#444", fontSize: "14px" }}>{s.label}</span>
                                <span style={{ fontSize: "20px" }}>{s.icon}</span>
                            </div>
                            <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ color: "#4ade80", fontSize: "13px", marginTop: "8px" }}>↑ {s.trend}</div>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Выручка за неделю</h3>
                        <div style={{ display: "flex", gap: "8px" }}>
                            {["bar", "line"].map(type => (
                                <button key={type} onClick={() => setChartType(type)} style={{ background: chartType === type ? "rgba(245,197,24,0.2)" : "transparent", color: chartType === type ? "#f5c518" : "#555", border: chartType === type ? "1px solid rgba(245,197,24,0.4)" : "1px solid rgba(255,255,255,0.1)", padding: "6px 16px", borderRadius: "50px", cursor: "pointer", fontSize: "13px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}>
                                    {type === "bar" ? "📊 Бар" : "📈 Линия"}
                                </button>
                            ))}
                        </div>
                    </div>
                    {chartType === "bar"
                        ? <Bar data={weekData} options={chartOptions} height={80} />
                        : <Line data={weekData} options={chartOptions} height={80} />
                    }
                </div>

                {/* Drivers table with search */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700 }}>
                            Топ водители {search && <span style={{ color: "#f5c518", fontSize: "14px" }}>({filteredDrivers.length} найдено)</span>}
                        </h3>
                        <button onClick={() => navigate("/drivers")} style={{ background: "rgba(245,197,24,0.1)", color: "#f5c518", border: "none", padding: "8px 16px", borderRadius: "50px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
                            Все водители →
                        </button>
                    </div>

                    {filteredDrivers.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#444" }}>
                            🔍 Водитель не найден
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "12px", marginBottom: "8px" }}>
                                {["Водитель", "Машина", "Заказов", "Выручка", "Статус"].map(h => (
                                    <span key={h} style={{ fontSize: "12px", color: "#444", fontWeight: 600 }}>{h}</span>
                                ))}
                            </div>
                            {filteredDrivers.map((d, i) => (
                                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "0", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", alignItems: "center", transition: "background 0.2s", borderRadius: "8px", cursor: "default" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(245,197,24,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#f5c518" }}>{d.name[0]}</div>
                                        <span style={{ fontSize: "14px", fontWeight: 600 }}>{d.name}</span>
                                    </div>
                                    <span style={{ fontSize: "13px", color: "#555" }}>{d.car}</span>
                                    <span style={{ fontSize: "14px" }}>{d.orders}</span>
                                    <span style={{ fontSize: "14px", color: "#4ade80" }}>{d.revenue}</span>
                                    <span style={{ fontSize: "13px", color: statusColor(d.status), fontWeight: 600 }}>● {d.status}</span>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}