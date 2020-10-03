//varable that holds db connection
let db;
//establish connection to indexedDB
const request = indexedDB.open("budget", 1);

//this event will emit if the DB version changes
request.onupgradeneeded = function (e) {
  //save a reference to the DB
  let db = e.target.result;
  //create an object store (table)
  db.createObjectStore("newBudget", { autoIncrement: true });
};

//successful
request.onsuccess = function (e) {
  //when db is successfully created with its object store - save reference to db in global variable
  db = e.target.result;

  //check if app is online
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (e) {
  console.log(e.target.errorCode);
};

//Execute function if attempt to submit new budget and there's no internet connection
function saveRecord(record) {
  //open new transaction with db with read / write permissions
  const transaction = db.transaction(["newBudget"], "readwrite");
  //access the objet store for 'newBudget'
  const store = transaction.objectStore("newBudget");
  //add record to store with add method
  store.add(record);
}

function checkDatabase() {
  //open a transaction on the db
  const transaction = db.transaction(["newBudget"], "readwrite");
  //access object store
  const store = transaction.objectStore("newBudget");
  //get all records from store and set to a variable
  const getAll = store.getAll();

  //upon a successful getAll execution, run this function
  getAll.onsuccess = function () {
    //if there was data in indexedDB store, send to api server
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverReponse) => {
          if (serverReponse.message) {
            throw new Error(serverResponse);
          }
          //open another transaction
          const transaction = db.transaction(["newBudget"], "readwrite");
          //access the newBudget object store
          const store = transaction.objectStore("newBudget");
          //clear all items in store
          store.clear();

          alert("All saved transactions have been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

//listen for app coming back online
window.addEventListener("online", checkDatabase);
