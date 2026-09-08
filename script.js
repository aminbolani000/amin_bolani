// Railway ka live backend URL
const API_URL = "https://aminbolani-production.up.railway.app/api/watches";

// Website load hone par products fetch karne ka function
document.addEventListener("DOMContentLoaded", () => {
  fetchWatches();
});

async function fetchWathcesByCat(category) {
  try {
    const response = await fetch(`${API_URL}?category=${category}`);
    const watches = await response.json();
    displayWatches(watches);
  } catch (error) {
    console.error("Error fetching watches:", error);
  }
}

async function fetchWatches() {
  try {
    const response = await fetch(API_URL);
    const watches = await response.json();
    displayWatches(watches);
  } catch (error) {
    console.error("Error fetching watches:", error);
  }
}

// Watches ko HTML page par dikhane ka function
function displayWatches(watches) {
  // Check karo ke page par product container hai ya nahi
  const container = document.querySelector(".products-container" || ".watch-list" || "#product-list");
  
  // Agar container nahi milta toh console mein print kar do
  if (!container) {
    console.log("Watches data received:", watches);
    return;
  }

  container.innerHTML = "";
  
  watches.forEach(watch => {
    const watchElement = document.createElement("div");
    watchElement.classList.add("watch-card");
    
    // Image ka URL set karna (Railway backend se image uthayega)
    const imageUrl = `https://aminbolani-production.up.railway.app${watch.image}`;

    watchElement.innerHTML = `
      <img src="${imageUrl}" alt="${watch.name}" style="width: 100%; height: 200px; object-fit: cover;">
      <h3>${watch.name}</h3>
      <p>Category: ${watch.category}</p>
      <p>Price: Rs. ${watch.price}</p>
    `;
    
    container.appendChild(watchElement);
  });
}
