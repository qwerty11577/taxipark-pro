import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const SIDEBAR = [
    { icon: "📊", label: "Dashboard", path: "/dashboard" },
    { icon: "👨‍✈️", label: "Водители", path: "/drivers" },
    { icon: "🚗", label: "Автопарк", path: "/cars" },
    { icon: "📋", label: "Заказы", path: "/orders" },
    { icon: "💰", label: "Финансы", path: "/finance", active: true },
    { icon: "⚙️", label: "Настройки", path: "/settings" },
];

const INITIAL_TRANSACTIONS = [
    { id: 1, type: "income", desc: "Выручка за день", amount: 84200, category: "Заказы", date: "07.06.2026" },
    { id: 2, type: "expense", desc: "Топливо", amount: 12400, category: "Расходы", date: "07.06.2026" },
    { id: 3, type: "expense", desc: "Зарплата водителей", amount: 35000, category: "Зарплата", date: "06.06.2026" },
    { id: 4, type: "income", desc: "Выручка за день", amount: 76500, category: "Заказы", date: "06.06.2026" },
    { id: 5, type: "expense", desc: "Ремонт Toyota Camry", amount: 8500, category: "Ремонт", date: "05.06.2026" },
    { id: 6, type: "income", desc: "Выручка за день", amount: 91200, category: "Заказы", date: "05.06.2026" },
    { id: 7, type: "expense", desc: "Страховка", amount: 15000, category: "Страховка", date: "04.06.2026" },
    { id: 8, type: "income", desc: "Выручка за день", amount: 68900, category: "Заказы", date: "04.06.2026" },
];

