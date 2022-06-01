//When the page load, the document is ready to run the function 
$(document).ready(function() {

    //API Key to get use the OpenWeatherAPI
    var apiKey = "f8bd4d0f6f0c65783299bae01aa1f960";

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

    //Function that will display the current weather 
    function displayCurrentWeather() {

        //Get the value of the user input 
        var userInput = $("#search-text").val();

        //Variable that get the weahter api 
        var fetchAPI = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${apiKey}`;

        //Fetch the url and use the weather api
        $.ajax({

            //Get the url of the API 
            url: fetchAPI,

            //Get the method of the url 
            method: "GET",

        }).then(function(response) {

            //Variable that get each of the required content  
            var cityName = response.name;
            var date = moment.unix(response.main.dt).format("M/D/YYYY");
            var weatherIcon = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
            var temperature = response.main.temp;
            var humidityLevel = response.main.humidity;
            var windSpeed = response.wind.speed;

            //Convert the temp from kelvin to farhenheit 
            var convertTemp = ((temperature - 273.15) * (9/5) + 32).toFixed(2);

            //Remove the invisible class when button is clicked 
            $(".current").removeClass("invisible");

            //Display the variable onto the html page 
            $("#current-day").text(cityName + " (" + date + ")");
            $("#current-img").attr("src", weatherIcon);
            $("#current-temp").text("Temperature: " + convertTemp + " \u2109");
            $("#current-humidity").text("Humidity: " + humidityLevel + "%");
            $("#current-wind").text("Wind: " + windSpeed + " MPH");

            //Variable that get the latitude and longitude to get the UV index
            var latitude = response.coord.lat;
            var longitude = response.coord.lon; 

            //Variable that get the UV index in weather api 
            var fetchUvIndex = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}4&exclude=hourly,daily&appid=${apiKey}`;

            //Fetch the url for uv index and used the weather api 
            $.ajax({

                //Get the url of the API
                url: fetchUvIndex,

                //Get the method of the url 
                method: "GET",

            }).then(function(response) {

                //Get the UV index based off of the latitude and longitude 
                var uvIndex = response.current.uvi;

                //Display the variable onto the html page
                $("#current-uv-index").html(`UV Index: <span class="color">${uvIndex}</span>`);

                //Determing that if the UX index is low, moderate, or high/extreme and set a color to each
                if (uvIndex < 2) {

                    //If UV index is below 2, it consider low
                    $(".color").css("background-color", "green");

                } else if (uvIndex <= 7 ) {

                    //If UV index is between 2 and 7, it is consider moderate
                    $(".color").css("background-color", "yellow");

                } else {

                    //If UV index is greater than 8 , it is consider high to extreme
                    $(".color").css("background-color", "red");
                }
            });

        });
    }

    //When user click on search button, it will display their recent searches that were inputted
    $("#search-button").on("click", function() {

        //Call the function to submit the search 
        handleSubmitButton();

        //Call the function to display the current weather
        displayCurrentWeather();
    });
});