var casper = require('casper').create({
    viewportSize: {
        width: 160,
        height: 160
    }
});

var theme_list = ["Default","Dusk","Lagoon","Subtle_Woods","Warden_Gray","Visual_Rouge","Limerick","Modern_InfoG","Fire_Ice","The_Salmon_Pink","Old_Gray"];
var chart_name = casper.cli.get(0);
var chart_data = casper.cli.get(1);

if (chart_name==="oneLayer") {
    data = "../data/"+chart_data+"_data.json";
} else if (chart_name==="timelineMap") {
    data = "../data/"+chart_data+"_data_timeline.json";
} else {
    data = "../data/"+chart_data;
}

casper.echo(chart_name);
casper.start('http://localhost/PykCharts/themes/exportToPNG.html?slug='+chart_name+'&data='+data, function() {
      // casper.echo(chart_name+"-"+theme_list[0]+"---"+this.getCurrentUrl());
    this.waitForSelector("#chart_container0", (function() {
        for (var i = 0; i < 11; i++) {
            this.captureSelector(chart_name+"-"+theme_list[i]+'.png', '#chart_container'+i);
            this.echo("Saved screenshot of " + (this.getCurrentUrl()) + " to themes/");
        }
    }), (function() {
        this.die("Timeout reached. Fail whale?");
        this.exit();
    }), 60000);

});

casper.run();
