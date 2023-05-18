export function handleInput(event) {
  const pets = document.querySelectorAll(".petCard-container");
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
  const pets = document.querySelectorAll(".petCard-container");
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
  presentAlert("Confirm", "save", "do you want to save pet!", [
    {
      text: "save",
      role: "confirm",
      handler: () => {
        resetForm(inputFields);
        presentAlert(null, "success", "Pet added successfully");
        const prevPetsList = JSON.parse(localStorage.getItem("pets")) ?? [];
        data = {
          ...data,
          date: new Date(),
          id: `${Date.now()}, ${data.to}`,
          folder: data.petType,
        };
        const newPetsList = [...prevPetsList, data];
        localStorage.setItem("pets", JSON.stringify(newPetsList));
        getPets();
        setPets(utils);
      },
    },
    {
      text: "Cancel",
      role: "cancel",
      handler: () => console.log(`cancel has been clicked`),
    },
  ]);
}

export async function getPets() {
  const pets = JSON.parse(localStorage.getItem("pets"));
  if (pets) return await pets;
}

/**
 * ? This function is responsible to delete a single pet from pets list.
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
  const pets = await getPets();
  let petsCounter = 0;

  if (pets && pets.length > 0) {
    utils.tab.removeAttribute("disabled");
    utils.list.innerHTML = "";
    utils.list.setAttribute("petsList", "visible");
    utils.notify?.setAttribute("notifyLabel", "hidden");
    for (const index in pets) {
      const petItem = document.createElement("ion-item");
      petItem.setAttribute("class", "pet-item");
      const petMedHisValue = `          ${
        pets[index].medicalHistory != null
          ? `<h2> <strong class="bold">Pet Medical History:</strong> ${pets[index].medicalHistory}</h2>`
          : ""
      }`;
      petItem.innerHTML = `
        <div class="petCard-container" hide name="${pets[index].name}" type="${
        pets[index].type
      }">
        <div class="card-effect" left="${index % 2 === 0}">
            <div primary class="circle"> </div>
            <div secondary class="circle"> </div>
            </div>
            <ion-button class="delete-btn" fill="clear" color="danger" slot="end" id="${
              pets[index].id
            }">
                <ion-icon name="trash-outline"></ion-icon>
            </ion-button>
  
        <ion-card class="petCard" card>
            
            <ion-avatar slot="start" class="pet-avatar">
                <ion-img src="${pets[index]?.image}"
                    alt="${pets[index].name} image"></ion-img>
            </ion-avatar>
            <ion-label class="pet-details-container">
            <h2> <strong class="bold">Pet name:</strong> ${
              pets[index].name
            }</h2>
            <h2> <strong class="bold">Pet Type:</strong> ${
              pets[index].type
            }</h2>
            <h2> <strong class="bold">Pet Date:</strong> ${pets[index].dob}</h2>
            ${petMedHisValue}
            </ion-label>
  
                <ion-label class="flex | card-footer">
                    <p class="footer-content"> <strong >added by</strong> John Muller</p>
                    <p class="footer-content"> <strong >added on</strong> ${
                      pets[index].date
                    }</p>
                </ion-label>
  
        </ion-card>
        </div>
          `;
      utils.list.appendChild(petItem);
      petsCounter++;
    }
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
