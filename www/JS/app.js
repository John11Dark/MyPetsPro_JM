// const addButton = document.querySelector("#btn-add-pet");
// const petName = document.querySelector("#pet-name");
// const petType = document.querySelector("#pet-type");
// const petDateOfBirth = document.querySelector("#pet-dateofb");
// const petsList = document.querySelector("[petsList]");
// const notify = document.querySelector("[notifyLabel]");
// const deleteBtn = document.querySelector("#clear-btn");
// const petsCounterLabel = document.querySelector("[petsCounter]");
// const toast = document.querySelector("ion-toast");

// function resetForm() {
//   petName.value = "";
//   petType.value = "";
//   petDateOfBirth.value = "";
// }

// async function presentAlert(header, subheader, message, buttons) {
//   const alert = document.createElement("ion-alert");
//   alert.header = header ?? "Alert";
//   alert.subHeader = subheader ?? "";
//   alert.message = message;
//   alert.buttons = buttons ?? ["OK"];

//   document.body.appendChild(alert);
//   await alert.present();
// }

// async function handleSubmit(data) {
//   for (const [key, value] of Object.entries(data)) {
//     if (value != null) {
//       value.trim();
//     }
//     if (value === "")
//       return presentAlert("New Pet", "error", "Please fill in all fields");
//   }
//   presentAlert("Confirm", "save", "do you want to save pet!", [
//     {
//       text: "save",
//       role: "confirm",
//       handler: () => {
//         resetForm();
//         presentAlert(null, "success", "Pet added successfully");
//         const prevPetsList = JSON.parse(localStorage.getItem("pets")) ?? [];
//         data = {
//           ...data,
//           date: new Date(),
//           id: `${Date.now()}, ${data.to}`,
//           folder: petType,
//         };
//         const newPetsList = [...prevPetsList, data];
//         localStorage.setItem("pets", JSON.stringify(newPetsList));
//         getPets();
//       },
//     },
//     {
//       text: "Cancel",
//       role: "cancel",
//       handler: () => console.log(`cancel has been clicked`),
//     },
//   ]);
// }

// async function getPets() {
//   const messages = JSON.parse(localStorage.getItem("pets"));
//   if (messages) return await messages;
// }

// async function setPets() {
//   const pets = await getPets();
//   // create ion-item for each message and append to messagesList
//   // the ion-item should have From, Subject, Message and date received the but on the right same line

//   let petsCounter = 0;
//   if (pets) {
//     petsList.setAttribute("petsList", "visible");
//     notify.setAttribute("notifyLabel", "hidden");
//     for (let index in pets) {
//       const petItem = document.createElement("ion-item");
//       petItem.innerHTML = `
//         <ion-label class="pet-card">
//             <h2 class="card-name">${pets[index].name}</h2>
//             <h3 class="card-type"> <b> Pet type:</b>${pets[index].type}</h3>
//             <p class="card-dob"> <b> date of birth/adobtion date:</b>${pets[index].dob}</p>
//         </ion-label>`;
//       petsList.appendChild(petItem);
//       petsCounter++;
//       console.log(petsCounter);
//     }
//   } else {
//     petsList.setAttribute("petsList", "hidden");
//     notify.setAttribute("notifyLabel", "visible");
//   }

//   petsCounterLabel.innerText = petsCounter;
// }

// async function deletePets() {
//   presentAlert("Confirm", "Delete", "do you want to delete all pets!", [
//     {
//       text: "Delete",
//       role: "confirm",
//       handler: () => {
//         presentAlert(null, "success", "pets deleted successfully");
//         localStorage.removeItem("pets");
//         petsList.innerHTML = "";
//         petsList.setAttribute("petsList", "hidden");
//         notify.setAttribute("notifyLabel", "visible");
//         petsCounterLabel.innerText = 0;
//       },
//     },
//     {
//       text: "Cancel",
//       role: "cancel",
//       handler: () => console.log(`cancel has been clicked`),
//     },
//   ]);
//   toast.isOpen = true;
// }

// if (deleteBtn)
//   deleteBtn.addEventListener("pointerdown", async () => {
//     deletePets();
//   });

// if (petsList) await setPets();

// if (addButton)
//   addButton.addEventListener("pointerdown", () => {
//     const petNameValue = petName.value;
//     const petTypeValue = petType.value;
//     const petDOBValue = petDateOfBirth.value;
//     handleSubmit({
//       name: petNameValue,
//       type: petTypeValue,
//       dob: petDOBValue,
//     });
//   });

const tabs = document.querySelectorAll(".navigation-tabs");

tabs?.forEach((tab) => {
  tab.addEventListener("pointerdown", () => {
    tab.setAttribute("active", "true");
    tabs.forEach((prevTab) => {
      if (prevTab !== tab) prevTab.removeAttribute("active");
    });
  });
});
