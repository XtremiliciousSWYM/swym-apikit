const swapi = require("./index.js");

/***** Testing Starts Here *****/

/** Get/Generate RegID **/
/* swapi.generateUserIds().then((response) => {
    console.log(response)
}); */

/** Create Lists 
 * @param lname, endpoint of the request
 * @return (object), List Info
 * **/
/* swapi.createList({
    lname: "New Test List"
}).then((response) => {
    console.log(response)
}) */

/** Fetch Lists 
 * @return (object), Lists Info
 * **/
swapi.fetchLists().then((response) => {
    console.log(response)
})

/** Update List 
 * @param lname, endpoint of the request
 * @param lid, unique identifier of the list
 * @return (object), Lists Info
 * **/
/*  swapi.updateList({
    lname: "My SFL List",
    lid: "fdf248cf-2190-4c0b-9110-d4f644f9dec4",
    lnote: "Updated!"
 }).then((response) => {
    console.log(response)
}) */

