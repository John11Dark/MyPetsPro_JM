const addButton = document.querySelector("#btn-add-pet");
const petName = document.querySelector("#pet-name");
const petType = document.querySelector("#pet-type");
const petDateOfBirth = document.querySelector("#pet-date-of-birth");
const petsList = document.querySelector("[petsList]");
const notify = document.querySelector("[notifyLabel]");
const deleteBtn = document.querySelector("#clear-btn");
const petsCounterLabel = document.querySelector("[petsCounter]");
const tabs = document.querySelectorAll(".navigation-tabs");
const modelCancelBtns = document.querySelectorAll(".model-cancel");
const modals = document.querySelectorAll("ion-modal");
const confirmDate = document.querySelector("#confirmDateBtn");
const petMedicalHistory = document.querySelector("#pet-med-history");
function resetForm() {
  petName.value = "";
  petType.value = "";
  petDateOfBirth.value = "";
  petMedicalHistory.value = "";
}

async function presentAlert(header, subheader, message, buttons) {
  const alert = document.createElement("ion-alert");
  alert.header = header ?? "Alert";
  alert.subHeader = subheader ?? "";
  alert.message = message;
  alert.buttons = buttons ?? ["OK"];

  document.body.appendChild(alert);
  await alert.present();
}

async function handleSubmit(data) {
  for (const [key, value] of Object.entries(data)) {
    if (value != null) {
      value.trim();
    }
    if (value === "")
      return presentAlert("New Pet", "error", "Please fill in all fields");
  }
  presentAlert("Confirm", "save", "do you want to save pet!", [
    {
      text: "save",
      role: "confirm",
      handler: () => {
        resetForm();
        presentAlert(null, "success", "Pet added successfully");
        const prevPetsList = JSON.parse(localStorage.getItem("pets")) ?? [];
        data = {
          ...data,
          date: new Date(),
          id: `${Date.now()}, ${data.to}`,
          folder: petType,
        };
        const newPetsList = [...prevPetsList, data];
        localStorage.setItem("pets", JSON.stringify(newPetsList));
        getPets();
      },
    },
    {
      text: "Cancel",
      role: "cancel",
      handler: () => console.log(`cancel has been clicked`),
    },
  ]);
}

async function getPets() {
  const messages = JSON.parse(localStorage.getItem("pets"));
  if (messages) return await messages;
}

async function setPets() {
  const pets = await getPets();
  // create ion-item for each message and append to messagesList
  // the ion-item should have From, Subject, Message and date received the but on the right same line

  let petsCounter = 0;

  if (pets) {
    petsList.innerHTML = "";
    petsList.setAttribute("petsList", "visible");
    notify.setAttribute("notifyLabel", "hidden");
    for (let index in pets) {
      const petItem = document.createElement("ion-item");
      petItem.setAttribute("class", "pet-item");
      const petMedHisValue = `          ${
        pets[index].medicalHistory != null
          ? `<h2> <strong>Pet Medical History:</strong> ${pets[index].medicalHistory}</h2>`
          : ""
      }`;
      petItem.innerHTML = `
      <ion-card class="petCard" card>
          <ion-avatar slot="start">
              <ion-img src="${pets[index].image}"
                  alt="${pets[index].name} image"></ion-img>
          </ion-avatar>
          <ion-label>
          <h2> <strong>Pet name:</strong> ${pets[index].name}</h2>
          <h2> <strong>Pet Type:</strong> ${pets[index].type}</h2>
          <h2> <strong>Pet Date:</strong> ${pets[index].dob}</h2>
          ${petMedHisValue}
          </ion-label>
          <div>
              <ion-label>
                  <p><strong>added by</strong> John Muller</p>
                  <p><strong>added on</strong> ${pets[index].date}</p>
              </ion-label>
          </div>
      </ion-card>
        `;
      petsList.appendChild(petItem);
      petsCounter++;
      console.log(petsCounter);
    }
  } else {
    petsList.setAttribute("petsList", "hidden");
    notify.setAttribute("notifyLabel", "visible");
  }

  petsCounterLabel.innerText = petsCounter;
}

async function deletePets() {
  presentAlert("Confirm", "Delete", "do you want to delete all pets!", [
    {
      text: "Delete",
      role: "confirm",
      handler: () => {
        presentAlert(null, "success", "pets deleted successfully");
        localStorage.removeItem("pets");
        petsList.innerHTML = "";
        petsList.setAttribute("petsList", "hidden");
        notify.setAttribute("notifyLabel", "visible");
        petsCounterLabel.innerText = 0;
      },
    },
    {
      text: "Cancel",
      role: "cancel",
      handler: () => console.log(`cancel has been clicked`),
    },
  ]);
}

if (deleteBtn)
  deleteBtn.addEventListener("pointerdown", async () => {
    deletePets();
  });

if (petsList) await setPets();

addButton?.addEventListener("pointerdown", () => {
  const petNameValue = petName.value;
  const petTypeValue = petType.value;
  const petDOBValue = petDateOfBirth.value;
  const petMedicalHistoryValue = petMedicalHistory.value;
  if (petMedicalHistoryValue !== "") {
    handleSubmit({
      name: petNameValue,
      type: petTypeValue,
      dob: petDOBValue,
      medicalHistory: petMedicalHistoryValue,
    });
  } else {
    handleSubmit({
      name: petNameValue,
      type: petTypeValue,
      dob: petDOBValue,
    });
  }
});

if (confirmDate)
  confirmDate.addEventListener("pointerdown", () => {
    const dateValue = petDateOfBirth.value;
    const dateLabel = document.querySelector("[date]");
    dateLabel.textContent = dateValue;
    modals[0].dismiss(null, "confirm");
  });

tabs?.forEach((tab) => {
  tab.addEventListener("pointerdown", () => {
    tab.setAttribute("active", "true");
    tabs.forEach((prevTab) => {
      if (prevTab !== tab) prevTab.removeAttribute("active");
    });
  });
});

function confirm() {
  const input = document.querySelector("ion-input");
  modal.dismiss(input.value, "confirm");
}

modelCancelBtns?.forEach((btn) => {
  btn.addEventListener("pointerdown", () => {
    const index = parseInt(btn.getAttribute("index"));
    index && modals[index].dismiss(null, "cancel");
  });
});
