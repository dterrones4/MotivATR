const FITBIT_AUTH_URL = 'https://api.fitbit.com/oauth2/token';
main();

function main(){
	handleRegistrationSubmit();
	getUrlParams();
	handleLoginSubmit();
	listenForFitbitCalls();
	dropDowns();
	storeMotivatrPhoneNumber();
	storeGoalTime();
	eventListener();
}

$().ready(function(){
	$('#registrationForm').validate({
		rules:{
			password: {
				required: true,
				minlength: 6
			},
			confirm_password: {
				required: true,
				minlength: 6,
				equalTo: '#password'
			},
			phoneNumber: {
				minlength: 10
			}
				},
		messages: {
			password: {
				required: 'Please provide a password',
				minlenght: 'Your password must be at least 6 characters long'
			},
			confirm_password: {
				required: 'Please provide a password',
				minlength: 'Your password must be at least 6 chracters long',
				equalTo: 'Your passwords do not match'
			},
			phoneNumber: {
				minlength: 'Please include area-code (###-###-####)',
				required: 'Please enter a phone number (###-###-####)'
			},
			email: {
				email: 'Please enter a valid Email (yourname@email.com)',
				required: 'Please enter a valid email'
			}
		}
	});
});

function eventListener(){
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
		$('#loginForm').validate({
			rules:{
				password: {
					required: true,
					minlength: 6
					}
			},
			messages: {
				password: {
					required: 'Please provide a password',
					minlenght: 'Your password must be at least 6 characters long'
				},
				email: {
					email: 'Please enter a valid Email (yourname@email.com)',
					required: 'Please enter a valid email'
				}
			}
		});
	});
		
	$('#logout').on('click', function(){
		localStorage.clear();
		$.get('/');
		document.location.href = '/';
	});
};

function handleRegistrationSubmit(){
	$('#registrationForm').on('submit', function(event){
		event.preventDefault();
		let phoneNumber = document.getElementById("phoneNumber").value;
		let email = document.getElementById("email").value;
		let password = document.getElementById("password").value;
		const data = {
			phoneNumber: phoneNumber,
			email: email,
			password: password
		};
		const form = document.getElementById('registrationForm');    
		newUserPostRequest(data);
		});
}

function newUserPostRequest(data){
	$.post("/api/users", data)
		.done(res => {
			$('#registrationForm').addClass('hidden');
			$('#loginForm').removeClass('hidden');            
	}).fail(err => {
			console.log(err);
			$('#registrationForm').append(`<p>${err.message}</p>`);
	});
};

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
		})
		.fail(err => {
			console.log(err);
			$('#loginForm').append('<p class=\'error\'>Invalid Email or Password<p>');
		});
	});
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
		redirect_uri: 'https://motivatr1.herokuapp.com/api/user/fitbitAuthToken',
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
	});
};

function dropDowns(){
	var coll = document.getElementsByClassName("collapsible");

	for(let i = 0; i < coll.length; i++) {
		for (i = 0; i < coll.length; i++) {
			coll[i].addEventListener("click", function() {
				this.classList.toggle("active");
				var content = this.nextElementSibling;
				if (content.style.display === "block") {
					content.style.display = "none";
				} 
				else {
					content.style.display = "block";
				};
			});
		};
	};
	$('#timePicker').timepicker();
};

function storeMotivatrPhoneNumber(){
	$('#motivatrPhoneNum').on('submit', function(event){
		event.preventDefault();
		data = {
			motivatrPhoneNumber: document.getElementById('motivatrPhoneNumber').value,
			id: localStorage.getItem('id')
		}
		$.ajax({
			url: '/api/user',
			type: 'PUT',
			data: data,
		})
		.done(res =>{
			//console.log(res);
		});
	});
}

function storeGoalTime(){
	$('#goalTime').on('submit', function(event){
		event.preventDefault();
		data = {
			goalTime: document.getElementById('timePicker').value,
			id: localStorage.getItem('id')
		}
		$.ajax({
			url: '/api/user',
			type: 'PUT',
			data: data,
		})
		.done(res =>{
			//console.log(res);
		})
	});
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
	$('#graphContainer2').remove();
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
};

function populatePieGraph(data){
	$('#graphs').removeClass('hidden');
	$('#graphContainer').remove();
	$('#graphContainer2').remove();
	$('#graphs').append('<canvas id="graphContainer"></canvas>');

	let ctx = document.getElementById('graphContainer').getContext('2d');
	let chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'pie',
				
		// The data for our dataset
		data: {
			labels: ["Out of Range(30-94bpm)", "Fat Burn(94-134bpm)", "Cardio(131-159bpm)", "Peak(159-220bpm)"],
			datasets: [{
				label: "Activity Breakdown(minutes)",
				backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
				data: [data.sendentaryMinutes, data.lightlyActiveMinutes,
							data.fairlyActiveMinutes, data.veryActiveMinutes]
			}]
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
};

function populateGoalsStatusGraph(goals, progress){
	$('#graphs').removeClass('hidden');
	$('#graphContainer').remove();
	$('#graphContainer2').remove();
	$('#graphs').append('<canvas id="graphContainer"></canvas>');

	let ctx = document.getElementById('graphContainer').getContext('2d');
	let chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'horizontalBar',
				
		// The data for our dataset
		data: {
			labels: ["Calories", "Steps"],
			datasets: [{
				label: ["Daily Goal"],
				backgroundColor: ["#e8c3b9", "#c45850"],
				data: [goals.calories, goals.steps]
			},
			{
				label: ["Current Progress"],
				backgroundColor: [],
				data: [progress.calories, progress.steps]
			}]
		},
		options: {
			responsive:true,
			maintainAspectRatio: false,
			title: {
				display: true,
				text: 'Current Goals Completion Status(Steps & Calories)',
			}
		}
	});

	$('#graphs').append('<canvas id="graphContainer2"></canvas>');
	let ctx2 = document.getElementById('graphContainer2').getContext('2d');
	let chart = new Chart(ctx2, {
		// The type of chart we want to create
		type: 'horizontalBar',
				
		// The data for our dataset
		data: {
			labels: ["Active Minutes", "Distance", "Floors"],
			datasets: [{
				label: ["Daily Goal"],
				backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9", "#c45850"],
				data: [goals.activeMinutes, goals.distance, goals.floors]
			},
			{
				label: ["Current Progress"],
				backgroundColor: [],
				data: [progress.activeMinutes, progress.distance, progress.floors]
			}]
			},
		options: {
			responsive:true,
			maintainAspectRatio: false,
			title: {
				display: true,
				text: 'Current Goals Completion Status (Active Minutes, Distance & Floors)',
			}
		}
	});
};

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
};