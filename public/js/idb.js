//varable that holds db connection
let db;
//establish connection to indexedDB
const request = indexedDB.open("budget", 1);

//this event will emit if the DB version changes
request.onupgradeneeded = function (e) {
  //save a reference to the DB
  const db = e.target.result;
  //create an object store (table)
  db.createObjectStore("new_budget", { autoIncrement: true });
};
