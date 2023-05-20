export function handleSearchInput(event) {
  const pets = document.querySelectorAll(".search-item-elements");
  const query = event.target.value.trim().toLowerCase();
  if (query === "" || query === null) return handleClear();
  requestAnimationFrame(() => {
    pets.forEach((pet) => {
      const setVisibility =
        pet.getAttribute("name").toLowerCase().includes(query) ||
        pet.getAttribute("type").toLowerCase().includes(query);
      pet.setAttribute("hide", !setVisibility);
    });
  });
}

export function handleClear() {
  const pets = document.querySelectorAll(".search-item-elements");
  pets.forEach((pet) => {
    pet.removeAttribute("hide");
  });
}

export function confirm(modal) {
  const input = document.querySelector("ion-input");
  modal.dismiss(input.value, "confirm");
}

export function resetForm(inputFields) {
  for (const [key, value] of Object.entries(inputFields)) {
    value.value = "";
  }
  const dateLabel = document.querySelector("[date]");
  dateLabel.textContent = "Date of birth";
}

export async function presentAlert(header, subheader, message, buttons) {
  const alert = document.createElement("ion-alert");
  alert.header = header ?? "Alert";
  alert.subHeader = subheader ?? "";
  alert.message = message;
  alert.buttons = buttons ?? ["OK"];

  document.body.appendChild(alert);
  await alert.present();
}

export async function handleSubmit(data, exception, utils, inputFields) {
  for (const [key, value] of Object.entries(data)) {
    if (value === "" || value == null)
      if (key === exception) continue;
      else return presentAlert("New Pet", "error", "Please fill in all fields");
    if (value != null && key != "images") value.trim();
  }
  presentAlert("Save", null, "do you want to save pet!", [
    {
      text: "Cancel",
      role: "cancel",
    },
    {
      text: "Save",
      role: "confirm",
      handler: () => {
        resetForm(inputFields);
        presentAlert(null, "success", "Pet added successfully");
        const prevPetsList = JSON.parse(localStorage.getItem("pets")) ?? [];
        data = {
          ...data,
          date: new Date(),
          id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
          folder: data.petType,
        };
        const newPetsList = [...prevPetsList, data];
        localStorage.setItem("pets", JSON.stringify(newPetsList));
        getPets();
        setPets(utils);
      },
    },
  ]);
}

/**
 * Retrieves the pets from the local storage.
 * @returns {Promise<Array>} - A promise that resolves to the array of pets, or an empty array if there are no pets in the local storage.
 */
export function getPets() {
  return new Promise((resolve) => {
    const pets = JSON.parse(localStorage.getItem("pets"));
    resolve(pets || []);
  });
}

/**
 * This function is responsible for setting up the feeds page.
 * @param {HTMLElement} list - The list element for displaying pets.
 * @param {HTMLElement} notify - The notification element to notify if there is no feeds.
 */
