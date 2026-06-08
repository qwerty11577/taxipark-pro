import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMe } from "../api";

const SIDEBAR = [
    { icon: "📊", label: "Dashboard", path: "/dashboard" },
    { icon: "👨‍✈️", label: "Водители", path: "/drivers" },
    { icon: "🚗", label: "Автопарк", path: "/cars" },
    { icon: "📋", label: "Заказы", path: "/orders" },
    { icon: "💰", label: "Финансы", path: "/finance" },
    { icon: "⚙️", label: "Настройки", path: "/settings", active: true },
];

export default function Settings() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [profile, setProfile] = useState({ name: "", email: "", phone: "", company: "" });
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState({ newOrder: true, driverOnline: true, payment: true, report: false });

    useEffect(() => {
        getMe().then(user => {
            setProfile({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                company: user.company || "TaxiPark Pro",
            });
            setLoading(false);
        }).catch(() => navigate("/login"));
    }, []);

    const saveProfile = () => {
        toast.success("✅ Профиль сохранён!");
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
                    <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", background: "transparent", color: "#555", width: "100%", whiteSpace: "nowrap" }}>
                        <span style={{ flexShrink: 0 }}>🚪</span>
                        {!sidebarCollapsed && "Выйти"}
                    </button>
                </div>
            </div>

            {/* Main */}
            <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>Настройки</h1>
                    <p style={{ color: "#444", marginTop: "4px" }}>Управление профилем и уведомлениями</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "900px" }}>

                    {/* Profile */}
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>👤 Профиль</h3>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #f5c518, #ff8c00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 700, color: "#000" }}>
                                {profile.name?.[0] || "U"}
                            </div>
                            <div>
                                <div style={{ fontSize: "16px", fontWeight: 700 }}>{loading ? "Загрузка..." : profile.name}</div>
                                <div style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>Администратор</div>
                            </div>
                        </div>

                        {[
                            { label: "Имя и фамилия", key: "name" },
                            { label: "Email", key: "email" },
                            { label: "Телефон", key: "phone" },
                            { label: "Компания", key: "company" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontWeight: 500 }}>{f.label}</label>
                                <input
                                    value={profile[f.key]}
                                    onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box" }}
                                    onFocus={e => e.target.style.border = "1px solid rgba(245,197,24,0.5)"}
                                    onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
                                />
                            </div>
                        ))}

                        <button onClick={saveProfile} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif", marginTop: "8px" }}>
                            Сохранить →
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                        {/* Notifications */}
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>🔔 Уведомления</h3>
                            {[
                                { key: "newOrder", label: "Новый заказ", desc: "Уведомление при поступлении заказа" },
                                { key: "driverOnline", label: "Водитель онлайн", desc: "Когда водитель выходит на смену" },
                                { key: "payment", label: "Оплата", desc: "Подтверждение платежей" },
                                { key: "report", label: "Ежедневный отчёт", desc: "Итоги дня в 22:00" },
                            ].map(n => (
                                <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: 600 }}>{n.label}</div>
                                        <div style={{ fontSize: "12px", color: "#444", marginTop: "2px" }}>{n.desc}</div>
                                    </div>
                                    <button onClick={() => { setNotifications({ ...notifications, [n.key]: !notifications[n.key] }); toast.info(`${n.label} ${!notifications[n.key] ? "включено" : "выключено"}`); }}
                                        style={{ width: "48px", height: "26px", borderRadius: "50px", border: "none", cursor: "pointer", background: notifications[n.key] ? "linear-gradient(135deg, #f5c518, #ff8c00)" : "rgba(255,255,255,0.1)", position: "relative", transition: "all 0.3s", flexShrink: 0 }}>
                                        <div style={{ position: "absolute", top: "3px", left: notifications[n.key] ? "25px" : "3px", width: "20px", height: "20px", borderRadius: "50%", background: "#fff", transition: "left 0.3s" }} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Security */}
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>🔒 Безопасность</h3>
                            {[
                                { icon: "🔑", label: "Изменить пароль", color: "#a78bfa" },
                                { icon: "📱", label: "Двухфакторная аутентификация", color: "#00d4aa" },
                                { icon: "🚪", label: "Выйти из всех устройств", color: "#ff5050" },
                            ].map((item, i) => (
                                <button key={i} onClick={() => toast.info(`${item.label}...`)}
                                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", cursor: "pointer", marginBottom: "8px", fontFamily: "'Space Grotesk', sans-serif", color: "#fff", fontSize: "14px", fontWeight: 500, transition: "all 0.2s", textAlign: "left" }}
                                    onMouseEnter={e => { e.currentTarget.style.background = `${item.color}10`; e.currentTarget.style.borderColor = `${item.color}30`; e.currentTarget.style.color = item.color; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}>
                                    <span style={{ fontSize: "20px" }}>{item.icon}</span>
                                    {item.label}
                                    <span style={{ marginLeft: "auto", color: "#444" }}>→</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Plan */}
                <div style={{ maxWidth: "900px", marginTop: "24px", background: "linear-gradient(135deg, #1a1400, #2a1f00)", border: "1px solid rgba(245,197,24,0.3)", borderRadius: "20px", padding: "28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ fontSize: "13px", color: "#f5c518", marginBottom: "4px", fontWeight: 600 }}>⭐ ТЕКУЩИЙ ПЛАН</div>
                        <div style={{ fontSize: "24px", fontWeight: 800 }}>Бизнес</div>
                        <div style={{ color: "#444", fontSize: "14px", marginTop: "4px" }}>До 50 водителей • 7 990 ₽/мес</div>
                    </div>
                    <button onClick={() => toast.info("Переход на тариф...")} style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", padding: "14px 28px", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>
                        Улучшить план →
                    </button>
                </div>
            </div>
        </div>
    );
}