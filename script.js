const breedSelect = document.getElementById("breedSelect");
const dogImage = document.getElementById("dogImage");
const message = document.getElementById("message");
const fetchButton = document.getElementById("fetchButton");

const API = "https://dog.ceo/api";

async function loadBreeds() {
  try {
    message.textContent = "Loading breeds...";
    const response = await fetch(`${API}/breeds/list/all`);
    if (!response.ok) throw new Error("Hindi makuha ang breed list.");
    const data = await response.json();

    // Include both main breeds and sub-breeds in the dropdown.
    const breeds = Object.entries(data.message);
    breeds.sort(([a], [b]) => a.localeCompare(b));

    for (const [breed, subBreeds] of breeds) {
      if (subBreeds.length === 0) {
        addOption(breed, breed);
      } else {
        for (const subBreed of subBreeds) {
          const value = `${breed}/${subBreed}`;
          const label = `${capitalize(subBreed)} ${capitalize(breed)}`;
          addOption(value, label);
        }
      }
    }
    message.textContent = "Pumili ng breed sa taas";
  } catch (error) {
    message.textContent = "Hindi ma-load ang breeds. Check your internet connection.";
    console.error(error);
  }
}

function addOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  breedSelect.appendChild(option);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

async function fetchDog() {
  const selectedBreed = breedSelect.value;
  if (!selectedBreed) return;

  fetchButton.disabled = true;
  dogImage.style.display = "none";
  message.style.display = "block";
  message.textContent = "Fetching dog picture...";

  try {
    const endpoint = selectedBreed.includes("/")
      ? `${API}/breed/${selectedBreed}/images/random`
      : `${API}/breed/${selectedBreed}/images/random`;

    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Hindi makuha ang image.");
    const data = await response.json();

    dogImage.onload = () => {
      dogImage.style.display = "block";
      message.style.display = "none";
      fetchButton.disabled = false;
    };
    dogImage.onerror = () => {
      dogImage.style.display = "none";
      message.style.display = "block";
      message.textContent = "Hindi ma-display ang image. Try Fetch Again.";
      fetchButton.disabled = false;
    };
    dogImage.src = data.message;
  } catch (error) {
    message.textContent = "May error sa pag-fetch. Try ulit.";
    fetchButton.disabled = false;
    console.error(error);
  }
}

breedSelect.addEventListener("change", () => {
  if (breedSelect.value) {
    fetchButton.disabled = false;
    fetchDog();
  } else {
    dogImage.style.display = "none";
    message.style.display = "block";
    message.textContent = "Pumili ng breed sa taas";
    fetchButton.disabled = true;
  }
});

fetchButton.addEventListener("click", fetchDog);

loadBreeds();
