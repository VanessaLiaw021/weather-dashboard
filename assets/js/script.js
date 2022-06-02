//When the page load, the document is ready to run the function 
$(document).ready(function() {

    //API Key to get use the OpenWeatherAPI
    var apiKey = "f8bd4d0f6f0c65783299bae01aa1f960";

    //Function that will create an li element and append it to ul 
    function appendElement(cities) {

        //Grab the ul element in html 
        var ulElement = $(".list-searches");

        //Create a element to make the search history clickable
        var createElement = $(`<button class=ulButton><li>${cities}</li></button>`);

        //Append the li element to the ul element
        ulElement.append(createElement);
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
            var date = moment.unix(response.dt).format("M/D/YYYY");
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

    //Function to display the next five day forecast 
    function displayNextFiveDay() {

        //Get the value of the user input 
        var userInput = $("#search-text").val();

        //Variable the get the weather api 
        var fetchFiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&units=imperial&appid=${apiKey}`;

        //Fetch the url for the next five day weather and use the weather api
        $.ajax({

            //Get the url of the API
            url: fetchFiveDayURL,

            //Get the method of the url 
            method: "GET",

        }).then(function(response) {

            //Display each weather icon for next 5 day  
            var weatherIconOne = `http://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`;
            var weatherIconTwo = `http://openweathermap.org/img/wn/${response.list[1].weather[0].icon}@2x.png`;
            var weatherIconThree = `http://openweathermap.org/img/wn/${response.list[2].weather[0].icon}@2x.png`;
            var weatherIconFour = `http://openweathermap.org/img/wn/${response.list[3].weather[0].icon}@2x.png`;
            var weatherIconFive = `http://openweathermap.org/img/wn/${response.list[4].weather[0].icon}@2x.png`;

            //Forecast 1 
            $(".date-one").text(moment().add(1, "d").format("M/D/YYYY"));
            $("#img1").attr("src", weatherIconOne);
            $(".day-one-temp").html("Temp: " + response.list[0].main.temp + " \u2109");
            $(".day-one-wind").html("Wind: " + response.list[0].wind.speed + " MPH");
            $(".day-one-humidity").html("Humidity: " + response.list[0].main.humidity + "%");

            //Forecast 2
            $(".date-two").text(moment().add(2, "d").format("M/D/YYYY"));
            $("#img2").attr("src", weatherIconTwo);
            $(".day-two-temp").html("Temp: " + response.list[1].main.temp + " \u2109");
            $(".day-two-wind").html("Wind: " + response.list[1].wind.speed + " MPH");
            $(".day-two-humidity").html("Humidity: " + response.list[1].main.humidity + "%");

            //Forecast 3
            $(".date-three").text(moment().add(3, "d").format("M/D/YYYY"));
            $("#img3").attr("src", weatherIconThree);
            $(".day-three-temp").html("Temp: " + response.list[2].main.temp + " \u2109");
            $(".day-three-wind").html("Wind: " + response.list[2].wind.speed + " MPH");
            $(".day-three-humidity").html("Humidity: " + response.list[2].main.humidity + "%");

            //Forecast 4
            $(".date-four").text(moment().add(4, "d").format("M/D/YYYY"));
            $("#img4").attr("src", weatherIconFour);
            $(".day-four-temp").html("Temp: " + response.list[3].main.temp + " \u2109");
            $(".day-four-wind").html("Wind: " + response.list[3].wind.speed + " MPH");
            $(".day-four-humidity").html("Humidity: " + response.list[3].main.humidity + "%");

            //Forecast 5
            $(".date-five").text(moment().add(5, "d").format("M/D/YYYY"));
            $("#img5").attr("src", weatherIconFive);
            $(".day-five-temp").html("Temp: " + response.list[4].main.temp + " \u2109");
            $(".day-five-wind").html("Wind: " + response.list[4].wind.speed + " MPH");
            $(".day-five-humidity").html("Humidity: " + response.list[4].main.humidity + "%");
        });
    }

    //When user click on search button, it will display their recent searches that were inputted
    $("#search-button").on("click", function() {

        //Call the function to submit the search 
        handleSubmitButton();

        //Call the function to display the current weather
        displayCurrentWeather();

        //Call the function to display the next five day weather
        displayNextFiveDay();
    });
});