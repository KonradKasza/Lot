// login.js
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json(); // backend zwraca { jwt: "...", status: "SUCCESS" }

            if (res.ok) {
                // zapisujemy token w localStorage
                localStorage.setItem("token", data.jwt);
                alert("Zalogowano!");
            } else {
                // jeśli dane logowania są błędne
                alert(data?.message || "Błędne dane logowania");
            }
        } catch (err) {
            console.error(err);
            alert("Błąd połączenia z serwerem");
        }
    };

    return (
        <div>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Zaloguj</button>
        </div>
    );
}
