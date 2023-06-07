// ? * --> Imports
import {
  handleClear,
  handleSubmit,
  handleSearchInput,
  setPets,
  alert,
  resetForm,
  generateFakePets,
  setUserPreference,
  updateUserPreference,
  getPets,
  updateOrder,
  onOffline,
  getImage,
  deletePet,
  addPetCertificate,
} from "./functions.js";

// ? * --> DOM Elements

//  * --> Add pet Form
const addButton = document.querySelector("#btn-add-pet");
const clearButton = document.querySelector("#btn-clear-form");
const petName = document.querySelector("#pet-name");
const petType = document.querySelector("#pet-type");
const petDateOfBirth = document.querySelector("#pet-date-of-birth");
const petsCounterLabel = document.querySelector("[petsCounter]");
const petMedicalHistory = document.querySelector("#pet-med-history");
const petMedHisReadMore = document.querySelector("[medicalHistoryLabel]");
const confirmDate = document.querySelector("#confirmDateBtn");
const uploadAnImageActions = document.querySelector("#uploadAnImageActions");
const uploadAnImage = document.querySelector("#uploadAnImage");
const uploadFile = document.querySelector("#uploadFile");

//  * --> Pets List Page
const orderContainer = document.querySelector("#reorderContainer");
const searchbar = document.querySelector("ion-searchbar");
const petsList = document.querySelector("[petsList]");
const petsListTab = document.querySelector("#petsListTab");

// * --> Feeds Page
const feedList = document.querySelector("[feedList]");
const notify = document.querySelector("[notify]");

// * --> About Page
const platformLabel = document.querySelector("[platform]");

// * --> Main elements
const modals = document.querySelectorAll("ion-modal");
const tabs = document.querySelectorAll(".navigation-tabs");
const modelCancelBtns = document.querySelectorAll(".model-cancel");

//  ** --> Menu Buttons

//  *** --> Switches (toggles)
const themeToggle = document.querySelector("[theme-toggle]");
const alertToggle = document.querySelector("[alert-toggle]");
const notificationsToggle = document.querySelector("[notifications-toggle]");
const soundToggle = document.querySelector("[sound-toggle]");

// *** --> Buttons
const deletePets = document.querySelector("[delete-btn]");
const generatePets = document.querySelector("[generate-btn]");

// ? * --> Variables

//  * --> Utilities Elements
const utils = {
  tab: petsListTab,
  list: petsList,
  feedList,
  notify,
  counterLabel: petsCounterLabel,
  orderContainer,
};

//  * --> Preferences toggles
const preferenceToggles = {
  theme: themeToggle,
  notifications: notificationsToggle,
  alert: alertToggle,
  sound: soundToggle,
};

// ! --> Temporary variables
const petImages = [];
const petFiles = [];