export default function Finance() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
    const [showModal, setShowModal] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [filter, setFilter] = useState("Все");
    const [form, setForm] = useState({ type: "income", desc: "", amount: "", category: "" });

    const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const profit = totalIncome - totalExpense;

    const filtered = transactions.filter(t =>
        filter === "Все" || (filter === "Доходы" ? t.type === "income" : t.type === "expense")
    );

    const barData = {
        labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
        datasets: [
            { label: "Доходы", data: [68900, 76500, 91200, 84200, 72000, 95000, 84200], backgroundColor: "rgba(74,222,128,0.7)", borderRadius: 8 },
            { label: "Расходы", data: [23000, 35000, 8500, 47400, 18000, 12000, 47400], backgroundColor: "rgba(255,80,80,0.7)", borderRadius: 8 },
        ]
    };

    const doughnutData = {
        labels: ["Заказы", "Зарплата", "Топливо", "Ремонт", "Страховка"],
        datasets: [{
            data: [320800, 35000, 12400, 8500, 15000],
            backgroundColor: ["#f5c518", "#a78bfa", "#00d4aa", "#ff6b35", "#f472b6"],
            borderWidth: 0,
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: "#666", font: { family: "'Space Grotesk'" } } },
            tooltip: { backgroundColor: "#0f0f1a", titleColor: "#f5c518", bodyColor: "#fff" }
        },
        scales: {
            x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#555" } },
            y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#555", callback: v => `${(v / 1000).toFixed(0)}K` } }
        }
    };

    const addTransaction = () => {
        if (!form.desc || !form.amount || !form.category) {
            toast.error("Заполните все поля!");
            return;
        }
        const newT = {
            id: Date.now(),
            type: form.type,
            desc: form.desc,
            amount: parseInt(form.amount),
            category: form.category,
            date: new Date().toLocaleDateString("ru"),
        };
        setTransactions([newT, ...transactions]);
        setForm({ type: "income", desc: "", amount: "", category: "" });
        setShowModal(false);
        toast.success(`✅ ${form.type === "income" ? "Доход" : "Расход"} добавлен!`);
    };

    return (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#050508", color: "#fff", minHeight: "100vh", display: "flex" }}>
            <ToastContainer theme="dark" />

            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                    <div style={{ background: "#0f0f1a", border: "1px solid rgba(245,197,24,0.2)", borderRadius: "24px", padding: "40px", maxWidth: "480px", width: "90%" }}>
                        <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}>💰 Добавить транзакцию</h3>
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontWeight: 500 }}>Тип</label>
                            <div style={{ display: "flex", gap: "8px" }}>
                                {[{ v: "income", l: "💚 Доход" }, { v: "expense", l: "🔴 Расход" }].map(t => (
                                    <button key={t.v} onClick={() => setForm({ ...form, type: t.v })}
                                        style={{ flex: 1, padding: "12px", background: form.type === t.v ? (t.v === "income" ? "rgba(74,222,128,0.1)" : "rgba(255,80,80,0.1)") : "rgba(255,255,255,0.03)", color: form.type === t.v ? (t.v === "income" ? "#4ade80" : "#ff5050") : "#555", border: `1px solid ${form.type === t.v ? (t.v === "income" ? "rgba(74,222,128,0.3)" : "rgba(255,80,80,0.3)") : "rgba(255,255,255,0.1)"}`, borderRadius: "12px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "14px" }}>
                                        {t.l}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {[
                            { label: "Описание", key: "desc", placeholder: "Выручка за день" },
                            { label: "Сумма (₽)", key: "amount", placeholder: "50000" },
                            { label: "Категория", key: "category", placeholder: "Заказы" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontWeight: 500 }}>{f.label}</label>
                                <input placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box" }}
                                    onFocus={e => e.target.style.border = "1px solid rgba(245,197,24,0.5)"}
                                    onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"} />
                            </div>
                        ))}
                        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>Отмена</button>
                            <button onClick={addTransaction} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", borderRadius: "50px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>Добавить →</button>
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
                    <button key={i} onClick={() => navigate(item.path)}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", marginBottom: "4px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 500, background: item.active ? "rgba(245,197,24,0.1)" : "transparent", color: item.active ? "#f5c518" : "#555", textAlign: "left", width: "100%", transition: "all 0.2s", whiteSpace: "nowrap" }}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <div>
                        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>Финансы</h1>
                        <p style={{ color: "#444", marginTop: "4px" }}>Июнь 2026</p>
                    </div>
                    <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", padding: "12px 24px", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>+ Добавить</button>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
                    {[
                        { label: "Общий доход", value: totalIncome.toLocaleString() + " ₽", color: "#4ade80", icon: "💚" },
                        { label: "Общий расход", value: totalExpense.toLocaleString() + " ₽", color: "#ff5050", icon: "🔴" },
                        { label: "Чистая прибыль", value: profit.toLocaleString() + " ₽", color: profit >= 0 ? "#f5c518" : "#ff5050", icon: "💰" },
                    ].map((s, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                <span style={{ color: "#444", fontSize: "14px" }}>{s.label}</span>
                                <span style={{ fontSize: "20px" }}>{s.icon}</span>
                            </div>
                            <div style={{ fontSize: "32px", fontWeight: 800, color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>Доходы и расходы за неделю</h3>
                        <Bar data={barData} options={chartOptions} height={120} />
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>Распределение</h3>
                        <Doughnut data={doughnutData} options={{ plugins: { legend: { position: "bottom", labels: { color: "#666", font: { family: "'Space Grotesk'" }, padding: 12 } } } }} />
                    </div>
                </div>

                {/* Transactions */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Транзакции</h3>
                        <div style={{ display: "flex", gap: "8px" }}>
                            {["Все", "Доходы", "Расходы"].map(f => (
                                <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: "50px", border: filter === f ? "1px solid rgba(245,197,24,0.4)" : "1px solid rgba(255,255,255,0.1)", background: filter === f ? "rgba(245,197,24,0.1)" : "transparent", color: filter === f ? "#f5c518" : "#555", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 500 }}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    {filtered.map(t => (
                        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "all 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"}
                            onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: t.type === "income" ? "rgba(74,222,128,0.1)" : "rgba(255,80,80,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                                {t.type === "income" ? "💚" : "🔴"}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "15px", fontWeight: 600 }}>{t.desc}</div>
                                <div style={{ fontSize: "12px", color: "#444", marginTop: "2px" }}>{t.category} • {t.date}</div>
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: 800, color: t.type === "income" ? "#4ade80" : "#ff5050" }}>
                                {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString()} ₽
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}