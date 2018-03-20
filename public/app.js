handleRegistrationSubmit();

const FITBIT_AUTH_URL = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22CV92&redirect_uri=https%3A%2F%2Fmotivatr1.herokuapp.com%2F&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=8645000';

function handleRegistrationSubmit(){
    $('.js-submit').on('submit', function(event){
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
        console.log(data);
        newUserPostRequest(data)
    })
}

function newUserPostRequest(data){
    $.post("/api/users", data)
}

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