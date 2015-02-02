$( document ).ready(function() {

	stateCodes = {"1": {"name": "Alabama", "alpha-code": "AL", "numeric-code": 1},"2": {"name": "Alaska", "alpha-code": "AK", "numeric-code": 2},"60": {"name": "American Samoa", "alpha-code": "AS", "numeric-code": 60},"4": {"name": "Arizona", "alpha-code": "AZ", "numeric-code": 4},"5": {"name": "Arkansas", "alpha-code": "AR", "numeric-code": 5},"6": {"name": "California", "alpha-code": "CA", "numeric-code": 6},"8": {"name": "Colorado", "alpha-code": "CO", "numeric-code": 8},"9": {"name": "Connecticut", "alpha-code": "CT", "numeric-code": 9},"10": {"name": "Delaware", "alpha-code": "DE", "numeric-code": 10},"11": {"name": "District of Columbia", "alpha-code": "DC", "numeric-code": 11},"12": {"name": "Florida", "alpha-code": "FL", "numeric-code": 12},"64": {"name": "Federated States of Micronesia", "alpha-code": "FM", "numeric-code": 64},"13": {"name": "Georgia", "alpha-code": "GA", "numeric-code": 13},"66": {"name": "Guam", "alpha-code": "GU", "numeric-code": 66},"15": {"name": "Hawaii", "alpha-code": "HI", "numeric-code": 15},"16": {"name": "Idaho", "alpha-code": "ID", "numeric-code": 16},"17": {"name": "Illinois", "alpha-code": "IL", "numeric-code": 17},"18": {"name": "Indiana", "alpha-code": "IN", "numeric-code": 18},"19": {"name": "Iowa", "alpha-code": "IA", "numeric-code": 19},"20": {"name": "Kansas", "alpha-code": "KS", "numeric-code": 20},"21": {"name": "Kentucky", "alpha-code": "KY", "numeric-code": 21},"22": {"name": "Louisiana", "alpha-code": "LA", "numeric-code": 22},"23": {"name": "Maine", "alpha-code": "ME", "numeric-code": 23},"68": {"name": "Marshall Islands", "alpha-code": "MH", "numeric-code": 68},"24": {"name": "Maryland", "alpha-code": "MD", "numeric-code": 24},"25": {"name": "Massachusetts", "alpha-code": "MA", "numeric-code": 25},"26": {"name": "Michigan", "alpha-code": "MI", "numeric-code": 26},"27": {"name": "Minnesota", "alpha-code": "MN", "numeric-code": 27},"28": {"name": "Mississippi", "alpha-code": "MS", "numeric-code": 28},"29": {"name": "Missouri", "alpha-code": "MO", "numeric-code": 29},"30": {"name": "Montana", "alpha-code": "MT", "numeric-code": 30},"31": {"name": "Nebraska", "alpha-code": "NE", "numeric-code": 31},"32": {"name": "Nevada", "alpha-code": "NV", "numeric-code": 32},"33": {"name": "New Hampshire", "alpha-code": "NH", "numeric-code": 33},"34": {"name": "New Jersey", "alpha-code": "NJ", "numeric-code": 34},"35": {"name": "New Mexico", "alpha-code": "NM", "numeric-code": 35},"36": {"name": "New York", "alpha-code": "NY", "numeric-code": 36},"37": {"name": "North Carolina", "alpha-code": "NC", "numeric-code": 37},"38": {"name": "North Dakota", "alpha-code": "ND", "numeric-code": 38},"69": {"name": "Northern Mariana Islands", "alpha-code": "MP", "numeric-code": 69},"39": {"name": "Ohio", "alpha-code": "OH", "numeric-code": 39},"40": {"name": "Oklahoma", "alpha-code": "OK", "numeric-code": 40},"41": {"name": "Oregon", "alpha-code": "OR", "numeric-code": 41},"70": {"name": "Palau", "alpha-code": "PW", "numeric-code": 70},"42": {"name": "Pennsylvania", "alpha-code": "PA", "numeric-code": 42},"72": {"name": "Puerto Rico", "alpha-code": "PR", "numeric-code": 72},"44": {"name": "Rhode Island", "alpha-code": "RI", "numeric-code": 44},"45": {"name": "South Carolina", "alpha-code": "SC", "numeric-code": 45},"46": {"name": "South Dakota", "alpha-code": "SD", "numeric-code": 46},"47": {"name": "Tennessee", "alpha-code": "TN", "numeric-code": 47},"48": {"name": "Texas", "alpha-code": "TX", "numeric-code": 48},"74": {"name": "U.S. Minor Outlying Islands", "alpha-code": "UM", "numeric-code": 74},"49": {"name": "Utah", "alpha-code": "UT", "numeric-code": 49},"50": {"name": "Vermont", "alpha-code": "VT", "numeric-code": 50},"51": {"name": "Virginia", "alpha-code": "VA", "numeric-code": 51},"78": {"name": "Virgin Islands", "alpha-code": "VI", "numeric-code": 78},"53": {"name": "Washington", "alpha-code": "WA", "numeric-code": 53},"54": {"name": "West Virginia", "alpha-code": "WV", "numeric-code": 54},"55": {"name": "Wisconsin", "alpha-code": "WI", "numeric-code": 55},"56": {"name": "Wyoming", "alpha-code": "WY", "numeric-code": 56}};

	stateIdPrefix = "participation-heat-map-state-id-";
	stateClass = "participation-heat-map-state";

	var width = 960,
	    height = 530;

	var svg = d3.select("#participation-heat-map-div")
		.append("svg")
	    .attr("id", "participation-heat-map-svg")
	    .attr("width", width)
	    .attr("height", height);

	// Load US Topo Features
	d3.json("Maps/us.json", function(error, data) {
		if (error) return console.error(error);
		var usTopoJson = data;

		// State features
		var states = topojson.feature(usTopoJson, usTopoJson.objects.states);

		// Projection
		var projection = d3.geo.albersUsa();

		// Path
		var path = d3.geo.path().projection(projection);

		// Create state elements
		svg.selectAll(".state")
			.data(states.features)
			.enter()
			.append("path")
			.attr("id", function(d) { return stateIdPrefix + d.id})
			.attr("class", function(d) { return stateClass })
			.attr("participant-count", 0)
			.attr("d", path);

		// Boundaries
		svg.append("path")
			.datum(topojson.mesh(usTopoJson, usTopoJson.objects.states, function(a, b) { return a !== b || true; }))
			.attr("d", path)
			.attr("class", "state-boundary");

		// Load half marathon data
		d3.json("Data/miami_half_data.json", function(error, data) {
			halfMarathonData = data;
			halfMarathonDict = {} // data dict keyed on state id

			// Update the participation counts
			for (var i in halfMarathonData) {
				var participantData = halfMarathonData[i];
				var homeCity = participantData['home-city'];
				if (homeCity != 'None') {
					// increment participant count
					var stateId = parseInt(homeCity['numeric-code']);
					var stateTag = $("#" + stateIdPrefix + stateId);
					var count = parseInt(stateTag.attr('participant-count')) + 1;
					stateTag.attr('participant-count', count);

					// add participant to dict
					if (stateId in halfMarathonDict) {
						halfMarathonDict[stateId].push(participantData);
					}
					else {
						halfMarathonDict[stateId] = [participantData];
					}
				}
			}

			// Add a class based on the participation counts
			$("." + stateClass).each(function() { 
				var count = parseInt($(this).attr("participant-count"));
				var previousClass = $(this).attr("class");
				if (count == 0) {
					$(this).attr("class", previousClass + " blue-shade-0");
				}
				else if (count <= 20) {
					$(this).attr("class", previousClass + " blue-shade-1");
				}
				else if (count <= 40) {
					$(this).attr("class", previousClass + " blue-shade-2");
				}
				else if (count <= 80) {
					$(this).attr("class", previousClass + " blue-shade-3");
				}
				else if (count <= 120) {
					$(this).attr("class", previousClass + " blue-shade-4");
				}
				else if (count <= 160) {
					$(this).attr("class", previousClass + " blue-shade-5");
				}
				else if (count <= 200) {
					$(this).attr("class", previousClass + " blue-shade-6");
				}
				else if (count <= 500) {
					$(this).attr("class", previousClass + " blue-shade-7");
				}
				else {
					$(this).attr("class", previousClass + " blue-shade-8");
				}
			});

		});

		// On hover 
		$("." + stateClass).hover(
			function(){
				idStr = $(this).attr("id");
				id = parseInt(idStr.substring(stateIdPrefix.length, idStr.length));

				var stateName = stateCodes[id]["name"];
				var participantCount = 0;
				var averagePace = 0;
				
				if (id in halfMarathonDict) {
					participants = halfMarathonDict[id];
					for (var i in participants) {
						participant = participants[i];
						participantCount += 1;
						averagePace += participant["pace"];
					}
					averagePace = averagePace / participantCount;
					var mins = Math.floor(averagePace / 60);
					var secs = averagePace % 60;
					averagePace = mins.toFixed(0) + ":" + secs.toFixed(0);
				}

				$("#participation-heat-map-info #state-name").text(stateName);
				$("#participation-heat-map-info #participant-count").text(participantCount);
				$("#participation-heat-map-info #average-pace").text(averagePace);
			}, 
			function(){
			}
		);


	});

});