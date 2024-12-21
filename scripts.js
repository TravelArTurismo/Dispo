document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const mainContent = document.getElementById("main-content");
  const adminTools = document.getElementById("admin-tools");
  const loginButton = document.getElementById("login-button");
  const guestButton = document.getElementById("guest-button");
  const uploadButton = document.getElementById("upload-button");
  const excelInput = document.getElementById("excel-input");
  const logoutButton = document.getElementById("logout-button");

  const ADMIN_ID = "ADMIN";
  const ADMIN_PASSWORD = "1244";

  // Función para guardar datos en localStorage
  const saveDataToLocalStorage = (data) => {
    localStorage.setItem("availabilityData", JSON.stringify(data));
  };

  // Función para cargar datos desde localStorage
  const loadDataFromLocalStorage = () => {
    const storedData = localStorage.getItem("availabilityData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      populateTable(parsedData);
    }
  };

  loginButton.addEventListener("click", () => {
    const userId = document.getElementById("user-id").value;
    const userPassword = document.getElementById("user-password").value;

    if (userId === ADMIN_ID && userPassword === ADMIN_PASSWORD) {
      loginSection.classList.add("hidden");
      mainContent.classList.remove("hidden");
      adminTools.classList.remove("hidden");
    } else {
      alert("ID o Contraseña incorrectos");
    }
  });

  guestButton.addEventListener("click", () => {
    loginSection.classList.add("hidden");
    mainContent.classList.remove("hidden");
    adminTools.classList.add("hidden");
  });

  const loadExcelFile = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
      saveDataToLocalStorage(jsonData); // Guardar datos en localStorage
      populateTable(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const populateTable = (data) => {
    const tableBody = document.querySelector("#availability-table tbody");
    tableBody.innerHTML = "";

    data.forEach((row) => {
      const tableRow = document.createElement("tr");

      ["DESTINO", "FECHA", "DISPONIBLE", "TARIFA", "GTO ADM", "DURACION", "HOTEL", "REGIMEN", "OBSERVACIONES"].forEach((col) => {
        const cell = document.createElement("td");
        if (col === "FECHA" && row[col]) {
          const date = new Date(row[col]);
          cell.textContent = date.toLocaleDateString("es-AR");
        } else {
          cell.textContent = row[col] || "";
        }
        tableRow.appendChild(cell);
      });

      tableBody.appendChild(tableRow);
    });
  };

  uploadButton.addEventListener("click", () => {
    const file = excelInput.files[0];
    if (file) {
      loadExcelFile(file);
    } else {
      alert("Por favor, selecciona un archivo Excel.");
    }
  });

  logoutButton.addEventListener("click", () => {
    mainContent.classList.add("hidden");
    adminTools.classList.add("hidden");
    loginSection.classList.remove("hidden");
    document.getElementById("user-id").value = "";
    document.getElementById("user-password").value = "";
  });

  // Cargar datos desde localStorage al cargar la página
  loadDataFromLocalStorage();
});
