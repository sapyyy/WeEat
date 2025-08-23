const form = document.querySelector("#signup");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const city = e.target.city.value;
  const phoneNo = e.target.phoneNo.value;
  const organization = e.target.organization.value;

  const body = {
    name,
    email,
    password,
    city,
    phoneNo,
    organization,
  };

  const link = "http://localhost:5000/donor/signup";

  try {
    const res = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("Failed to register: " + res.status);
    }

    const data = await res.json();
    console.log("Registered successfully", data);
    alert("Registered Successfully");
  } catch (err) {
    console.error(err);
    alert("Error Occurred", err);
  }
});
