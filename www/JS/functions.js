"use strict";
/**
 * Takes item name to retrieves the pets from the local storage.
 * @param {string} name - The name of the local storage item to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to the array of pets, or an empty array if there are no pets in the local storage.
 */
export function getPets(name) {
  return new Promise((resolve) => {
    const pets = JSON.parse(localStorage.getItem(name));
    resolve(pets || []);
  });
}

/**
 * This function is responsible for setting up the feeds page.
 * @param {HTMLElement} list - The list element for displaying pets.
 * @param {HTMLElement} notify - The notification element to notify if there is no feeds.
 * @param {Array} pets - The array of pets to be displayed.
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
export async function deletePet(pets, id, utils) {
  const order = await getPets("order");
  const updatedOrder = order.filter((petId) => petId !== id);

  // ? * --> Filter out the pet with the specified ID
  const newPets = pets.filter((pet) => pet.id !== id);

  const newOrder = order.filter((petId) => petId !== id);

  // ? * --> Update the pets and pets order list in local storage
  localStorage.setItem("order", JSON.stringify(newOrder));
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

    // ? * --> Remove pets order from local storage
    localStorage.removeItem("order");
    return;
  }

  // ? * --> Update the UI
  setPets(utils);
}

/**
 * Changes the theme of the page based on the provided theme and color options.
 * Updates the `ColorSchemeMetaTag` and `localStorage` to reflect the new theme.
 * @param {string} theme - The current theme. If null or undefined, the `theme` attribute of `themeButton` will be used.
 * @param {HTMLElement} themeButton - The HTML button that triggered the theme change. Holds the current theme value as an attribute called `theme`.
 * @param {Object} darkThemeColors - An object of CSS variables and their corresponding color values for the "dark" theme.
 * @param {Object} lightThemeColors - An object of CSS variables and their corresponding color values for the "light" theme.
 * @param {HTMLMetaElement} ColorSchemeMetaTag - The HTML meta tag that displays the current color scheme of the page.
 * @param {string} tileColor - The color value for the browser navigation bar or browser color.
 */
export function setTheme(
  theme,
  darkThemeColors,
  lightThemeColors,
  ColorSchemeMetaTag,
  tileColor
) {
  const currentTheme = theme ? "dark" : "light";
  lightThemeColors = {
    "--primary-color-dark": "#11100e",
    "--primary-color-light": "#e8d9b8",
    "--background-color": "#171311",
    "--surface-gray": "#b4b3b1",
    "--surface-grayish": "#555147",
    "--theme-shadow": "#b9b5ab8a",
    "--input-background-color": "#5a3a27d3",
    "--tab-background-color": "#11100edc",
    "--tile-color": "#fcf6db",
  };

  darkThemeColors = {
    "--primary-color-dark": "#e8d9b8",
    "--primary-color-light": "#11100e",
    "--background-color": "#e8d9b8",
    "--surface-gray": "#b4b3b1",
    "--surface-grayish": "#eee5d1de",
    "--theme-shadow": "#1f1c16d2",
    "--input-background-color": "#8a6752bb",
    "--tab-background-color": "#d4c39d",
    "--tile-color": "#e8d9b8",
  };
  ColorSchemeMetaTag = document.querySelector("meta[name=color-scheme]");
  tileColor = "";
  let newTheme = "";

  if (currentTheme === "light") {
    newTheme = "dark";
    updateCSSVariables(darkThemeColors);
    tileColor = darkThemeColors["--tile-color"];
  } else if (currentTheme === "dark") {
    newTheme = "light";
    updateCSSVariables(lightThemeColors);
    tileColor = lightThemeColors["--tile-color"];
  } else {
    console.error(`Invalid theme: ${currentTheme}`);
    return;
  }

  // Update the `ColorSchemeMetaTag` and `localStorage` with the new theme.
  ColorSchemeMetaTag.setAttribute("content", `${newTheme} light`);
  document.body.style.colorScheme = `${newTheme} light`;
  // Set the browser navigation bar or browser color.
  setTileColor(tileColor);

  /**
   * Updates the CSS variables on the `root` element with the provided `colors`.
   * @param {Object} colors - An object of CSS variables and their corresponding color values.
   */
  function updateCSSVariables(colors) {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(colors)) {
      root.style.setProperty(key, value);
    }
  }

  /**
   * Sets the color of the browser navigation bar or browser color to the provided `color`.
   * @param {string} color - The color value to set.
   */
  function setTileColor(color) {
    const tileList = document.querySelectorAll("[tile-control]");
    for (const tile of tileList) {
      tile.setAttribute("content", color);
    }
  }
}

