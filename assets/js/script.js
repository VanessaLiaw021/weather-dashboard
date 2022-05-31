//When the page load, the document is ready to run the function 
$(document).ready(function() {

    //Function that will create an li element and append it to ul 
    function appendElement(cities) {

        //Grab the ul element in html 
        var ulElement = $(".list-searches");

        //Create an li element to append to ul 
        var createLiElement = document.createElement("li");

        //Append the user input to the li element 
        createLiElement.textContent = cities;

        //Append the li element to the ul element
        ulElement.append(createLiElement);
    }
});