handleStart();

const FITBIT_AUTH_URL = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22CV92&redirect_uri=https%3A%2F%2Fmotivatr1.herokuapp.com%2F&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=8645000'


let MOCK_USER = {
    name: 'Daniel Terrones',
    id: 1,
    motivatr_num: 8057177823,
    auth_token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzWTY4OVQiLCJhdWQiOiIyMkNWOTIiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJudXQgcnBybyByc2xlIiwiZXhwIjoxNTIxMTgyMjU1LCJpYXQiOjE1MjExNTM0NTV9.iQyE2SSeByyARxINKpUkYCAZPc72rncUs5vC0q5NZfg',
    refresh_token: '79449f97c7219df9ba4104bd7d2349aef494321aff543bbde03b3150d9653847'
}

function handleStart(){
    $('.js-start').on('click', function(event){
        event.preventDefault();
        getFitBitSteps()
    })
}

const fitbit_steps_endpoint = `https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json`
function getFitBitSteps(callback){
    console.log(MOCK_USER.auth_token);
    $.ajax({
        url: fitbit_steps_endpoint,
        headers: {Authorization: `Bearer ${MOCK_USER.auth_token}`},
        type: 'GET',
        dataType: 'json', 
    }).done(data => console.log(data));
}