/**
 * Set the pets list and order based on the stored data.
 * @param {Object} utils - An object containing utility elements for the function.
 * @param {HTMLElement} utils.tab - The tab element for "Pets".
 * @param {HTMLElement} utils.list - The list element for displaying pets.
 * @param {HTMLElement} utils.feedList - The list element for displaying feeds.
 * @param {HTMLElement} utils.orderContainer - The container element for displaying the order of pets.
 * @param {HTMLElement} utils.notify - The notification label element.
 * @returns {void}
 */
export async function setPets(utils) {
  // ? * --> declare a counter to count the number of pets
  let petsCounter = 0;
  // ? * --> clear the pets inner HTML list
  utils.orderContainer.innerHTML = "";
  // ? * --> clear the feeds inner HTML list
  utils.feedList.innerHTML = "";

  // ? * --> Get the pets from local storage
  let pets = await getPets("pets");

  // ? * --> If there are pets

  if (pets && pets.length > 0) {
    // ? * --> Set the feeds list if it exists
    if (utils.feedList) setFeeds(utils.feedList, utils.notify, pets);

    // ? * -->  Check if there is an ordered list and retrieve it
    const petsOrderSet = new Set(await getPets("order"));
    if (petsOrderSet.size > 0) {
      const orderedPets = pets.filter((pet) => petsOrderSet.has(pet.id));
      pets = orderedPets;
    }

    // ? * --> Enable the "Pets List" tab
    utils.tab.removeAttribute("disabled");
    // ? * --> Set the pets list to visible
    utils.list.setAttribute("petsList", "visible");
    // ? * --> Hide the notification label
    utils.notify?.setAttribute("notifyLabel", "hidden");
    // ? * --> create a pet item for each pet
    pets.forEach((pet) => {
      // ? * --> create a pet item and set its attributes
      const petItem = document.createElement("ion-item-sliding");
      petItem.className = "pet-item | search-item-elements | clickable";
      // ? * --> set the pet item name and type attributes for the search functionality
      petItem.setAttribute("name", pet.name);
      petItem.setAttribute("type", pet.type);
      petItem.setAttribute("hide", false);
      // ? * --> set the pet item id attribute for the order functionality
      petItem.setAttribute("id", pet.id);

      // ? * --> set the pet item inner HTML
      petItem.innerHTML = `
      <ion-item-options side="start">
        <ion-item-option color="medium" class="edit-button" id="${pet.id}">
          <ion-icon slot="icon-only" name="create-outline"></ion-icon>
        </ion-item-option>
        <ion-item-option color="primary" class="view-button" id="${pet.id}">
        <ion-icon name="eye-outline"></ion-icon>
        </ion-item-option>
      </ion-item-options>
      <ion-item class="pet-item">
        <div class="list-feed-card-container">
          <span class="feed-card-added-date">${setDate(pet.date)}</span>
          <ion-img class="feed-card-avatar" src="assets/${
            pet.type.toLowerCase() === "other" ? "logo" : pet.type
          }.png"
            alt="${pet.type} avatar image"></ion-img>
          <ion-title class="feed-card-name-label">${pet.name}</ion-title>
        </div>
        <ion-reorder slot="end"></ion-reorder>
      </ion-item>
      <ion-item-options slot="end">
        <ion-item-option color="danger" class="delete-btn" id="${pet.id}">
          <ion-icon slot="icon-only" name="trash"></ion-icon>
        </ion-item-option>
      </ion-item-options>
      `;
      petsCounter++;
      utils.orderContainer.appendChild(petItem);
    });
    // ? * --> Enable the reorder functionality
    if (petsCounter > 1 && utils.orderContainer)
      utils.orderContainer.setAttribute("disabled", "false");
  } else {
    utils.list.setAttribute("petsList", "hidden");
    utils.notify.setAttribute("notifyLabel", "visible");
  }
  utils.counterLabel.innerText = petsCounter;
  if (pets && pets.length > 0) {
    const deleteButtons = document.querySelectorAll(".delete-button");
    const editButtons = document.querySelectorAll(".edit-button");
    const viewButtons = document.querySelectorAll(".view-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("pointerdown", () => {
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
    editButtons.forEach((button) => {
      button.addEventListener("pointerdown", () => {
        const pet = pets.find((pet) => pet.id === button.id);
        editPet(pet);
      });
    });
    viewButtons.forEach((button) => {
      button.addEventListener("pointerdown", () => {
        const pet = pets.find((pet) => pet.id === button.id);
        showDetails(pet);
      });
    });
  }
}

/**
 * Sets the user preference based on the provided toggles list.
 * Retrieves the user preference from local storage or sets default values.
 * Updates the user preference and toggles the corresponding elements.
 * @param {Object} togglesList - The list of toggles elements.
 * @param {HTMLElement} togglesList.[key] - The toggle element should have key named as the preference list .
 * @param {boolean} togglesList.[key].checked - The toggle element should have checked attribute.
 * @returns {void} this function returns nothing. but it updates the user preference and toggles the corresponding elements.
 */
export function setUserPreference(togglesList) {
  // ? * --> Get the user preference from local storage or set default values
  const userPreference = JSON.parse(localStorage.getItem("userPreference")) || {
    theme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? true
      : false,
    notifications: true,
    alert: true,
    sound: false,
  };
  // ? * --> Update the user preference and toggle the corresponding elements
  for (const [key, value] of Object.entries(userPreference)) {
    updateUserPreference(key, value);
    togglesList[key]?.setAttribute("checked", value);
  }
}

/**
 * Updates the user preference based on the provided key and value.
 * Retrieves the user preference list from local storage or sets default values.
 * Updates the corresponding key in the user preference list and stores it in local storage.
 * @param {string} key - The key representing the user preference.
 * @param {any} value - The value of the user preference.
 * @returns {void} this function returns nothing. but it updates the user preference `key` with `value` and stores it in local storage.
 */
export function updateUserPreference(key, value) {
  // ? * --> Get the user preference list from local storage or set default values
  const userPreferenceList = JSON.parse(
    localStorage.getItem("userPreference")
  ) ?? {
    theme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? true
      : false,
    notifications: true,
    alert: true,
    sound: false,
  };

  // ? * --> Update the corresponding key in the user preference list and store it in local storage
  switch (key) {
    case "theme":
      // ? * --> Set the theme based on the value
      setTheme(value);
      userPreferenceList.theme = value;
      break;
    case "notifications":
      // ? * --> Set the notifications based on the value
      // ! * --> Should be updated to handle the notifications
      userPreferenceList.notifications = value;
      break;
    case "alert":
      // ? * --> Set the alert based on the value
      // ! * --> Should be updated to handle the alert
      userPreferenceList.alert = value;
      break;
    case "sound":
      // ? * --> Set the sound based on the value
      // ! * --> Should be updated to handle the sound
      userPreferenceList.sound = value;
      break;
  }

  localStorage.setItem("userPreference", JSON.stringify(userPreferenceList));
}

/**
 * Presents an alert to the user with the specified options.
 *
 * @param {string} [header="Alert"] - The header text for the alert. Default is "Alert".
 * @param {string} [subheader=""] - The subheader text for the alert. Optional but null must be passed in to skip this parameter.
 * @param {string} message - The main message text for the alert. Required.
 * @param {string[]} [buttons=["OK"]] - An array of button labels for the alert. Default is a single "OK" button. optional but null must be passed in to skip this parameter.
 * @param {object[]} [inputs=[]] - An array of input options for the alert. Each input option should be an object with properties like `type`, `name`, `placeholder`, etc. Optional but null must be passed in to skip this parameter.
 * @returns {Promise<void>} A promise that resolves when the alert is dismissed.
 */
export async function presentAlert(
  header = "Alert",
  subheader = "",
  message,
  buttons = ["OK"],
  inputs = []
) {
  const alert = document.createElement("ion-alert");
  alert.style = `
    --background: var(--background-color);
    --backdrop-opacity: 0.8;
  `;
  alert.header = header;
  alert.subHeader = subheader;
  alert.message = message;
  alert.buttons = buttons;
  alert.inputs = inputs;

  document.body.appendChild(alert);
  await alert.present();
}

/**
 * Resets the values of input fields and clears the date label in a form.
 *
 * @param {object} inputFields - An object containing the input fields to be reset. The object should have keys representing the input field names and values representing the input field elements.
 * @returns {void}
 */
export function resetForm(inputFields) {
  Object.values(inputFields).forEach((value) => {
    value.value = "";
  });
  const dateLabel = document.querySelector("[date]");
  dateLabel.textContent = "Date of birth";
}

// ! * --> Need to update the function to handle the edit functionality
export function editPet(pet) {}

export function showDetails(pet) {
  console.log("clicked");
  const modal = document.querySelector("#petModal");
  modal.querySelector("[pet-img]").src = `assets/${
    pet.type.toLowerCase() === "other" ? "logo" : pet.type
  }.png`;
  modal.querySelector("[pet-img]").alt = `${pet.type} avatar image`;
  modal.querySelector("[pet-name]").innerText = pet.name;
  modal.querySelector("[pet-type]").innerText = pet.type;
  modal.querySelector("[pet-dob]").innerText = pet.dob;
  modal.querySelector("[pet-medical]").innerText = pet.medicalHistory;
  modal.querySelector("[pet-date-added]").innerText = pet.date;
  modal.present();
  modal.querySelector(".model-cancel").addEventListener("pointerdown", () => {
    modal.dismiss();
  });
}
export function updateOrder(orderContainer, pets) {
  pets = pets || [];
  // ? * --> get the current order
  const order = [...orderContainer.children].map((item) => item.id);
  // ? * --> store the new order in local storage
  localStorage.setItem("order", JSON.stringify([...order, ...pets]));
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
    const prevOrderList = JSON.parse(localStorage.getItem("order")) ?? [];
    const newPetsList = [...prevPetsList, data];
    localStorage.setItem("pets", JSON.stringify(newPetsList));
    if (prevOrderList.length > 0)
      localStorage.setItem(
        "order",
        JSON.stringify([...prevOrderList, data.id])
      );
  });
}

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

