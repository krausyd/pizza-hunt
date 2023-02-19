// create variable that holds connection to indexeddb
let db;
//establish connection to indexeddb database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

//this will be executed when the version of the database changes (non existant to 1, 1 to 2, and so on)
request.onupgradeneeded = function(e) {
    //save a reference to the database
    const db = e.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

//this will be executed when the connection to the db succeeds
request.onsuccess = function(e) {
    // save the reference into the global db variable that we are using
    db = e.target.result;
    // check if the app is online, if yes, we need to upload the pizza to send the local stored to api
    if (navigator.onLine) {
        uploadPizza();
    }
};

request.onerror = function(e) {
    console.log(e.target.errorCode);
};

// Function to store a pizza into the indexedDB when there is no internet connection
function saveRecord(record) {
    // open a transaction with the database, for read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');
    
    //access the object store for new_pizza
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    
    //add the record to the object store
    //add the record to the object store
    var request = pizzaObjectStore.add(record);
    request.onsuccess = function(e) {
        console.log('Stored in local storage, as offline')
    };
}

function uploadPizza() {
    // open a transaction with the database, for read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the object store for pizzas that are locally stored
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();
    
    //getall is asynchronous, so we need to handle it when successful
    getAll.onsuccess = function() {
        //if there was data, we need to send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse.message);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                //access the object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                //clear all the items in store, we don't want to double save
                pizzaObjectStore.clear();

                alert('All locally saved pizzas have been submitted! Thanks!');
            }).catch(err => {
                console.log(err);
            });
        }
    };

}