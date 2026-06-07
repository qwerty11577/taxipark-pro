import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
    const [loading, setLoading] = useState(false);

    const handleRegister = () => {
        if (!form.name || !form.email || !form.password) {
            alert("Заполните все поля!");
            return;
        }
        if (form.password !== form.confirm) {
            alert("Пароли не совпадают!");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/dashboard");
        }, 1500);
    };

    return (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#050508", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>

            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <div className="orb-1" style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)", top: "-100px", left: "-100px" }} />
                <div className="orb-2" style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)", bottom: "-100px", right: "-100px" }} />
            </div>

            <div className="fade-up" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "480px", padding: "0 24px" }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 16px" }}>🚗</div>
                    <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>TaxiPark <span style={{ color: "#f5c518" }}>Pro</span></h1>
                    <p style={{ color: "#444", marginTop: "8px", fontSize: "15px" }}>Создайте аккаунт бесплатно</p>
                </div>

                {/* Card */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "40px" }}>

                    {[
                        { label: "Имя и фамилия", key: "name", placeholder: "Бобур Марипов", type: "text" },
                        { label: "Email", key: "email", placeholder: "example@taxipark.ru", type: "email" },
                        { label: "Телефон", key: "phone", placeholder: "+7 999 123 45 67", type: "tel" },
                        { label: "Пароль", key: "password", placeholder: "••••••••", type: "password" },
                        { label: "Повторите пароль", key: "confirm", placeholder: "••••••••", type: "password" },
                    ].map(f => (
                        <div key={f.key} style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "8px", fontWeight: 500 }}>{f.label}</label>
                            <input
                                type={f.type}
                                placeholder={f.placeholder}
                                value={form[f.key]}
                                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px 16px", color: "#fff", fontSize: "15px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box", transition: "border 0.2s" }}
                                onFocus={e => e.target.style.border = "1px solid rgba(245,197,24,0.5)"}
                                onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
                            />
                        </div>
                    ))}

                    <button
                        className="glow-btn btn-hover"
                        onClick={handleRegister}
                        style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "16px", fontFamily: "'Space Grotesk', sans-serif", marginTop: "8px" }}>
                        {loading ? "Создаём аккаунт..." : "Зарегистрироваться →"}
                    </button>

                    <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#444" }}>
                        Уже есть аккаунт?{" "}
                        <span onClick={() => navigate("/login")} style={{ color: "#f5c518", cursor: "pointer", fontWeight: 600 }}>Войти</span>
                    </div>
                </div>

                <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <button onClick={() => navigate("/")} style={{ background: "transparent", border: "none", color: "#444", cursor: "pointer", fontSize: "14px", fontFamily: "'Space Grotesk', sans-serif" }}>
                        ← Вернуться на главную
                    </button>
                </div>
            </div>
        </div>
    );
}