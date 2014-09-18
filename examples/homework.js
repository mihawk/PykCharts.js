var options = {
                optional:{
                    chart: {
                        height: 500,
                        width: 500
                    },
                    title: {
                        text: "Malnutrition in India",
                    },
                    subtitle: {
                        text: "Malnutrition in India Malnutrition in India Malnutrition in India Malnutrition in India"
                    },
                    units : {
                        prefix: "Rs. ", // NA in this JSON data, but just for the moment applying it
                        suffix: "/-" // NA in this JSON data, but just for the moment applying it
                    },
                    dataSource:{
                        text: "World Bank",
                        url: "http://www.pykih.com/"
                    },
                    realTimeCharts: {
                        "refreshFrequency": 0
                    },
                    transition: {
                        duration: 1000
                    },
                    label:{ //partially done for oneD, pending for twoD
                      size: "13",
                      color: "white",
                      weight: "thin",
                      family: "'Helvetica Neue',Helvetica,Arial,sans-serif"
                    },
                    colors:{
                        backgroundColor: "white",
                        // chartColor: "steelblue"
                    },
                    zoom : {
                        enable : "yes"
                    },
                    borderBetweenChartElements : {
                        width: "1px", // if width is 0 means it is disabled.
                        color: "white",
                        style: "solid" // could be dotted too
                    },
                    loading: {
                      animationGifUrl: "../img/preloader.gif"

                    }
                }
            };

var calculation = function (options) {
	var obj = document.getElementById("object").value;
	var value = document.getElementById("value").value;	
	var objLength = obj.lenght;
	var arr = [];
	var k = 0;
	arr = obj.split(".");
	console.log(arr);
	// for(var i = 0; i < objLength ; i++) {
	// 	if(charAt(i) === ".") {
	// 		arr[k] = 
	// 	}
	// }

}

calculation (options);