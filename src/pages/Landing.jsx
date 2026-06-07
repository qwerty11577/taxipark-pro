import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV = ["Функции", "Цены", "О нас", "Контакты"];

const FEATURES = [
    { icon: "👨‍✈️", title: "Водители", desc: "Полные профили, документы, смены, рейтинги и история каждого водителя в одном месте.", color: "#f5c518" },
    { icon: "🚗", title: "Автопарк", desc: "Контроль техосмотров, страховок, ремонтов и пробега каждого автомобиля.", color: "#ff6b35" },
    { icon: "📋", title: "Заказы", desc: "Приём, распределение и контроль заказов в режиме реального времени.", color: "#00d4aa" },
    { icon: "💰", title: "Финансы", desc: "Доходы, расходы, зарплаты водителей и подробные Excel-отчёты.", color: "#a78bfa" },
    { icon: "📊", title: "Аналитика", desc: "Интерактивные графики, KPI и статистика для принятия умных решений.", color: "#f472b6" },
    { icon: "📱", title: "Telegram", desc: "Мгновенные уведомления и управление таксопарком прямо в мессенджере.", color: "#38bdf8" },
];

const PLANS = [
    { name: "Старт", price: "2 990", period: "мес", sub: "Идеально для малого парка", features: ["До 10 водителей", "Управление водителями", "Базовая аналитика", "Telegram уведомления", "Email поддержка"] },
    { name: "Бизнес", price: "7 990", period: "мес", sub: "Самый популярный выбор", popular: true, features: ["До 50 водителей", "Всё из тарифа Старт", "Excel отчёты", "Расширенная аналитика", "Приоритетная поддержка", "API доступ"] },
    { name: "Корпорат", price: "19 990", period: "мес", sub: "Для крупных таксопарков", features: ["Без ограничений", "Всё из тарифа Бизнес", "Персональный менеджер", "Кастомизация системы", "SLA гарантия", "Обучение команды"] },
];

const STATS = [
    { value: 500, suffix: "+", label: "Таксопарков" },
    { value: 10000, suffix: "+", label: "Водителей" },
    { value: 1, suffix: "M+", label: "Заказов в месяц" },
    { value: 99.9, suffix: "%", label: "Время работы", decimal: true },
];

function useCountUp(target, duration = 2000, decimal = false) {
    const [count, setCount] = useState(0);
    const ref = useRef(false);
    useEffect(() => {
        if (ref.current) return;
        ref.current = true;
        const steps = 60;
        const step = duration / steps;
        let i = 0;
        const timer = setInterval(() => {
            i++;
            const val = decimal ? parseFloat(((target * i) / steps).toFixed(1)) : Math.floor((target * i) / steps);
            setCount(val);
            if (i >= steps) { setCount(target); clearInterval(timer); }
        }, step);
        return () => clearInterval(timer);
    }, [target, duration, decimal]);
    return count;
}

function StatCard({ value, suffix, label, decimal }) {
    const count = useCountUp(value, 2000, decimal);
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, background: "linear-gradient(135deg, #f5c518, #ff8c00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {decimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
            </div>
            <div style={{ color: "#555", marginTop: "8px", fontSize: "16px" }}>{label}</div>
        </div>
    );
}