export async function setFeeds(list, notify, pets) {
  // ? * --> If there are no pets

  if (!pets || pets.length === 0) {
    // ? * --> If there are no pets, inform the user and hide the list
    notify.setAttribute("visible", "true");
    list.setAttribute("visible", "false");
    return;
  }

  // ? * --> If there are pets
  // ? * --> Clear inner HTML of the feeds list
  // ? * --> Hide the notification and show the list
  notify.setAttribute("visible", "false");
  list.innerHTML = "";
  list.setAttribute("visible", "true");

  // ? * --> Loop through the pets and create a feed card for each pet
  pets.forEach((pet) => {
    // ? * --> Determine the medical history text to be displayed
    const petMedHis =
      pet.medicalHistory || `${pet.name} has no medical history`;

    // ? * --> Create a feed item for the pets List and set its attributes
    const petItem = document.createElement("ion-item");
    petItem.className = "ion-item";
    petItem.setAttribute("readMore", false);
    petItem.setAttribute("id", pet.id);

    // ? * --> Set the inner HTML of the feed item
    petItem.innerHTML = `
    <div class="feed-card">

        <span class="feed-card-added-date">${setDate(pet.date)}</span>

        <div class="feed-card-header-container">
            <ion-img class="feed-card-avatar" src="assets/${
              pet.type.toLowerCase() === "other" ? "logo" : pet.type
            }.png"
                alt="${pet.type} avatar image"></ion-img>
            <ion-title class="feed-card-name-label"> ${pet.name} </ion-title>
        </div>

        <ion-label>
            <span class="feed-card-bold-label">Type</span>
            <span class="feed-card-paragraph">${pet.type}</span>
        </ion-label>

        <ion-label>
            <span class="feed-card-bold-label">Date</span>
            <span class="feed-card-paragraph">${pet.dob}</span>
        </ion-label>

        <ion-label>
        <span class="feed-card-bold-label">Medical history</span>
        <br>
        <span medicalHistoryLabel class="feed-card-paragraph">
        ${petMedHis}
        </span>
    </ion-label>

    </div>
    `;
    // ? * --> Append the feed item to the feeds list
    list.appendChild(petItem);
  });
}

/**
 * Sets the past time representation for a given date attribute.
 * @param {string} dateAttribute - The date attribute to convert to a past time representation.
 * @returns {string} - The past time representation of the given date attribute.
 */
export function setDate(dateAttribute) {
  const date = new Date(dateAttribute);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }
}

/**
 *  This function is responsible to delete a single pet from pets list.
 *
 * @param {Array} pets - The array of pets.
 * @param {string} id - The ID of the pet to be deleted.
 * @param {Object} utils - An object containing utility elements.
 * @param {HTMLElement} utils.tab - The tab element for "Pets".
 * @param {HTMLElement} utils.list - The list element for displaying pets.
 * @param {HTMLElement} utils.notify - The notification label element.
 */
export function deletePet(pets, id, utils) {
  // ? * --> Filter out the pet with the specified ID
  const newPets = pets.filter((pet) => pet.id !== id);

  // ? * --> Update the pets in local storage
  localStorage.setItem("pets", JSON.stringify(newPets));

  // ? * --> If there are no more pets
  if (newPets.length === 0) {
    // ? * -->  Disable the "Pets List" tab
    utils.tab.disabled = true;
    utils.tab.setAttribute("highlight", "false");

    // ? * --> Activate the "Add" tab
    const addTab = document.querySelector('[tab="add"]');
    addTab.setAttribute("highlight", "true");
    addTab.active = true;

    // ? * --> Clear the pets list
    utils.list.innerHTML = "";
    utils.list.setAttribute("petsList", "hidden");

    // ? * --> Show the notification label
    utils.notify.setAttribute("notifyLabel", "visible");

    // ? * --> Remove pets from local storage
    localStorage.removeItem("pets");
  }

  // ? * --> Update the UI
  setPets(utils);
}

