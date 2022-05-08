// App Elements

const list = document.getElementById("list");
const addItemList = document.getElementById("add-item-list");
const itemText = document.getElementById("item-text");
const messages = document.getElementById("messages");

// Back End URL

const serverUrl = "https://fetchcat.ca/api/glajs/items";

// Imported Libraries

const axios = require("axios");

// Stylesheets

import "./style.scss";

// Initialize state

let groceries = [];
let isPopulated = false;

// Reformats string to capitalize first letter

function formatString(string) {
  if (typeof string !== "string") {
    return "Not a string!";
  }
  const lowerCaseAll = string.toLowerCase();
  const capFirst = lowerCaseAll.charAt(0).toUpperCase() + lowerCaseAll.slice(1);
  return capFirst;
}

// Handle Error

function handleError(error) {
  list.innerHTML =
    '<div class="error-message">Error establishing database connection</div>';
  console.error(error);
}

// Creates nice message for user on error

function generateMessage(msg) {
  if (typeof msg !== "string") {
    return;
  }
  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add("start");
  setTimeout(() => {
    div.classList.add("saved");
    itemText.classList.add("error");
  }, 50);
  setTimeout(() => {
    div.innerText = msg;
  }, 500);
  setTimeout(() => {
    div.innerText = "";
  }, 2000);
  setTimeout(() => {
    div.classList.remove("saved");
    itemText.classList.remove("error");
    itemText.value = "";
  }, 2500);
  messages.appendChild(div);
}

// Fetch request to MongoDB for grocery items

function fetchGroceries() {
  axios
    .get(serverUrl)
    .then((res) => {
      res.data.forEach((item) => groceries.push(item));
      populateList();
      isPopulated = true;
    })
    .catch((error) => handleError(error));
}

// Add grocery to database, generates error message if blank

function addGrocery() {
  // Checks to see if it is populated and db accessed first
  if (isPopulated === false) {
    return;
  }
  const itemName = formatString(itemText.value);
  if (itemName.length <= 0) {
    generateMessage("Item name cannot be blank");
    return;
  }
  if (groceries.filter((e) => e.name === itemName).length > 0) {
    generateMessage("Item already exists");
    return;
  }
  let newItem = {
    name: itemName,
  };
  axios
    .post(serverUrl, {
      body: newItem,
      headers: { "Content-Type": "application/json" },
    })
    .then(() => {
      (groceries = []), fetchGroceries();
    })
    .catch((error) => handleError(error));
  itemText.value = "";
}

// Removes grocery from database

function deleteGrocery(e) {
  const delItem = e.target.closest(".item");
  const id = {
    _id: delItem.id,
  };
  axios
    .delete(serverUrl, {
      data: id,
      headers: { "Content-Type": "application/json" },
    })
    .then(() => {
      groceries = [];
      fetchGroceries();
    })
    .catch((error) => handleError(error));
  delItem.innerText = "";
  setTimeout(() => {
    delItem.classList.remove("saved");
  }, 200);
}

function populateList() {
  // Clears list and starts fresh
  list.innerHTML = "";
  list.classList.remove("saved");
  setTimeout(() => {
    if (groceries.length === 0) {
      list.innerHTML = "No Items to display";
      return;
    }
    const alphaList = groceries.sort((a, b) => {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    // Sort groceries alphabetically and add to app

    alphaList.forEach((item, index) => {
      setTimeout(() => {
        const div = document.createElement("div");
        const id = item._id.toString();
        div.innerHTML = `
        <div id=${id} class='item saved'>
          ${item.name}
          <button class='delete'>
            <i class='fas fa-check-square'></i>
          </button>
        </div>
      `;
        list.appendChild(div);
        const deleteButton = div.querySelector("button.delete");
        deleteButton.addEventListener("click", deleteGrocery);
      }, 50 * (index + 1));
    });
  }, 50);
}

// Get grocery list items

fetchGroceries();

// Click on Add button or press Enter key to add item

addItemList.addEventListener("click", addGrocery);

window.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addGrocery();
  }
});