export function confirmModal(modal) {
  const input = document.querySelector("ion-input");
  modal.dismiss(input.value, "confirm");
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
        getPets("pets");
        setPets(utils);
      },
    },
  ]);
}

/**
 * This function shows a notify alert that can disappear after a certain duration
 * @param {string} message To display in the alert
 * @param {string} color background color of the alert
 * @param {number} duration duration of the alert
 * @param {string} position position of the alert
 * @returns {void} returns nothing, just displays the alert
 */
export function Notify(message, color, duration, position, id) {
  const toast = document.createElement("ion-toast");
  if (id) toast.id = id;
  toast.message = message;
  if (duration) toast.duration = duration;
  toast.color = color;
  toast.position = position;
  document.body.appendChild(toast);
  toast.present();
  return toast;
}

/**
 *
 * @param {string} type how to get an image from the device only capture or from gallery
 * @returns {string} returns the path of the image
 */
export async function getImage(type, petId) {
  const cameraSuccess = (imageData) => {
    return saveImage(imageData, petId);
  };

  const cameraError = (error) => {
    presentAlert(`${type} Error`, null, error);
  };

  const galleryOptions = {
    quality: 100,
    allowEditing: false,
    saveToGallery: true,
    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: navigator.camera.DestinationType.DATA_URL,
  };

  const cameraOptions = {
    quality: 100,
    allowEditing: false,
    saveToGallery: true,
    sourceType: navigator.camera.PictureSourceType.CAMERA,
    destinationType: navigator.camera.DestinationType.DATA_URL,
  };

  switch (type) {
    case "camera":
      return navigator.camera.getPicture(
        cameraSuccess,
        cameraError,
        cameraOptions
      );
    case "gallery":
      return navigator.camera.getPicture(
        cameraSuccess,
        cameraError,
        galleryOptions
      );
    default:
      throw new Error(
        `Invalid type ${type}. Only 'camera' or 'gallery' are allowed.`
      );
  }
}

export async function saveImage(imageData, petId) {
  const fileName = `${petId}_${new Date().getTime()}.jpg`;

  try {
    const base64Data = btoa(imageData);
    const filePath = await File.writeFile(
      File.dataDirectory,
      fileName,
      base64Data,
      { replace: true }
    );
    const imageURL = filePath.toURL();
    return imageURL;
  } catch (error) {
    throw new Error(`Failed to save image: ${error.message}`);
  }
}

export async function networkStatus(online) {
  if (online) {
    document.getElementById("#offline")?.remove();
    Notify("Back online", "success", 2000, "bottom", "#online");
    return;
  }
  Notify("You are offline", "danger", null, "bottom", "#offline");
}
