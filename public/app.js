handleRegistrationSubmit();
getUrlParams();
handleLoginSubmit();

const FITBIT_CODE_URL = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22CV92&redirect_uri=https%3A%2F%2Fmotivatr1.herokuapp.com%2F&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=8645000';
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
                console.log(res);
                localStorage.setItem('token', res.user.token);
                //loginRedirect(res);
            }
            if(res.redirect){
                document.location.href = res.redirect;
            }
        }); //if response has redirect object then redirec to provided endpoint.    
    });
}

function loginRedirect(res){
    if(res.redirect){
        document.location.href = res.redirect;
    }
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
    console.log(obj);
    fitbitAuthRequest(obj)
    });
};

function fitbitAuthRequest(obj){
    const request = {
        clientId: '22CV92',
        grant_type: 'authorization_code',
        redirect_uri: 'https://motivatr1.herokuapp.com/',
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