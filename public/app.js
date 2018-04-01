handleRegistrationSubmit();
getUrlParams();
handleLoginSubmit();
listenForFitbitCalls();

const FITBIT_AUTH_URL = 'https://api.fitbit.com/oauth2/token';

$('.btn').on('click', function () {
    $('.form').addClass('form--no');
});

$('#register').on('click', function(){
    $('#registrationForm').removeClass('hidden');
    $('#loginForm').addClass('hidden');
});

$('#login').on('click', function(){
    $('#registrationForm').addClass('hidden');
    $('#loginForm').removeClass('hidden');
});

function handleRegistrationSubmit(){
    $('#registrationForm').on('submit', function(event){
        event.preventDefault();
        let username = document.getElementById("username").value;
        let phoneNumber = document.getElementById("phoneNumber").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        const data = {
            username: username,
            phoneNumber: phoneNumber,
            email: email,
            password: password
        };
        const form = document.getElementById('registrationForm');
        form.reset();
        newUserPostRequest(data)
    })
}

function handleLoginSubmit(){
    $('#loginForm').on('submit', function(event){
        event.preventDefault();
        const data = {
            email: document.getElementById("loginEmail").value,
            password: document.getElementById('loginPassword').value
        }
        $.post("/api/users/login", data).done(res => {
            if(res.user.token){
                localStorage.setItem('token', res.user.token);
                localStorage.setItem('id', res.user.id);
            }
            //if response has a redirect object redirect to that page
            if(res.redirect){
                document.location.href = res.redirect;
            }
        }); 
    });
}

function newUserPostRequest(data){
    $.post("/api/users", data)
}

function getUrlParams(url){
    $('#UrlParams').on('click', function(event){
        // get query string from url (optional) or window
        let queryString = url ? url.split('?')[1] : window.location.search.slice(1); //req.query

        // we'll store the parameters here
        let obj = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            var arr = queryString.split('&');

            for (var i=0; i<arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function(v) {
                paramNum = v.slice(1,-1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof(a[1])==='undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                // put the value on the end of the array
                obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                // put the value at that index number
                obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
            }
        }
    const data = {
        code: obj.code,
        token: localStorage.getItem('token'),
        id: localStorage.getItem('id')
    };
    
    $.post('/api/user/fitbitAuthToken', data).done(res => {
        if(res.redirect){
            document.location.href = res.redirect;
            }
        });
    });
};

function fitbitAuthRequest(obj){
    const request = {
        clientId: '22CV92',
        grant_type: 'authorization_code',
        redirect_uri: 'localhost:8080/api/user/home',
        code: obj.code
    }
    const headers = {
        "Authorization": "Basic MjJDVjkyOjQ5MWZkZTI3MzgzMDZjMTUxOTU0NzVkMzI0Yzg3ZTU1",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    $.ajax({
        url: FITBIT_AUTH_URL,
        type: 'POST',
        data: request,
        headers: headers,
    }).done(data => console.log(data));
};

function listenForFitbitCalls(){
    getFitbitHearRateData();
    getFitBitCurrentGoalsStatus();
    getFitbitActivityData();
}

function getFitbitActivityData(){
    $('#barGraph').on('click', function(event){

        const data = {
            id: localStorage.getItem('id')
        }

        $.post("/api/user/home", data).done(res => {
            console.log(res);
            const activityData = {
                distance: res.summary.distances[0].distance,
                elevation: res.summary.elevation,
                floors: res.summary.floors,
                steps: res.summary.steps,
                calories: res.summary.caloriesOut        
            }
            const goalsData = {
                activeMinutes: res.goals.activeMinutes,
                calories: res.goals.caloriesOut,
                distance: res.goals.distance,
                floors: res.goals.floors,
                steps: res.goals.steps
            }
            populateBarGraph(activityData);
            updateUserGoals(goalsData);

        });
    });      
};

function getFitbitHearRateData(){
    $('#heartRate').on('click', function(event){

        const data = {
            id: localStorage.getItem('id')
        }

        $.post("/api/user/home", data).done(res => {
            const goalsData = {
                activeMinutes: res.goals.activeMinutes,
                calories: res.goals.caloriesOut,
                distance: res.goals.distance,
                floors: res.goals.floors,
                steps: res.goals.steps
            }
            const activeMinutesData = {
                sendentaryMinutes: res.summary.sedentaryMinutes,
                lightlyActiveMinutes: res.summary.lightlyActiveMinutes,
                fairlyActiveMinutes: res.summary.fairlyActiveMinutes,
                veryActiveMinutes: res.summary.veryActiveMinutes
            }
            populatePieGraph(activeMinutesData);
            updateUserGoals(goalsData);
        });
    });      
};

function getFitBitCurrentGoalsStatus(){
    $('#currentGoals').on('click', function(event){
        const data = {
            id: localStorage.getItem('id')
        }

        $.post("/api/user/home", data).done(res => {
            const goalsData = {
                activeMinutes: res.goals.activeMinutes,
                calories: res.goals.caloriesOut,
                distance: res.goals.distance,
                floors: res.goals.floors,
                steps: res.goals.steps
            }
            const activityData = {
                distance: res.summary.distances[0].distance,
                elevation: res.summary.elevation,
                floors: res.summary.floors,
                steps: res.summary.steps,
                calories: res.summary.caloriesOut        
            }
            populateGoalsStatusGraph(goalsData, activityData);
            updateUserGoals(goalsData);
        });
    });      
};


///CHARTS.JS////////
//chartjs.org for documentation
function populateBarGraph(data){
    $('#graphs').removeClass('hidden');
    $('#graphContainer').remove();
    $('#graphs').append('<canvas id="graphContainer"></canvas>');

    var ctx = document.getElementById('graphContainer').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        
        // The data for our dataset
        data:{
            labels: ['elevation', 'floors', 'steps', 'calories'],
            datasets: [{
                label: 'Todays Progress',
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                data: [data.elevation, data.floors, data.steps, data.calories]
            }]   
        },
        
        // Configuration options go here
        options: {           
            responsive:true,
            maintainAspectRatio: false
        }
    });
}

