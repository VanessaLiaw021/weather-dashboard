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

    //Function that read the user input and stored it in local storage 
    function handleSubmitButton() {

        //Get the value of the user input 
        var userInput = $("#search-text").val();

        //Call the function recent searches to append it to the li element 
        appendElement(userInput);

        //Store the user cities input into an object 
        var searches = {
            cities: userInput
        }

        //Get the item in local storage and if not there create an empty array 
        var cityList = JSON.parse(localStorage.getItem("cityList")) || [];

        //Push the array if not in local storage 
        cityList.push(searches);

        //Set the key and value in local storage 
        localStorage.setItem("cityList", JSON.stringify(cityList));
    }

    //Function that will get the item from local storage and save it on the html page 
    function displayFromLocalStorage() {

        //Get the item in local storage and if not there create an empty array 
        var cityList = JSON.parse(localStorage.getItem("cityList")) || [];

        //Loop through each city that is inputted, display it, and save it on the html when page load
        cityList.forEach(function(city) {

            //Call the recent searches function to display it on the li element and save it to html page
            appendElement(city.cities);
        });
    }

    //Call the function to display from local storage and save it 
    displayFromLocalStorage();

    //When user click on search button, it will display their recent searches that were inputted
    $("#search-button").on("click", function() {

        //Call the function to submit the search 
        handleSubmitButton();
    });
});