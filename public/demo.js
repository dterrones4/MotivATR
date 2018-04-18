main();

function main(){
    dropDowns();
    listenForFitbitCalls();
    storeMotivatrPhoneNumber();
    storeGoalTime();
}

$('#logout').on('click', function(){
    localStorage.clear();
    $.get('/');
    document.location.href = '/';
});

function dropDowns(){
	let coll = document.getElementsByClassName("collapsible");

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
        let coll = document.getElementsByClassName("collapsible");
		const container = coll.nextElementSibling;
		container.style.display = "none";
    });
};

function storeGoalTime(){
	$('#goalTime').on('submit', function(event){
        let coll = document.getElementsByClassName("collapsible");
		const container = coll.nextElementSibling;
		container.style.display = "none";
	});
};

/////Mock Data for Demo Mode/////

const goalsData = {
    activeMinutes: 120,
    calories: 3000,
    distance: 20,
    floors: 15,
    steps: 10000,
} 

const activeMinutesData = {
    sendentaryMinutes: 320,
    lightlyActiveMinutes: 150,
    fairlyActiveMinutes: 110,
    veryActiveMinutes: 60,
}

const activityData = {
    activeMinutes: 100,
    distance: 22,
    elevation: 20,
    floors: 16,
    steps: 9234,
    calories: 2567
}
////////////////////////////////

function listenForFitbitCalls(){
    getFitbitHearRateData();
	getFitBitCurrentGoalsStatus();
	getFitbitActivityData();
}

function getFitbitActivityData(){
    $('#barGraph').on('click', function(event){
        populateBarGraph(activityData);
		updateUserGoals(goalsData);
    });
};

function getFitbitHearRateData(){
    $('#heartRate').on('click', function(event){
        populatePieGraph(activeMinutesData);
		updateUserGoals(goalsData);
    });
};

function getFitBitCurrentGoalsStatus(){
    $('#currentGoals').on('click', function(event){
        populateGoalsStatusGraph(goalsData, activityData);
		updateUserGoals(goalsData);
    });
}

function populateBarGraph(data){
	$('#graphs').removeClass('hidden');
	$('#graphContainer').remove();
	$('#graphContainer2').remove();
	$('#graphs').append('<canvas id="graphContainer"></canvas>');

	let ctx = document.getElementById('graphContainer').getContext('2d');
	let chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'bar',
				
		// The data for our dataset
		data:{
			labels: ['steps', 'calories'],
			datasets: [{
				label: 'Todays Progress',
				backgroundColor: ["#3e95cd", "#8e5ea2"],
				data: [data.steps, data.calories]
			}]   
		},
				
		// Configuration options go here
		options: {           
			responsive:true,
			maintainAspectRatio: false
		}
	});

	$('#graphs').append('<canvas id="graphContainer2"></canvas>');
	let ctx2 = document.getElementById('graphContainer2').getContext('2d');
	let chart2 = new Chart(ctx2, {
		// The type of chart we want to create
		type: 'bar',
				
		// The data for our dataset
		data: {
			labels: ["Active Minutes", "Distance(Km)", "Floors"],
			datasets: [{
				label: ["Todays Progress"],
				backgroundColor: ["#3cba9f","#e8c3b9", "#c45850"],
				data: [data.activeMinutes, data.distance, data.floors]
			}]
			},
		options: {
			responsive:true,
			maintainAspectRatio: false,
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
	let chart2 = new Chart(ctx2, {
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