function populatePieGraph(data){
    $('#graphs').removeClass('hidden');
    $('#graphContainer').remove();
    $('#graphs').append('<canvas id="graphContainer"></canvas>');

    var ctx = document.getElementById('graphContainer').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',
        
        // The data for our dataset
        data: {
            labels: ["Out of Range(30-94bpm)", "Fat Burn(94-134bpm)", "Cardio(131-159bpm)", "Peak(159-220bpm)"],
            datasets: [
              {
                label: "Activity Breakdown(minutes)",
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
                data: [data.sendentaryMinutes, data.lightlyActiveMinutes,
                    data.fairlyActiveMinutes, data.veryActiveMinutes]
              }
            ]
          },
          options: {
            responsive:true,
            maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Heart Rate Breakdown (minutes)',
            }
          }
    });
}

function populateGoalsStatusGraph(goals, progress){
    $('#graphs').removeClass('hidden');
    $('#graphContainer').remove();
    $('#graphs').append('<canvas id="graphContainer"></canvas>');

    var ctx = document.getElementById('graphContainer').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',
        
        // The data for our dataset
        data: {
            labels: ["Active Minutes", "Calories", "Distance", "Floors", 'Steps'],
            datasets: [
              {
                label: ["Daily Goals"],
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9", "#c45850"],
                data: [goals.activeMinutes, goals.calories, goals.distance, goals.floors, goals.steps]
              },
              {
                  label: ["Current Progress"],
                  backgroundColor: [],
                  data: [progress.activeMinutes, progress.calories, progress.distance, progress.floors, progress.steps]
              }
            ]
          },
          options: {
            responsive:true,
            maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Current Goals Completion Status',
            },
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: true }]
            }
          }
    });

}

function updateUserGoals(data){
    $("ul").empty();
    const ul = document.getElementById('goalsList');

    if(data.steps){
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(`Steps: ${data.steps}`));
        ul.appendChild(li);
    }
    if(data.calories){
        let li2 = document.createElement('li');
        li2.appendChild(document.createTextNode(`Calories: ${data.calories}`));
        ul.appendChild(li2);
    }
    if(data.activeMinutes){
        let li3 = document.createElement('li');
        li3.appendChild(document.createTextNode(`Active Minutes: ${data.activeMinutes}`));
        ul.appendChild(li3);
    }
    if(data.distance){
        let li4 = document.createElement('li');
        li4.appendChild(document.createTextNode(`Distance: ${data.distance}`));
        ul.appendChild(li4);
    }
    if(data.floors){
        let li5 = document.createElement('li');
        li5.appendChild(document.createTextNode(`Floors: ${data.floors}`));
        ul.appendChild(li5);
    }
}