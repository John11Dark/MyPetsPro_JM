const addButton = document.querySelector("#btn-add-pet");
const petName = document.querySelector("#pet-name");
const petType = document.querySelector("#pet-type");
const petDateOfBirth = document.querySelector("#pet-date-of-birth");
const petsList = document.querySelector("[petsList]");
const notify = document.querySelector("[notifyLabel]");
const petsCounterLabel = document.querySelector("[petsCounter]");
const tabs = document.querySelectorAll(".navigation-tabs");
const modelCancelBtns = document.querySelectorAll(".model-cancel");
const modals = document.querySelectorAll("ion-modal");
const confirmDate = document.querySelector("#confirmDateBtn");
const petMedicalHistory = document.querySelector("#pet-med-history");
const petsListTab = document.querySelector("#petsListTab");
const petImages = [];

const searchbar = document.querySelector("ion-searchbar");
import {
  handleClear,
  handleSubmit,
  handleInput,
  setPets,
  presentAlert,
} from "./functions.js";

addButton?.addEventListener("pointerdown", () => {
  const data = {
    name: petName.value,
    type: petType.value,
    dob: petDateOfBirth.value,
    medicalHistory: petMedicalHistory.value,
    images: petImages,
  };
  const inputFields = [petName, petType, petDateOfBirth, petMedicalHistory];
  const utils = {
    tab: petsListTab,
    list: petsList,
    notify,
    counterLabel: petsCounterLabel,
  };
  handleSubmit(data, "medicalHistory", utils, inputFields);
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

searchbar?.addEventListener("ionInput", handleInput);
searchbar?.addEventListener("ionCancel", handleClear);
searchbar?.addEventListener("ionClear", handleClear);

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

petsList &&
  (await setPets({
    tab: petsListTab,
    list: petsList,
    notify,
    counterLabel: petsCounterLabel,
  }));
