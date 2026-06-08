import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { getDrivers, getCars, getOrders, getMe } from "../api";

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
    { id: 1, text: "Система запущена успешно", time: "Сейчас", type: "success", read: false },
    { id: 2, text: "Добавьте первого водителя", time: "1 мин", type: "info", read: false },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [cars, setCars] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotif, setShowNotif] = useState(false);
    const [notifications, setNotifications] = useState(NOTIFICATIONS);
    const [chartType, setChartType] = useState("bar");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [userData, driversData, carsData, ordersData] = await Promise.all([
                getMe(),
                getDrivers(),
                getCars(),
                getOrders(),
            ]);
            setUser(userData);
            setDrivers(driversData);
            setCars(carsData);
            setOrders(ordersData);
        } catch (err) {
            toast.error("Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = orders.filter(o => o.status === "Завершён").reduce((s, o) => s + o.price, 0);
    const onlineDrivers = drivers.filter(d => d.status === "Онлайн").length;
    const onlineCars = cars.filter(c => c.status === "Онлайн").length;
    const completedOrders = orders.filter(o => o.status === "Завершён").length;

    const weekData = {
        labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
        datasets: [{
            label: "Выручка (₽)",
            data: [0, 0, 0, 0, 0, totalRevenue, 0],
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
            tooltip: { backgroundColor: "#1a1a2e", titleColor: "#f5c518", bodyColor: "#fff", borderColor: "rgba(245,197,24,0.3)", borderWidth: 1 }
        },
        scales: {
            x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#555" } },
            y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#555", callback: v => `${(v / 1000).toFixed(0)}K` } }
        }
    };

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
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: "transparent", border: "none", color: "#444", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}>
                        {sidebarCollapsed ? "→" : "←"}
                    </button>
                </div>
                {SIDEBAR.map((item, i) => (
                    <button key={i} onClick={() => navigate(item.path)}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", marginBottom: "4px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 500, background: item.active ? "rgba(245,197,24,0.1)" : "transparent", color: item.active ? "#f5c518" : "#555", textAlign: "left", width: "100%", transition: "all 0.2s", whiteSpace: "nowrap" }}
                        onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#fff"; } }}
                        onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; } }}>
                        <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                        {!sidebarCollapsed && item.label}
                    </button>
                ))}
                <div style={{ marginTop: "auto" }}>
                    <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", background: "transparent", color: "#555", width: "100%", whiteSpace: "nowrap" }}>
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
                        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                            {loading ? "Загрузка..." : `Привет, ${user?.name?.split(" ")[0] || ""}! 👋`}
                        </h1>
                        <p style={{ color: "#444", marginTop: "4px" }}>{new Date().toLocaleDateString("ru", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ position: "relative" }}>
                            <button onClick={() => setShowNotif(!showNotif)} style={{ position: "relative", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: "44px", height: "44px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                🔔
                                {unreadCount > 0 && <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "18px", height: "18px", background: "#ff4757", borderRadius: "50%", fontSize: "11px", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>}
                            </button>
                            {showNotif && (
                                <div style={{ position: "absolute", right: 0, top: "52px", width: "300px", background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "16px", zIndex: 1000 }}>
                                    <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "12px" }}>Уведомления</div>
                                    {notifications.map(n => (
                                        <div key={n.id} style={{ padding: "10px", borderRadius: "10px", marginBottom: "8px", background: n.read ? "transparent" : "rgba(245,197,24,0.05)", border: n.read ? "1px solid transparent" : "1px solid rgba(245,197,24,0.15)" }}>
                                            <div style={{ fontSize: "13px" }}>{n.text}</div>
                                            <div style={{ fontSize: "11px", color: "#444", marginTop: "4px" }}>{n.time}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #f5c518, #ff8c00)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#000", fontSize: "16px" }}>
                            {user?.name?.[0] || "U"}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                    {[
                        { label: "Водителей", value: loading ? "..." : drivers.length, trend: `${onlineDrivers} онлайн`, icon: "👨‍✈️", color: "#f5c518" },
                        { label: "Машин", value: loading ? "..." : cars.length, trend: `${onlineCars} онлайн`, icon: "🚗", color: "#00d4aa" },
                        { label: "Заказов", value: loading ? "..." : orders.length, trend: `${completedOrders} завершён`, icon: "📋", color: "#a78bfa" },
                        { label: "Выручка", value: loading ? "..." : totalRevenue.toLocaleString() + "₽", trend: "всего", icon: "💰", color: "#f472b6" },
                    ].map((s, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px", transition: "all 0.3s" }}
                            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${s.color}40`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                                <span style={{ color: "#444", fontSize: "14px" }}>{s.label}</span>
                                <span style={{ fontSize: "20px" }}>{s.icon}</span>
                            </div>
                            <div style={{ fontSize: "32px", fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ color: "#4ade80", fontSize: "13px", marginTop: "8px" }}>{s.trend}</div>
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
                    {chartType === "bar" ? <Bar data={weekData} options={chartOptions} height={80} /> : <Line data={weekData} options={chartOptions} height={80} />}
                </div>

                {/* Recent orders */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Последние заказы</h3>
                        <button onClick={() => navigate("/orders")} style={{ background: "rgba(245,197,24,0.1)", color: "#f5c518", border: "none", padding: "8px 16px", borderRadius: "50px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
                            Все заказы →
                        </button>
                    </div>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#444" }}>⏳ Загрузка...</div>
                    ) : orders.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#444" }}>
                            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
                            <div>Заказов пока нет</div>
                            <button onClick={() => navigate("/orders")} style={{ marginTop: "16px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", padding: "10px 24px", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                                Создать заказ →
                            </button>
                        </div>
                    ) : (
                        orders.slice(0, 5).map(order => (
                            <div key={order.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: order.status === "Завершён" ? "rgba(74,222,128,0.1)" : order.status === "В пути" ? "rgba(245,197,24,0.1)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                                    {order.status === "Завершён" ? "✅" : order.status === "В пути" ? "🚗" : "⏳"}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{order.client}</div>
                                    <div style={{ fontSize: "12px", color: "#444" }}>{order.from_address} → {order.to_address}</div>
                                </div>
                                <div style={{ fontSize: "16px", fontWeight: 700, color: "#4ade80" }}>{order.price}₽</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}