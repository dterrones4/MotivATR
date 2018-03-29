handleRegistrationSubmit();
getUrlParams();
handleLoginSubmit();
displayGraph();

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
    console.log(data);
    
    $.post('/api/user/fitbitAuthToken', data)
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

//const fitbit_steps_endpoint = `https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json`
//function getFitBitSteps(callback){
  //  console.log(MOCK_USER.auth_token);
    //$.ajax({
      //  url: fitbit_steps_endpoint,
        //headers: {Authorization: `Bearer ${MOCK_USER.auth_token}`},
        //type: 'GET',
        //dataType: 'json', 
    //}).done(data => console.log(data));
//}


///TAUCHARTS////////

const testData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
        label: 'Steps Taken Per Day',
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: [9000, 8700, 10000, 12000, 9375, 8123, 7243]
    }]   
};

//chartjs.org for documentation
function displayGraph(){
    $('#barGraph').on('click', function(event){
        $('#graphs').removeClass('hidden');
        Chart.defaults.global.defaultFontFamily = 'Merriweather', 'serif';
        var ctx = document.getElementById('barChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',
            
            // The data for our dataset
            data: testData,
            
            // Configuration options go here
            options: {}
        });
        var ctx2 = document.getElementById('doughnutChart').getContext('2d');
        var chart2 = new Chart(ctx2, {
            // The type of chart we want to create
            type: 'pie',
            
            // The data for our dataset
            data: {
                labels: ["Out of Range(30-94bpm)", "Fat Burn(94-134bpm)", "Cardio(131-159bpm)", "Peak(159-220bpm)"],
                datasets: [
                  {
                    label: "Hear Rate Breakdown (minutes)",
                    backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
                    data: [200,156,60,15]
                  }
                ]
              },
              options: {
                title: {
                  display: true,
                  text: 'Heart Rate Breakdown',
                }
              }
        });
    });
};	
