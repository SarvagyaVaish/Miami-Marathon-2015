$( document ).ready(function() {

	usTopoJson = 0;
	halfMarathonData = 0;

	var width = 960,
	    height = 510;

	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	// Participation Heat Map
	d3.json("Maps/us.json", function(error, data) {
		if (error) return console.error(error);
		usTopoJson = data;

		// State features
		var states = topojson.feature(usTopoJson, usTopoJson.objects.states);

		// D3 projection
		// var projection = d3.geo.mercator()
		// 	.scale(50)
		// 	.translate([20, 20]);

		var projection = d3.geo.albersUsa();
			// .center([0, 0])
			// .rotate([4.4, 0])
			// .parallels([50, 60]);
			// .scale(6000)
			// .translate([width / 2, height / 2]);

		// D3 path
		var path = d3.geo.path().projection(projection);

		participationHeatMapIDPrefix = "heat-map-1-state-"
		participationHeatMapClass = "heat-map-1-state"

		// Create map elements
		svg.selectAll(".state")
			.data(states.features)
			.enter()
			.append("path")
			.attr("id", function(d) { return participationHeatMapIDPrefix + d.id})
			.attr("class", function(d) { return participationHeatMapClass })
			.attr("participant-count", 0)
			.attr("d", path);

		// Boundaries
		svg.append("path")
			.datum(topojson.mesh(usTopoJson, usTopoJson.objects.states, function(a, b) { return a !== b; }))
			.attr("d", path)
			.attr("class", "state-boundary");

		// Load half marathon data
		d3.json("Data/miami_half_data.json", function(error, data) {
			halfMarathonData = data;

			// Update the participation counts
			for (var i in halfMarathonData) {
				var participantData = halfMarathonData[i];
				var homeCity = participantData['home-city'];
				if (homeCity != 'None') {
					var stateId = parseInt(homeCity['numeric-code']);
					var stateTag = $("#" + participationHeatMapIDPrefix + stateId);
					var count = parseInt(stateTag.attr('participant-count')) + 1;
					stateTag.attr('participant-count', count);
				}
			}

			// Add a class based on the participation counts
			$("." + participationHeatMapClass).each(function() { 
				var count = parseInt($(this).attr("participant-count"));
				var previousClass = $(this).attr("class");
				if (count == 0) {
					$(this).attr("class", previousClass + " color-0");
				}
				else if (count <= 20) {
					$(this).attr("class", previousClass + " color-1");
				}
				else if (count <= 50) {
					$(this).attr("class", previousClass + " color-2");
				}
				else if (count <= 100) {
					$(this).attr("class", previousClass + " color-3");
				}
				else if (count <= 200) {
					$(this).attr("class", previousClass + " color-4");
				}
				else {
					$(this).attr("class", previousClass + " color-5");
				}
			});

		});

		// On hover 
		$(".heat-map-1-state").hover(
			function(){
				idStr = $(this).attr("id");
				id = parseInt(idStr.substring(participationHeatMapIDPrefix.length, idStr.length));
				console.log(id);
			}, 
			function(){
				console.log($(this).attr("id"));
			}
		);


	});

});