export default function Landing() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [activeFeature, setActiveFeature] = useState(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('visible');
            }),
            { threshold: 0.15 }
        );
        reveals.forEach(r => observer.observe(r));
        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#050508", color: "#fff", minHeight: "100vh" }}>

            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
                <div className="orb-1" style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)", top: "-100px", left: "-100px" }} />
                <div className="orb-2" style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)", bottom: "100px", right: "-100px" }} />
                <div className="orb-3" style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
            </div>

            <header style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                padding: "0 48px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "all 0.3s",
                background: scrolled ? "rgba(5,5,8,0.95)" : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(245,197,24,0.15)" : "1px solid transparent",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🚗</div>
                    <span style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>TaxiPark <span style={{ color: "#f5c518" }}>Pro</span></span>
                </div>
                <nav style={{ display: "flex", gap: "36px" }}>
                    {NAV.map(n => (
                        <a key={n} href="#" style={{ color: "#666", textDecoration: "none", fontSize: "15px", fontWeight: 500, transition: "color 0.2s" }}
                            onMouseEnter={e => e.target.style.color = "#fff"}
                            onMouseLeave={e => e.target.style.color = "#666"}>{n}</a>
                    ))}
                </nav>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button className="btn-hover" onClick={() => navigate("/login")} style={{ background: "transparent", color: "#aaa", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 24px", borderRadius: "50px", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>Войти</button>
                    <button className="glow-btn btn-hover" onClick={() => navigate("/login")} style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", padding: "10px 24px", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "14px" }}>
                        Попробовать →
                    </button>
                </div>
            </header>

            <section style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 48px 80px" }}>
                <div className="fade-up-1" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.25)", borderRadius: "50px", padding: "8px 20px", marginBottom: "32px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px #4ade80" }} />
                    <span style={{ fontSize: "14px", color: "#f5c518", fontWeight: 500 }}>Новая версия 2.0 уже доступна</span>
                </div>

                <h1 className="fade-up-2 shimmer-text" style={{ fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 24px", maxWidth: "1000px" }}>
                    Управление таксопарком<br />нового поколения
                </h1>

                <p className="fade-up-3" style={{ fontSize: "20px", color: "#555", maxWidth: "580px", lineHeight: 1.7, margin: "0 0 48px" }}>
                    Водители, автопарк, заказы и финансы — всё в одной умной системе. Экономьте часы каждый день.
                </p>

                <div className="fade-up-4" style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                    <button className="glow-btn btn-hover" onClick={() => navigate("/login")} style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", padding: "18px 48px", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "17px" }}>
                        Начать бесплатно →
                    </button>
                    <button className="btn-hover" onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 48px", borderRadius: "50px", cursor: "pointer", fontSize: "17px", fontWeight: 500, display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(245,197,24,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>▶</span>
                        Смотреть демо
                    </button>
                </div>

                <div className="float fade-up-5" style={{ marginTop: "80px", width: "100%", maxWidth: "900px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: "28px", boxShadow: "0 0 100px rgba(245,197,24,0.08)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => <div key={i} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />)}
                        <div style={{ flex: 1, height: "28px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginLeft: "8px", display: "flex", alignItems: "center", paddingLeft: "12px" }}>
                            <span style={{ color: "#333", fontSize: "12px" }}>taxipark.pro/dashboard</span>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
                        {[
                            { l: "Водителей", v: "47", t: "+3 сегодня", c: "#f5c518" },
                            { l: "Машин онлайн", v: "38", t: "из 52", c: "#00d4aa" },
                            { l: "Заказов", v: "284", t: "+12% к вчера", c: "#a78bfa" },
                            { l: "Выручка", v: "84 200₽", t: "+8% к вчера", c: "#f472b6" },
                        ].map((s, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "14px", padding: "16px", border: "1px solid rgba(255,255,255,0.04)" }}>
                                <div style={{ color: "#444", fontSize: "12px", marginBottom: "8px" }}>{s.l}</div>
                                <div style={{ fontSize: "22px", fontWeight: 700, color: s.c }}>{s.v}</div>
                                <div style={{ color: "#4ade80", fontSize: "12px", marginTop: "4px" }}>{s.t}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "14px", padding: "20px", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                            <span style={{ color: "#444", fontSize: "13px" }}>Выручка за неделю</span>
                            <span style={{ color: "#f5c518", fontSize: "13px", fontWeight: 600 }}>84 200 ₽</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "100px" }}>
                            {[35, 55, 42, 78, 62, 100, 72].map((h, i) => (
                                <div key={i} style={{ flex: 1 }}>
                                    <div style={{ width: "100%", height: `${h}%`, background: i === 5 ? "linear-gradient(to top, #f5c518, #ff8c00)" : "rgba(245,197,24,0.15)", borderRadius: "6px 6px 0 0" }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", marginTop: "8px" }}>
                            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(d => (
                                <span key={d} style={{ flex: 1, textAlign: "center", color: "#333", fontSize: "12px" }}>{d}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="reveal" style={{ position: "relative", zIndex: 1, padding: "80px 48px", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "80px", flexWrap: "wrap", maxWidth: "1000px", margin: "0 auto" }}>
                    {STATS.map((s, i) => <StatCard key={i} {...s} />)}
                </div>
            </section>

            <section style={{ position: "relative", zIndex: 1, padding: "120px 48px", maxWidth: "1200px", margin: "0 auto" }}>
                <div className="reveal" style={{ textAlign: "center", marginBottom: "80px" }}>
                    <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "16px" }}>
                        Всё для успешного<br /><span style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>таксопарка</span>
                    </h2>
                    <p style={{ color: "#444", fontSize: "18px" }}>Мощные инструменты в одной платформе</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                    {FEATURES.map((f, i) => (
                        <div key={i} className="reveal card-hover"
                            onMouseEnter={() => setActiveFeature(i)}
                            onMouseLeave={() => setActiveFeature(null)}
                            style={{ background: activeFeature === i ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)", border: activeFeature === i ? `1px solid ${f.color}40` : "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "36px", transition: "all 0.3s", cursor: "default" }}>
                            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${f.color}15`, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", marginBottom: "20px" }}>{f.icon}</div>
                            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px", color: activeFeature === i ? f.color : "#fff", transition: "color 0.3s" }}>{f.title}</h3>
                            <p style={{ color: "#444", lineHeight: 1.7, fontSize: "15px" }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ position: "relative", zIndex: 1, padding: "120px 48px", background: "rgba(255,255,255,0.01)" }}>
                <div className="reveal" style={{ textAlign: "center", marginBottom: "80px" }}>
                    <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "16px" }}>
                        Простые <span style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>цены</span>
                    </h2>
                    <p style={{ color: "#444", fontSize: "18px" }}>14 дней бесплатно на любом тарифе</p>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "20px", maxWidth: "1100px", margin: "0 auto", flexWrap: "wrap", alignItems: "flex-start" }}>
                    {PLANS.map((plan, i) => (
                        <div key={i} className="reveal card-hover" style={{ flex: "1", minWidth: "300px", maxWidth: "360px", background: plan.popular ? "linear-gradient(135deg, #1a1400, #2a1f00)" : "rgba(255,255,255,0.02)", border: plan.popular ? "1px solid rgba(245,197,24,0.4)" : "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: "40px", position: "relative", transform: plan.popular ? "scale(1.04)" : "scale(1)", boxShadow: plan.popular ? "0 0 60px rgba(245,197,24,0.15)" : "none" }}>
                            {plan.popular && <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", padding: "6px 24px", borderRadius: "50px", fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>⭐ Популярный</div>}
                            <div style={{ fontSize: "18px", fontWeight: 700, color: plan.popular ? "#f5c518" : "#fff", marginBottom: "8px" }}>{plan.name}</div>
                            <div style={{ color: "#444", fontSize: "14px", marginBottom: "24px" }}>{plan.sub}</div>
                            <div style={{ marginBottom: "32px" }}>
                                <span style={{ fontSize: "52px", fontWeight: 800, color: plan.popular ? "#f5c518" : "#fff", letterSpacing: "-2px" }}>{plan.price}</span>
                                <span style={{ color: "#444", fontSize: "16px" }}> ₽/{plan.period}</span>
                            </div>
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", marginBottom: "32px" }}>
                                {plan.features.map((f, j) => (
                                    <div key={j} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", fontSize: "15px", color: "#aaa" }}>
                                        <span style={{ color: plan.popular ? "#f5c518" : "#00d4aa" }}>✓</span>{f}
                                    </div>
                                ))}
                            </div>
                            <button className="btn-hover" onClick={() => navigate("/login")} style={{ width: "100%", padding: "16px", background: plan.popular ? "linear-gradient(135deg, #f5c518, #ff8c00)" : "rgba(255,255,255,0.05)", color: plan.popular ? "#000" : "#fff", border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "16px", fontFamily: "'Space Grotesk', sans-serif" }}>
                                {plan.popular ? "Выбрать план →" : "Начать бесплатно"}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="reveal" style={{ position: "relative", zIndex: 1, padding: "120px 48px", textAlign: "center" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "24px" }}>
                        Готовы вывести<br />
                        <span style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>бизнес на новый уровень?</span>
                    </h2>
                    <p style={{ color: "#444", fontSize: "20px", marginBottom: "48px" }}>14 дней бесплатно. Без карты. Без обязательств.</p>
                    <button className="glow-btn btn-hover" onClick={() => navigate("/login")} style={{ background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", padding: "22px 64px", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "20px", fontFamily: "'Space Grotesk', sans-serif" }}>
                        Начать бесплатно →
                    </button>
                    <div style={{ marginTop: "32px", display: "flex", gap: "32px", justifyContent: "center", color: "#333", fontSize: "14px" }}>
                        {["✓ Без кредитной карты", "✓ Настройка за 5 минут", "✓ Поддержка 24/7"].map(t => <span key={t}>{t}</span>)}
                    </div>
                </div>
            </section>

            <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.04)", padding: "48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🚗</div>
                    <span style={{ fontWeight: 700, color: "#333" }}>TaxiPark Pro</span>
                </div>
                <div style={{ color: "#333", fontSize: "14px" }}>© 2026 TaxiPark Pro. Все права защищены.</div>
                <div style={{ display: "flex", gap: "24px" }}>
                    {["Политика", "Условия", "Контакты"].map(t => (
                        <a key={t} href="#" style={{ color: "#333", textDecoration: "none", fontSize: "14px" }}>{t}</a>
                    ))}
                </div>
            </footer>

        </div>
    );
}