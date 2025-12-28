const handleLogin = async () => {
    const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (res.ok) {
        const token = await res.text();
        localStorage.setItem("token", token);
    }
};