//  * --> App Main Object
const app = {
  lunchTime: 0,
  initialize: function () {
    app.setupDocument();
    app.addEventListeners();
    console.log("App Initialized");
  },
  addEventListeners: function () {
    // ? * --> Event Listeners

    // ? * --> pointerdown event is used instead of click event
    // * 1 to be compatible on mobile devices
    // * 2 to avoid 300ms delay on mobile devices

    addButton?.addEventListener("pointerdown", () => {
      const data = {
        name: petName.value,
        type: petType.value,
        dob: petDateOfBirth.value,
        medicalHistory: petMedicalHistory.value,
      };
      const inputFields = [petName, petType, petDateOfBirth, petMedicalHistory];

      handleSubmit(data, "medicalHistory", utils, inputFields, {
        images: petImages,
        files: petFiles,
      });
    });

    clearButton?.addEventListener("pointerdown", () => {
      if (
        petName.value ||
        petType.value ||
        petDateOfBirth.value ||
        petMedicalHistory.value
      )
        alert("Clear Form", "Are you sure you want to clear the form?", null, [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Clear",
            handler: () => {
              resetForm([petName, petType, petDateOfBirth, petMedicalHistory]);
            },
          },
        ]);
    });

    deletePets?.addEventListener("pointerdown", async () => {
      let pets = await getPets("pets");
      pets.length > 0 &&
        alert(
          "Delete All Pets",
          "Are you sure you want to delete all pets?",
          null,
          [
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "Delete",
              handler: () => deletePet(null, null, utils, true),
            },
          ]
        );
    });

    generatePets?.addEventListener("pointerdown", () => {
      alert(
        "Generate Fake Pets",
        "enter number of pets to be generated!",
        null,
        [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Generate",
            role: "confirm",
            handler: async (alertData) => {
              const value = parseInt(alertData.number);
              generateFakePets(value);
              setPets(utils);
            },
          },
        ],
        [
          {
            name: "number",
            type: "number",
            placeholder: "number",
            min: 1,
            max: 100,
          },
        ]
      );
    });

    confirmDate?.addEventListener("pointerdown", () => {
      if (!petDateOfBirth.value)
        return alert("Error", null, "Please select a date", [
          {
            text: "Ok",
            role: "cancel",
          },
        ]);
      const dateValue = new Date(petDateOfBirth.value);
      const dateLabel = document.querySelector("[date]");
      const formattedDate = dateValue.toISOString().slice(0, 10);
      dateLabel.textContent = formattedDate;
      modals[0].dismiss(null, "confirm");
    });

    petMedHisReadMore?.addEventListener("pointerdown", () => {
      const container = petMedHisReadMore.parentElement;
      container.setAttribute("readMore", "true");
      petMedHisReadMore.textContent = "Read Less";
      petMedHisReadMore.addEventListener("pointerdown", () => {
        container.removeAttribute("readMore");
        petMedHisReadMore.textContent = "Read More";
      });
    });

    uploadAnImage?.addEventListener("pointerdown", () => {
      uploadAnImageActions.present();
    });

    uploadFile?.addEventListener("pointerdown", async () => {
      const file = await addPetCertificate("id")
        .then(() => {
          // Certificate added successfully
          alert("Success", null, "Certificate added successfully");
        })
        .catch((error) => {
          // Error occurred while adding the certificate
          alert("Error", null, error.message);
        });
      petFiles.push(file);
    });

    tabs?.forEach((tab) => {
      tab.addEventListener("pointerdown", () => {
        tab.setAttribute("highlight", "true");
        tabs.forEach((prevTab) => {
          if (prevTab !== tab) prevTab.removeAttribute("highlight");
        });
      });
    });

    modelCancelBtns?.forEach((btn) => {
      btn.addEventListener("pointerdown", () => {
        const index = parseInt(btn.getAttribute("index"));
        modals[index].dismiss(null, "cancel");
      });
    });

    // ? * --> Searchbar Events
    searchbar?.addEventListener("ionInput", handleSearchInput);
    searchbar?.addEventListener("ionCancel", handleClear);
    searchbar?.addEventListener("ionClear", handleClear);

    orderContainer.addEventListener("ionItemReorder", (event) => {
      // ? * --> Save the new order
      event.detail.complete();
      updateOrder(orderContainer.children);
    });

    for (const object in preferenceToggles) {
      const toggle = preferenceToggles[object];
      toggle.addEventListener("pointerdown", () => {
        updateUserPreference(toggle.getAttribute("key"), !toggle.checked);
      });
    }

    // ? * --> Network Events
    document.addEventListener("offline", onOffline, false);
  },

  setupDocument: function () {
    // ? * --> Setup Document

    //  * --> Set user preference
    setUserPreference(preferenceToggles);

    //  * --> Set Platform
    platformLabel.textContent = `For ${window.cordova.platformId}`;

    // * --> set actionsheet buttons
    uploadAnImageActions.buttons = [
      {
        text: "Take a photo",
        handler: async () => {
          await getImage("camera", petImages);
          console.log(petImages);
        },
      },
      {
        text: "Choose from gallery",
        handler: async () => {
          await getImage("gallery", petImages);
          console.log(petImages);
        },
      },
      {
        text: "Cancel",
        role: "cancel",
        data: {
          action: "cancel",
        },
      },
    ];

    //  * --> Set Pets

    petsList && setPets(utils);
  },

  loadFiles: function () {},
};

// ? * --> Initialize App on Device Ready
document.addEventListener("deviceready", app.initialize, false);
