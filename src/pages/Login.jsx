import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/dashboard");
        }, 1500);
    };

    return (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#050508", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>

            {/* BG orbs */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <div className="orb-1" style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)", top: "-100px", left: "-100px" }} />
                <div className="orb-2" style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)", bottom: "-100px", right: "-100px" }} />
            </div>

            <div className="fade-up" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "440px", padding: "0 24px" }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 16px" }}>🚗</div>
                    <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>TaxiPark <span style={{ color: "#f5c518" }}>Pro</span></h1>
                    <p style={{ color: "#444", marginTop: "8px", fontSize: "15px" }}>Войдите в свой аккаунт</p>
                </div>

                {/* Card */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "40px" }}>

                    {/* Email */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "8px", fontWeight: 500 }}>Email</label>
                        <input
                            type="email"
                            placeholder="example@taxipark.ru"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px 16px", color: "#fff", fontSize: "15px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box", transition: "border 0.2s" }}
                            onFocus={e => e.target.style.border = "1px solid rgba(245,197,24,0.5)"}
                            onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "28px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <label style={{ fontSize: "14px", color: "#666", fontWeight: 500 }}>Пароль</label>
                            <a href="#" style={{ fontSize: "14px", color: "#f5c518", textDecoration: "none" }}>Забыли пароль?</a>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px 16px", color: "#fff", fontSize: "15px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box", transition: "border 0.2s" }}
                            onFocus={e => e.target.style.border = "1px solid rgba(245,197,24,0.5)"}
                            onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
                        />
                    </div>

                    {/* Button */}
                    <button
                        className="glow-btn btn-hover"
                        onClick={handleLogin}
                        style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #f5c518, #ff8c00)", color: "#000", border: "none", borderRadius: "50px", cursor: "pointer", fontWeight: 700, fontSize: "16px", fontFamily: "'Space Grotesk', sans-serif" }}>
                        {loading ? "Входим..." : "Войти →"}
                    </button>

                    <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#444" }}>
                        Нет аккаунта?{" "}
                        <a onClick={() => navigate("/register")} style={{ color: "#f5c518", textDecoration: "none", fontWeight: 600, cursor: "pointer" }}>Зарегистрироваться</a>
                    </div>
                </div>

                {/* Back */}
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <button onClick={() => navigate("/")} style={{ background: "transparent", border: "none", color: "#444", cursor: "pointer", fontSize: "14px", fontFamily: "'Space Grotesk', sans-serif" }}>
                        ← Вернуться на главную
                    </button>
                </div>
            </div>
        </div>
    );
}