export async function setPets(utils) {
  // ? * --> declare a counter to count the number of pets
  let petsCounter = 0;

  // ? * --> Get the pets from local storage

  const pets = await getPets();

  // ? * --> If there are pets
  if (pets && pets.length > 0) {
    // ? * --> Enable the "Pets List" tab
    utils.tab.removeAttribute("disabled");
    // ? * --> clear the pets inner HTML list
    utils.list.innerHTML = "";
    // ? * --> Set the pets list to visible
    utils.list.setAttribute("petsList", "visible");
    // ? * --> Hide the notification label
    utils.notify?.setAttribute("notifyLabel", "hidden");
    // ? * --> Set the feeds list
    if (utils.feedList) setFeeds(utils.feedList, utils.notify, pets);
    // ? * --> create a pet item for each pet
    pets.forEach((pet) => {
      // ? * --> create a pet item and set its attributes
      const petItem = document.createElement("ion-item-sliding");
      petItem.className = "pet-item | search-item-elements";
      // ? * --> set the pet item name and type attributes for the search functionality
      petItem.setAttribute("name", pet.name);
      petItem.setAttribute("type", pet.type);
      petItem.setAttribute("hide", false);

      // ? * --> set the pet item inner HTML
      petItem.innerHTML = `

      <ion-item-options side="start">
      <ion-item-option color="medium" class="edit-button" id="${
        // ? * --> set the pet item id to the pet id for the edit functionality
        pet.id
      }">
      <ion-icon slot="icon-only" name="create-outline"></ion-icon>
    </ion-item-option>
    </ion-item-options>

    <ion-item class="pet-item">
    
    <div class="list-feed-card-container">
        <span class="feed-card-added-date">${setDate(pet.date)}</span>
        <ion-img class="feed-card-avatar" src="assets/${
          pet.type.toLowerCase() === "other" ? "logo" : pet.type
        }.png"
            alt="${pet.type} avatar image"></ion-img>
        <ion-title class="feed-card-name-label"> ${pet.name} </ion-title>
      </div>

    </ion-item>

    <ion-item-options slot="end">
      <ion-item-option color="danger" class="delete-btn" id="${
        // ? * --> set the pet item id to the pet id for the delete functionality
        pet.id
      }">
        <ion-icon slot="icon-only" name="trash"></ion-icon>
      </ion-item-option>
    </ion-item-options>`;

      utils.list.appendChild(petItem);
      petsCounter++;
    });
  } else {
    utils.list.setAttribute("petsList", "hidden");
    utils.notify.setAttribute("notifyLabel", "visible");
  }
  if (pets) {
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("pointerdown", () => {
        presentAlert("Confirm", "Delete", "do you want to delete pet!", [
          {
            text: "Delete",
            role: "confirm",
            handler: () => deletePet(pets, btn.id, utils),
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ]);
      });
    });
  }
  utils.counterLabel.innerText = petsCounter;
}

export function generateFakePets(petsNumber) {
  const pets = [];
  // Array of possible pet types
  const petTypes = ["dog", "cat", "bird", "fish", "other"];

  // Generate a random pet name
  function generatePetName() {
    const names = [
      "Max",
      "Bella",
      "Charlie",
      "Luna",
      "Oliver",
      "Lucy",
      "Leo",
      "Lily",
      "Rocky",
      "Molly",
      "Rex",
      "Cooper",
      "Daisy",
      "Rocky",
      "Molly",
      "Charlie",
      "Bella",
      "Max",
      "Lucy",
      "Oliver",
      "Lily",
      "Leo",
      "Luna",
      "Teddy",
      "Ruby",
      "Milo",
      "Rosie",
      "Duke",
      "Sadie",
      "Oscar",
      "Chloe",
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  // Generate a random medical history
  function generateMedicalHistory(name) {
    const actions = [
      "was born",
      "had a check-up",
      "received vaccinations",
      "visited the vet",
    ];
    const date = new Date().toISOString().split("T")[0];
    const action = actions[Math.floor(Math.random() * actions.length)];
    return `1. ${date}: ${name} ${action}`;
  }

  // Generate 100 pet objects

  for (let i = 0; i < petsNumber; i++) {
    const type = petTypes[Math.floor(Math.random() * petTypes.length)];
    const name = generatePetName();
    const dob = "2021-05-05";
    const medicalHistory =
      type === "other" ? undefined : generateMedicalHistory(name);

    const pet = {
      type,
      name,
      dob,
      medicalHistory,
    };

    pets.push(pet);
  }

  pets.forEach((pet) => {
    const data = {
      ...pet,
      date: new Date(),
      id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      folder: pet.petType,
    };

    const prevPetsList = JSON.parse(localStorage.getItem("pets")) ?? [];
    const newPetsList = [...prevPetsList, data];
    localStorage.setItem("pets", JSON.stringify(newPetsList));
  });
}
