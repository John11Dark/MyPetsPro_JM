const addButton = document.querySelector("#btn-add-pet");
const clearButton = document.querySelector("#btn-clear-form");
const petName = document.querySelector("#pet-name");
const petType = document.querySelector("#pet-type");
const petDateOfBirth = document.querySelector("#pet-date-of-birth");
const petsList = document.querySelector("[petsList]");
const notify = document.querySelector("[notify]");
const petsCounterLabel = document.querySelector("[petsCounter]");
const tabs = document.querySelectorAll(".navigation-tabs");
const modelCancelBtns = document.querySelectorAll(".model-cancel");
const modals = document.querySelectorAll("ion-modal");
const confirmDate = document.querySelector("#confirmDateBtn");
const petMedicalHistory = document.querySelector("#pet-med-history");
const petsListTab = document.querySelector("#petsListTab");
const petImages = [];
const petMedHisReadMore = document.querySelector("[medicalHistoryLabel]");
const platformLabel = document.querySelector("[platform]");
const searchbar = document.querySelector("ion-searchbar");
const feedList = document.querySelector("[feedList]");

import {
  handleClear,
  handleSubmit,
  handleSearchInput,
  setPets,
  presentAlert,
  resetForm,
  generateFakePets,
} from "./functions.js";

const utils = {
  tab: petsListTab,
  list: petsList,
  feedList,
  notify,
  counterLabel: petsCounterLabel,
};

// ? * --> Doc Setup

// ? * --> Set Platform
// platformLabel?.textContent = `For ${window.cordova.platformId}`;

// ? * --> Set Pets
// localStorage.clear();
// generateFakePets(10);
petsList && (await setPets(utils));

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
    images: petImages,
  };
  const inputFields = [petName, petType, petDateOfBirth, petMedicalHistory];

  handleSubmit(data, "medicalHistory", utils, inputFields);
});

clearButton?.addEventListener("pointerdown", () => {
  if (
    petName.value ||
    petType.value ||
    petDateOfBirth.value ||
    petMedicalHistory.value
  )
    presentAlert(
      "Clear Form",
      "Are you sure you want to clear the form?",
      null,
      [
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
      ]
    );
});

confirmDate?.addEventListener("pointerdown", () => {
  if (!petDateOfBirth.value)
    return presentAlert("Error", null, "Please select a date", [
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
