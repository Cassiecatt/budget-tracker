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
    // checkDatabase();
  }
};

request.onerror = function (e) {
  console.log(e.target.errorCode);
};
