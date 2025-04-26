function logout() {
  alert("You have been logged out.");
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    link.classList.add('active');
    const targetId = link.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');
  });
});

function renderCars() {
  const carList = document.getElementById("carList");
  carList.innerHTML = "";
  const cars = JSON.parse(localStorage.getItem("cars") || "[]");
  cars.forEach((car, index) => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.dataset.type = car.type;
    card.dataset.brand = car.brand;
    card.dataset.price = car.price;
    card.innerHTML = `
      <img src="car.jpg" alt="${car.name}" />
      <h3>${car.name}</h3>
      <p>${car.type === "rent" ? "Rent" : "Price"}: ${car.price} SAR</p>
      <button onclick="showDetails(${index})">View Details</button>
    `;
    carList.appendChild(card);
  });
}

function showDetails(index) {
  const cars = JSON.parse(localStorage.getItem("cars") || "[]");
  const car = cars[index];
  const detail = document.getElementById("carDetailsContent");
  detail.innerHTML = `
    <h3>${car.name}</h3>
    <p>Brand: ${car.brand}</p>
    <p>Type: ${car.type}</p>
    <p>Price: ${car.price} SAR</p>
  `;
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById("carDetailsSection").classList.add("active");
}

document.getElementById("addCarForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("carName").value;
  const brand = document.getElementById("carBrand").value;
  const price = document.getElementById("carPrice").value;
  const type = document.getElementById("carTypeInput").value;
  const cars = JSON.parse(localStorage.getItem("cars") || "[]");
  cars.push({ name, brand, price, type });
  localStorage.setItem("cars", JSON.stringify(cars));
  renderCars();
  alert("Car added successfully!");
  this.reset();
});

document.getElementById("filterForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const type = document.getElementById("carType").value;
  const brand = document.getElementById("brand").value;
  const min = parseInt(document.getElementById("minPrice").value) || 0;
  const max = parseInt(document.getElementById("maxPrice").value) || Infinity;
  document.querySelectorAll(".car-card").forEach(car => {
    const carType = car.dataset.type;
    const carBrand = car.dataset.brand;
    const carPrice = parseInt(car.dataset.price);
    const match = (!type || carType === type) &&
                  (!brand || carBrand === brand) &&
                  carPrice >= min && carPrice <= max;
    car.style.display = match ? "block" : "none";
  });
});

document.addEventListener("DOMContentLoaded", renderCars);