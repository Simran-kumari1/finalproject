let pets = [];
let selectedPet = null;


async function loadPets() {

    const loading = document.getElementById("loading");
    const petGrid = document.getElementById("petGrid");

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("pets.json not found");
        }

        pets = await response.json();

        displayPets(pets);

    } catch (error) {

        console.error("JSON ERROR:", error);

        petGrid.innerHTML = `
            <div class="error">
                <h3>⚠️ Pets could not be loaded</h3>
                <p>Please check your pets.json file.</p>
            </div>
        `;

    } finally {

        loading.style.display = "none";

    }
}


function displayPets(list) {

    const container = document.getElementById("petGrid");
    const noPets = document.getElementById("noPets");

    container.innerHTML = "";

    if (list.length === 0) {

        noPets.style.display = "block";
        return;

    }

    noPets.style.display = "none";


    list.forEach(function(pet) {

        const card = document.createElement("div");

        card.className = "pet-card";


        card.innerHTML = `

            <img
                src="${pet.image}"
                alt="${pet.name}"
            >

            <div class="pet-info">

                <small>
                    ${getIcon(pet.type)} ${pet.type}
                </small>

                <h3>${pet.name}</h3>

                <p>${pet.breed}</p>

                <div class="details">

                    <span>🎂 ${pet.age}</span>

                    <span>⚥ ${pet.gender}</span>

                </div>

                <button onclick="viewProfile(${pet.id})">
                    View Profile
                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


function getIcon(type) {

    if (type === "Dog") return "🐶";

    if (type === "Cat") return "🐱";

    if (type === "Bird") return "🐦";

    if (type === "Rabbit") return "🐰";

    return "🐾";
}


function viewProfile(id) {

    selectedPet = pets.find(function(pet) {

        return pet.id === id;

    });


    if (!selectedPet) return;


    document.getElementById("modalImage").src =
        selectedPet.image;


    document.getElementById("modalType").textContent =
        `${getIcon(selectedPet.type)} ${selectedPet.type}`;


    document.getElementById("modalName").textContent =
        selectedPet.name;


    document.getElementById("modalBreed").textContent =
        selectedPet.breed;


    document.getElementById("modalAge").textContent =
        `🎂 ${selectedPet.age}`;


    document.getElementById("modalGender").textContent =
        `⚥ ${selectedPet.gender}`;


    document.getElementById("modalDescription").textContent =
        selectedPet.description;


    document.getElementById("petModal").style.display =
        "flex";

}


document.getElementById("closeModal").onclick = function() {

    document.getElementById("petModal").style.display =
        "none";

};


window.onclick = function(event) {

    const modal = document.getElementById("petModal");

    if (event.target === modal) {

        modal.style.display = "none";

    }

};


document.getElementById("adoptBtn").onclick = function() {

    if (!selectedPet) return;


    document.getElementById("selectedPet").value =
        selectedPet.name;


    document.getElementById("petModal").style.display =
        "none";


    document.getElementById("adoption").scrollIntoView({

        behavior: "smooth"

    });

};


function filterPets() {

    const search =
        document.getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const type =
        document.getElementById("typeFilter").value;


    const age =
        document.getElementById("ageFilter").value;


    const filtered = pets.filter(function(pet) {

        const searchMatch =

            pet.name.toLowerCase().includes(search) ||

            pet.breed.toLowerCase().includes(search);


        const typeMatch =

            type === "all" ||

            pet.type === type;


        const ageMatch =

            age === "all" ||

            pet.age === age;


        return searchMatch &&
               typeMatch &&
               ageMatch;

    });


    displayPets(filtered);

}


document.getElementById("searchInput")
    .addEventListener("input", filterPets);


document.getElementById("typeFilter")
    .addEventListener("change", filterPets);

document.getElementById("ageFilter")
    .addEventListener("change", filterPets);


document.getElementById("clearBtn").onclick = function() {

    document.getElementById("searchInput").value = "";

    document.getElementById("typeFilter").value = "all";

    document.getElementById("ageFilter").value = "all";

    displayPets(pets);

};

document.getElementById("adoptionForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        document.getElementById("successMessage")
            .style.display = "block";


        this.reset();

    });

loadPets();
