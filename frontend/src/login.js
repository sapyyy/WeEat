const login = document.querySelector("#login");

login.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  const body = {
    email,
    password,
  };

  const link = "http://localhost:5000/donor/signin";

  try {
    const res = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("Login failed: " + res.status);
    }

    const data = await res.json();
    console.log("Logged in successfully", data);

    // ✅ Redirect to dashboard after login
    window.location.href = "dashboard.html";

    // optional: store full object
    localStorage.setItem("user", JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
});
