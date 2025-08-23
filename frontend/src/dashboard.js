let dashboard = document.querySelector("#dashboard");
let addFood = document.querySelector("#addFood");
let listing = document.querySelector("#listing");
let delivery = document.querySelector("#delivery");
let profile = document.querySelector("#profile");
let edit = document.querySelector("#edit");

let navBtn = document.querySelector("#navBtn");
let profileBtn = document.querySelector("#profileBtn");
let editBtn = document.querySelector("#editBtn");

const linkDashboard = "http://localhost:5000/donor/dashboard";
const totalQuantityShow = document.querySelector("#totalQuantity");
const totalMealsShow = document.querySelector("#totalMeals");
const carbonFootprint = document.querySelector("#carbonFootprint");
const waterFootprint = document.querySelector("#waterFootprint");

// local storage variables
const user = JSON.parse(localStorage.getItem("user"));
const token = user.token;
const donorId = user.id;

const carbonFactors = {
  Rice: 2.7,
  "Pulao/Biriyani": 3,
  "Chapati/Roti": 1.3,
  "Daal/Paneer": 2,
  "Mixed Veg Dal": 1.5,
  Sweets: 1.8,
};

const waterFactors = {
  Rice: 2500,
  "Pulao/Biriyani": 3000,
  "Chapati/Roti": 1600,
  "Daal/Paneer": 4500,
  "Mixed Veg Dal": 3000,
  Sweets: 2000,
};

// calculate carbon and water food prints
function calculateImpact(foodItems) {
  let totalCarbon = 0;
  let totalWater = 0;

  for (const item of foodItems) {
    const { type, quantity } = item; // quantity in kg
    totalCarbon += (carbonFactors[type] || 0) * quantity;
    totalWater += (waterFactors[type] || 0) * quantity;
  }

  carbonFootprint.innerHTML = `${totalCarbon} kg CO₂e`;
  waterFootprint.innerHTML = `${totalWater} liters`;
}

async function loadDashboard() {
  try {
    if (!token) {
      throw new Error("No token found, please login again");
    }

    const res = await fetch(linkDashboard, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        id: donorId,
        "Content-Type": "application/json",
      },
    });

    // get the data here
    const data = await res.json();
    const totalMeals = data.totalMeals;
    const totalQuantity = data.totalQuantity;
    const foodItems = data.foodItems;

    totalMealsShow.innerHTML = `${totalMeals} units`;
    totalQuantityShow.innerHTML = `${totalQuantity} kgs`;
    calculateImpact(foodItems);

    console.log("Dashboard data:", data);
  } catch (err) {
    console.error(err);
  }
}
loadDashboard();

function addHide() {
  dashboard.classList.add("hidden");
  addFood.classList.add("hidden");
  listing.classList.add("hidden");
  delivery.classList.add("hidden");
  profile.classList.add("hidden");
  edit.classList.add("hidden");
}

navBtn.addEventListener("click", function (e) {
  if (e.target.id == "navBtn") {
    return;
  }
  let elId = e.target.id;
  console.log(elId);
  let newElId = elId.replace("Btn", "");
  console.log(newElId);
  addHide();
  let elm = document.querySelector(`#${newElId}`);
  elm.classList.remove("hidden");
});

profileBtn.addEventListener("click", function (e) {
  addHide();
  profile.classList.remove("hidden");
});

editBtn.addEventListener("click", function (e) {
  addHide();
  edit.classList.remove("hidden");
});

// Add food Form functions
const foodCart = [];
let divUl = document.querySelector("#divUl");
let donationForm = document.querySelector("#donationForm");
donationForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(donationForm);
  let data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  foodCart.push(data);
  let newLi = document.createElement("li");
  newLi.innerText = data.foodType;
  divUl.appendChild(newLi);
  donationForm.reset();
});

let foodSubmitBtnFinal = document.querySelector("#foodSubmitBtnFinal");
foodSubmitBtnFinal.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log(foodCart);

  try {
    const res = await fetch("http://localhost:5000/donor/listfood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ foodCart: foodCart }), // send the data as JSON
    });

    if (!res.ok) {
      throw new Error(`Failed to send data: ${res.status}`);
    }

    const data = await res.json();
    console.log("Data sent successfully:", data);
  } catch (err) {
    console.error("Error sending data:", err);
  }
});
