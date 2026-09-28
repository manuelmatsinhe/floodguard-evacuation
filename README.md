# FloodGuard Evacuation 🌊🏃‍♂️

> 🏆 **Note:** This project was developed as part of a hackathon by **BIT AFRICA**.

**FloodGuard Evacuation** is an advanced, tech-driven web application designed to optimize and manage evacuation processes in high-risk areas prone to floods. Our primary goal is to save lives through efficient routing, real-time crowdsourced alerts, and community coordination.

---

## 🚀 Key Features

* **Constant Live Tracking (`Always-on Dot`)**: Integrates directly with the HTML5 Geolocation API to provide a persistent, real-time top banner showing your exact latitude, longitude, and accuracy.
* **Crowdsourced SOS Validation**: A sophisticated math-based alert system (using the Haversine formula). If a user broadcasts an SOS, it registers locally. If **3 or more SOS signals** are broadcasted within a 500-meter radius in a 10-minute window, the system mathematically validates a crisis and triggers a MASS ZONE ALERT, dispatching emergency services.
* **FloodGuard AI Assistant**: An integrated conversational chatbot that analyzes app parameters to help users find routes, locate shelters, and initiate emergency protocols instantly.
* **Community Insights**: A crowd-sourcing mechanism allowing civilians to report dynamic updates (e.g., offering a house as a shelter, reporting a road blockage, or updating water levels). These insights instantly verify and update the UI across the Shelters, Alerts, and Map pages.
* **Evacuation Routing**: Calculates the safest, fastest route to the nearest community shelter directly on an interactive map.
* **Dynamic Theming**: Full CSS-variable-based architecture supporting both a premium Light Mode and Dark Mode out of the box.

---

## 🛠️ Technologies Used

* **Frontend Architecture**: Pure HTML5, CSS3, and Vanilla JavaScript (No heavy frameworks required).
* **Iconography**: Google Material Symbols (Outlined).
* **State Management**: Browser `localStorage` and dynamic DOM manipulation for simulating backend network verification and data persistence across multiple pages.
* **Geolocation**: HTML5 `navigator.geolocation.watchPosition` for real-time tracking.

---

## 📦 How to Run the Project

Since this project relies on pure frontend technologies, no build steps or heavy servers are required!

1. Clone this repository:
   ```bash
  https://github.com/manuelmatsinhe/floodguard-evacuation.git
   ```
2. Navigate into the folder:
   ```bash
   cd floodguard-evacuation
   ```
3. Open `index.html` in any modern web browser to launch the application.
