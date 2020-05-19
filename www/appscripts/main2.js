import {populate_grid} from "./graphs.js"
import {resources} from "./resources.js"

var width = document.getElementById("mapdiv").offsetWidth;
var height = document.getElementById("mapdiv").offsetHeight;

var cagrid = {};
var circles = [];
var rafId = null;
var scoring_text= []
var resources_text= []
var scoreTimeSeries = [];
var first_score = [];
var maxTime = 20;
var ts = 0;
var cursor = "default";

export function main( id ){

    var svg = d3.select("#"+id);

    d3.select("#"+id).select("*").remove();
    d3.select("#"+id).selectAll("text").remove();
    d3.select("#"+id).selectAll(".lastscores").remove();
    d3.select("#"+id).selectAll("line").remove();
    d3.select("#"+id).selectAll("path").remove();
    d3.select("#"+id).selectAll(".submission").remove();

    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    //screen elements, specified as D3
    var text = [
        {
            x: 2*width/5,
            y: 4*height/10,
            content: "Start game"
        },
        {
            x: 2*width/5,
            y: 5*height/10,
            content: "Introduction"
        },
        {
            x: 2*width/5,
            y: 6*height/10,
            content: "Instructions"
        },
        {
            x: 2*width/5,
            y: 7*height/10,
            content: "Credits"
        }
    ];

    var className = "main"
    var color = "#F0E68C";

    svg.node().prevFn = main;
    appendText(svg.node().id, text, color, className, "pointer");
    appendTextEvents(svg.node().id, className, [game, intro,instructions, credits]);

}

function intro_animated(){

    this.screeNum = 1;
    this.nextFn = this.screen1; //invoke this on redraw

    var svg = d3.select("#"+id);
    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    console.log(width + " , " + height)
    svg.selectAll("*").remove();

    //screen elements, specified as D3
    var text = [
        {
            x: width/3,
            y: height/3,
            content: "Your city is in a pandemic."
        },
        {
            x: width/3,
            y: height/2,
            content: "Your actions can save the city."
        },
        {
            x: width/3,
            y: 2*height/3,
            content: "Click to proceed..."
        }
    ];

    //intro text to the game, with a next button
    var svg = d3.select("#mapdiv").select("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svgDiv")

    // .style("background","#6B8E23")

    var className = "intro"
    var color = "#6B8E23";
    var id = svg.node().id

    appendText(id, text, color, className);

    svg.selectAll("text")
        .transition()
        .delay(function(d,i){return i*1000})
        .duration(1000)
        .attr("fill","#F0E68C")

    svg.select("#clicker")
        .transition()
        .delay(4000)
        .duration(1000)
        .attr("fill","#F0E68C")


}

function intro(id){

    this.screeNum = 1;
    this.nextFn = this.screen1; //invoke this on redraw

    var svg = d3.select("#"+id);
    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    console.log(width + " , " + height)
    svg.selectAll("*").remove();

    //screen elements, specified as D3
    var text = [
        {
            x: width/10,
            y: height/3,
            content: "A pandemic has brought your city's operations to a grinding halt.",
        },
        {
            x: width/10,
            y: 2*height/5,
            content: "As people are finding livelihood difficult, we have to open up",
        },
        {
            x: width/10,
            y: 0.47*height,
            content: "the city whilst risking more infections.",
        },
        {
            x: width/10,
            y: 3*height/5,
            content: "Assemble safe zones and minimize overcrowding to enable people",
        },
        {
            x: width/10,
            y: 0.67*height,
            content: "find their livelihood in safety.",
        }
    ];

    //intro text to the game, with a next button
    var svg = d3.select("#mapdiv").select("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svgDiv")
        .style("background","#6B8E23")

    var className = "intro"
    var color = "#F0E68C"
    var id = svg.node().id

    appendText(id, text, color, className);

    var nav = [
        {
            x: width/10,
            y: 0.1*height,
            content: "< Main Screen",
        }
    ];


    d3.select("#"+id)
        .append("text")
        .attr("x", nav[0].x)
        .attr("y", nav[0].y )
        .text(nav[0].content)
        .attr("fill","#F0E68C")
        .attr("font-family", "Monaco")
        .style("cursor", "pointer")
        .attr("class", "introNav")
        .on("click", function(){
            svg.selectAll("*").remove();
            svg.node().prevFn(svg.node().id)
        });

}


function instructions(id){

    var svg = d3.select("#"+id);

    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    // this.nextFn = this.screen2; //screen currently in
    // this.prevFn = this.screen1; //screen currently in

    svg.selectAll("text").remove();
    svg.on("click", null);

    var text = [
        {
            x: width/10,
            y: 3*height/15,
            content: "Player actions:"
        },
        {
            x: width/10,
            y: 4*height/15,
            content: "1) Press S once and Mouse click -> Box and Quarantine"
        },
        {
            x: width/10,
            y: 5*height/15,
            content: "2) Press D once + Mouse click -> Remove containment"
        },
        {
            x: width/10,
            y: 6.5*height/15,
            content: "Patterns to minimize overcrowding:"
        },
        {
            x: width/10,
            y: 11.5*height/15,
            content: "Connecting safe zones:"
        }
    ];

    appendText(svg.node().id, text, "#F0E68C", "actions");

    var imgs = [
        {
            x: 1*width/10,
            y: height/2,
            src: "./resources/adj1.png"
        },
        {
            x: 2.5*width/10,
            y: height/2,
            src: "./resources/adj2.png"
        },
        {
            x: 4*width/10,
            y: height/2,
            src: "./resources/adj3.png"
        },
        {
            x: 5.5*width/10,
            y: height/2,
            src: "./resources/adj4.png"
        },
        {
            x: 7*width/10,
            y: height/2,
            src: "./resources/adj5.png"
        },
        {
            x: 2.5*width/10,
            y: 0.8*height,
            src: "./resources/adj3.png"
        },
        {
            x: 3.7*width/10,
            y: 0.8*height,
            src: "./resources/adj2.png"
        },
        {
            x: 5.5*width/10,
            y: 0.8*height,
            src: "./resources/adj2.png"
        },
        {
            x: 6.7*width/10,
            y: 0.8*height,
            src: "./resources/adj3.png"
        }

    ];

    svg.selectAll('image')
        .data(imgs)
        .enter()
        .append("image")
        .attr("x", function(d){return d.x})
        .attr("y", function(d){return d.y})
        .attr('xlink:href', (d)=> {return d.src})
        .attr('width', 75)
        .attr('height', 75)

    var imgText = [
        {
            x: 1*width/10,
            y: 0.67*height,
            content: "Sparse"
        },
        {
            x: 2.5*width/10,
            y: 0.67*height,
            content: ""
        },
        {
            x: 4*width/10,
            y: 0.67*height,
            content: "Optimal"
        },
        {
            x: 5.5*width/10,
            y: 0.67*height,
            content: ""
        },
        {
            x: 7*width/10,
            y: 0.67*height,
            content: "Crowded"
        },
        {
            x: 3*width/10,
            y: 0.97*height,
            content: "Connected"
        },
        {
            x: 5.5*width/10,
            y: 0.97*height,
            content: "Disconnected"
        }
    ];

    appendText(svg.node().id, imgText, "#F0E68C", "crowding");

    var connect = [
        {
            x: 2.5*width/10,
            y: 0.8*height,
            src: "./resources/adj2.png"
        },
        {
            x: 3*width/10,
            y: 0.8*height,
            src: "./resources/adj3.png"
        }
    ];

    svg.selectAll('image')
        .data(connect)
        .enter()
        .append("image")
        .attr("x", function(d){return d.x})
        .attr("y", function(d){return d.y})
        .attr('xlink:href', (d)=> {return d.src})
        .attr('width', 75)
        .attr('height', 75)
        .attr("class", "connect")


    //appendRules();

    svg.on("click",this.screen2);

    // function(){
    //     this.selectAll("text").remove()
    //     this.on("click", null);
    //     this.screen3();
    // });

    var nav = [
        {
            x: width/10,
            y: 0.1*height,
            content: "< Main Screen",
        }
    ];

    d3.select("#"+id)
        .append("text")
        .attr("x", nav[0].x)
        .attr("y", nav[0].y )
        .text(nav[0].content)
        .attr("fill","#F0E68C")
        .attr("font-family", "Monaco")
        .style("cursor", "pointer")
        .attr("class", "introNav")
        .on("click", function(){
            svg.selectAll("*").remove();
            //console.log(svg.node().prevFn);
            svg.node().prevFn(svg.node().id)
        });

}

function credits ( id ){

    var svg = d3.select("#"+id);

    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    svg.selectAll("text").remove();
    svg.on("click", null);

    var text = [
        {
            x: width/5,
            y: 3*height/10,
            content: "Game development: Prashanth Thattai R",
            color: "#F0E68C"
        },
        {
            x: width/5,
            y: 3.5*height/10,
            content: "(Ph.D., National University of Singapore)",
            color: "orange"
        },
        {
            x: width/5,
            y: 4.5*height/10,
            content: "Design and ideation: Adithya Kumar",
            color: "#F0E68C"
        },
        {
            x: width/5,
            y: 5*height/10,
            content: "(Ph.D., Pennsylvania State University)",
            color: "orange"
        },
        {
            x: width/5,
            y: 6*height/10,
            content: "Modeling: Karthik Pushpavanam S",
            color: "#F0E68C"
        },
        {
            x: width/5,
            y: 6.5*height/10,
            content: "(Ph.D., Arizona State University)",
            color: "orange"
        }
    ]

    appendText(svg.node().id, text, "orange", "credits");

    svg.on("click",this.screen2);

    var nav = [
        {
            x: width/10,
            y: 0.1*height,
            content: "< Main Screen",
        }
    ];

    d3.select("#"+id)
        .append("text")
        .attr("x", nav[0].x)
        .attr("y", nav[0].y )
        .text(nav[0].content)
        .attr("fill","#F0E68C")
        .attr("font-family", "Monaco")
        .style("cursor", "pointer")
        .attr("class", "introNav")
        .on("click", function(){
            svg.selectAll("*").remove();
            svg.node().prevFn(svg.node().id)
        });

}


function game( id ){

    var svg = d3.select("#"+id);

    maxTime = 20;
    ts = 0;
    resources.init(); //for multiple gameplay

    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    svg.selectAll("text").remove();
    svg.on("click", null);

    cagrid = populate_grid();

    circles = cagrid.nodesToPlot();

    var circleEl = svg.selectAll("circle")
        .data(circles)
        .enter()
        .append("circle");

    var w = width/25;
    var h = height/18;

    circleEl
        .attr('cx', function(d) {
            return (d.x+2) * w;
        })
        .attr('cy', function(d) {
            return (d.y+2) * h;
        })
        .attr("r", 0.3*w)
    // .attr("width",0.8*w)
    // .attr("height", 0.9*h)
        .style("fill",function(d){
            return d.color;
        })
        .attr("x",function(d){
            return d.x
        })
        .attr("y", function(d){
            return d.y
        })
        .attr("class","dropzone")

    first_score = cagrid.score();

    circleEl.on("click", function(e){

        if( cursor == "" || cursor == "default" ){
            //nothing
        }
        else{

            //let cursor = document.body.style.cursor.split(",")[0].split("/")[1].split(".png")[0]
            const item = this;

            if( cursor == "unlock" ){

                console.log("connect")
                cagrid.disconnect(e.y+","+e.x, 0);
                cagrid.testing(e.y+","+e.x, 0);
                item.classList.remove('bordered')
                item.classList.remove('testinprogress')

                if( resources.check_testKits() >= 0 && resources.check_testKits() < 5){
                    resources.unselTesting();
                }
                resources_update(svg, 1);
            }
            else if( cursor == "quarantine" ){

                if( resources.check_testKits() > 0){
                    console.log("test")
                    cagrid.testing(e.y+","+e.x, 1);
                    cagrid.disconnect(e.y+","+e.x, 1);
                    item.classList.add('testinprogress')
                    resources.selTesting();
                    resources_update(svg, 1);
                }
            }
        }
    });

    scoring_text = cagrid.score();

    var scoringData = [
        {
            x: 0.75*width,
            y: height/4,
            content: scoring_text[0],
        },
        {
            x: 0.75*width,
            y: 2*height/4,
            content: scoring_text[1],
        },
        {
            x: 0.75*width,
            y: 3*height/4,
            content: scoring_text[2],
        }
    ];

    appendText(svg.node().id, scoringData, "#F0E68C", "scoring");

    resources_text = resources.getResState();

    var resourcesData = [
        {
            x: width/3,
            y: 0.95*height,
            content: resources_text[0]
        },
        {
            x: width/3,
            y: 0.05*height,
            content: "Time Left: " + (maxTime-ts)
        }

    ];


    //console.log(resourcesData)
    appendText(svg.node().id, resourcesData, "#F0E68C", "resources");

    document.addEventListener("keypress", keyHandler);
}


function end(svg){

    document.removeEventListener("keypress", keyHandler);
    document.body.style.cursor = "default";

    svg.selectAll("text").remove()
    svg.selectAll("circle").remove()

    var series = cagrid.retrieveScore()
    var infected = [], safe = [], cs = [];
    var timeSeries = [];

    for(var i=0; i < series.length; i++ ){
        timeSeries.push(i);
        infected.push(series[i].i)
        safe.push(series[i].s)
        cs.push(series[i].cs)
    }


    var last_score = cagrid.score();

    plot(width/10, 3*width/10, 2*height/5, height/5, infected);
    plot(4*width/10, 6*width/10, 2*height/5, height/5, safe);
    plot(7*width/10, 9*width/10, 2*height/5, height/5, cs);

    scoring_text = cagrid.score();

    var lastScores = [
        {
            x: width/10,
            y: height/2,
            content: scoring_text[0]
        },
        {
            x: 4*width/10,
            y: height/2,
            content: scoring_text[1]
        },
        {
            x: 7*width/10,
            y: height/2,
            content: scoring_text[2]
        }
    ];

    appendText(svg.node().id, lastScores, "#F0E68C", "lastScores");

    let old_score = first_score.map( (s) => {return parseFloat((s.split(":")[1]))})
    let cur_score = scoring_text.map( (s) => {return parseFloat((s.split(":")[1]))})

    var inf = cur_score[0] - old_score[0];
    var saf = cur_score[1] - old_score[1];
    var econ = parseInt( (cur_score[2] - old_score[2]) *100/ old_score[2]);

    if(  saf > 0 && econ > 0){

        var nav = [
            {
                x: width/10,
                y: 0.65*height,
                content: "You have saved " + saf + " infected people and improved mobility by " + econ + "%"
            },
            {
                x: width/10,
                y: 0.7*height,
                "content": "These noble actions are potential solutions for safely exiting COVID-19 lockdowns."
            },
            {
                x: width/10,
                y: 0.75*height,
                "content": "Will you allow us to collect and analyze your gameplay strategies"
            },
            {
                x: width/5,
                y: 0.9*height,
                content: "Submit"
            },
            {
                x: 3*width/5,
                y: 0.9*height,
                content: "New game"
            }
        ];

    }
    else if ( saf > 0){

        var nav = [
            {
                x: width/10,
                y: 0.65*height,
                content: "You have saved " + saf + " infected people"
            },
            {
                x: width/10,
                y: 0.7*height,
                "content": "These noble actions are potential solutions for safely exiting COVID-19 lockdowns."
            },
            {
                x: width/10,
                y: 0.75*height,
                "content": "Will you allow us to collect and analyze your gameplay strategies"
            },
            {
                x: width/5,
                y: 0.9*height,
                content: "Submit"
            },
            {
                x: 3*width/5,
                y: 0.9*height,
                content: "New game"
            }
        ];

    }
    else if (econ > 0){

        var nav = [
            {
                x: width/10,
                y: 0.65*height,
                content: "You have improved mobility by " + econ + "%"
            },
            {
                x: width/10,
                y: 0.7*height,
                "content": "These noble actions are potential solutions for safely exiting COVID-19 lockdowns."
            },
            {
                x: width/10,
                y: 0.75*height,
                "content": "Will you allow us to collect and analyze your gameplay strategies"
            },
            {
                x: width/5,
                y: 0.9*height,
                content: "Submit"
            },
            {
                x: 3*width/5,
                y: 0.9*height,
                content: "New game"
            }
        ];

    }
    else{

        var nav = [
            {
                x: width/10,
                y: 0.65*height,
                content: "We encourage you to try again to improve gameplay."
            },
            {
                x: width/10,
                y: 0.7*height,
                "content": "Your noble actions are potential solutions for safely exiting COVID-19 lockdowns."
            },
            {
                x: width/10,
                y: 0.75*height,
                "content": "Would you give this another try?"
            },
            {
                x: width/5,
                y: 0.9*height,
                content: ""
            },
            {
                x: 2*width/5,
                y: 0.9*height,
                content: "New game"
            }
        ];

    }


    appendText(svg.node().id, nav, "#F0E68C", "submission", "pointer");
    appendTextEvents(svg.node().id, "submission", [end, end, end, submit, main]);

}

function submit(){
    console.log("creating logs")
}

//     screen4(cagrid, width, height){


//         document.removeEventListener("keypress", function(){console.log("removed")});

//         document.body.style.cursor = "default";

//         d3.select("body").select("#mapdiv").select("svg").selectAll("text").remove()
//         d3.select("body").select("#mapdiv").select("svg").selectAll("circle").remove()

//         var series = cagrid.retrieveScore()
//         var infected = [], safe = [], cs = [];
//         var timeSeries = [];

//         for(var i=0; i < series.length; i++ ){
//             timeSeries.push(i);
//             infected.push(series[i].i)
//             safe.push(series[i].s)
//             cs.push(series[i].cs)
//         }

//         var last_score = cagrid.score();

//         plot(width/10, 3*width/10, 2*height/5, height/5, infected);

//         plot(4*width/10, 6*width/10, 2*height/5, height/5, safe);

//         plot(7*width/10, 9*width/10, 2*height/5, height/5, cs);

//         scoring_text = cagrid.score();

//         d3.select("body").select("#mapdiv").select("svg").selectAll(".lastScores")
//             .data(scoring_text)
//             .enter()
//             .append("text")
//             .attr("x", function(d,i){
//                 return (i*3+1)*width/10
//             })
//             .attr("y", 2*height/5 + height/10)
//             .text(function(d){return d})
//             .attr("fill","#F0E68C")
//             .attr("font-family", "sans-serif")
//             .attr("class","lastScores")

//         let old_score = first_score.map( (s) => {return parseFloat((s.split(":")[1]))})
//         let cur_score = scoring_text.map( (s) => {return parseFloat((s.split(":")[1]))})

//         var inf = cur_score[0] - old_score[0];
//         var saf = cur_score[1] - old_score[1];
//         var econ = cur_score[2] - old_score[2];

//         if( inf > 0 ){
//             console.log(" You have saved " + inf + "people. The poeple are grateful for you timely actions. The economy can start growing now");

//         }

//     }

function plot( w1, w2, h1, h2, data ){

    var svg = d3.select("body").select("#mapdiv").select("svg");

    var xscale = d3.scale.linear()
        .domain([0, data.length])
        .range([w1, w2]);

    var yscale = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([h1,h2]);

    var x_axis = d3.svg.axis()
        .scale(xscale)
        .orient("bottom")

    var y_axis = d3.svg.axis()
        .scale(yscale)
        .orient("left")

    svg.append("line")
        .style("stroke", "Lightblue")
        .style("stroke-width", 4)
        .attr("x1", xscale(0))
        .attr("y1", yscale(0))
        .attr("x2", xscale(data.length-1))
        .attr("y2", yscale(0))

    //Lets draw the Y axis
    svg.append("line")
        .style("stroke", "Lightblue")
        .style("stroke-width", 4)
        .attr("x1", xscale(0))
        .attr("y1", yscale(0))
        .attr("x2", xscale(0))
        .attr("y2", yscale(d3.max(data)))

    var line = d3.svg.line()
        .x(function(d,i) { return xscale(i); })
        .y(function(d) { return yscale(d); })

    svg.append("path")
        .transition()
        .delay(200)
        .attr("d", line(data))
        .style("stroke", "#F0E68C")
        .style("stroke-width", 2)
        .style("fill", "none")

}


function appendText(id, data, color, className, cursor){

    d3.select("#"+id).selectAll("."+className)
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d){
            return d.x
        })
        .attr("y", function(d){
            return d.y
        })
        .text(function(d){
            return d.content
        })
        .attr("fill",color)
        .attr("font-family", "Monaco")
        .style("cursor", (cursor||"default"))
        .attr("class", className)

}

//bind data to functions
function appendTextEvents ( id, className, fns){

    d3.select("#"+id).selectAll("."+className)
        .on("click", function(d,i){
            console.log(fns[i])
            fns[i](id);
        });
}

function update( svg ){

    ts++;//timestep increases

    cagrid.update();

    for(var iter=0; iter<circles.length; iter++){
        var objColor = cagrid.retrieveColor(circles[iter].y + "," + circles[iter].x)
        circles[iter].color = objColor;
    }

    svg.selectAll(".scoring").remove();
    svg.selectAll(".resources").remove();

    scoring_text = cagrid.score();

    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;


    var scoringData = [
        {
            x: 0.75*width,
            y: height/4,
            content: scoring_text[0],
        },
        {
            x: 0.75*width,
            y: 2*height/4,
            content: scoring_text[1],
        },
        {
            x: 0.75*width,
            y: 3*height/4,
            content: scoring_text[2],
        }
    ];

    appendText(svg.node().id, scoringData, "#F0E68C", "scoring");

    resources_text = resources.getResState();

    var resourcesData = [
        {
            x: width/3,
            y: 0.95*height,
            content: resources_text[0]
        },
        {
            x: width/3,
            y: 0.05*height,
            content: "Time Left: " + (maxTime-ts)
        }
    ];

    appendText(svg.node().id, resourcesData, "#F0E68C", "resources");

    svg
        .selectAll("circle")
        .transition().duration(200)
        .style("fill", function(d){
            return d.color
        })

}

function resources_update( svg, num ){

    svg.selectAll(".resources").remove();

    switch(num){
    case 1:  resources_text = resources.getTempRes(); break;
    case 2:  resources_text = resources.getResState(); break;
    default: resources_text = resources.getResState(); break;
    }

    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    var resourcesData = [
        {
            x: width/3,
            y: 0.95*height,
            content: resources_text[0]
        },
        {
            x: width/3,
            y: 0.05*height,
            content: "Time Left: " + (maxTime-ts)
        }

    ];

    appendText(svg.node().id, resourcesData, "#F0E68C", "resources");

    // svg.selectAll(".resources")
    //     .data(resources_text)
    //     .enter()
    //     .append("text")
    //     .attr("y", 0.95*height)
    //     .attr("x", function(d,i){
    //         return (i+1)*width/3
    //     })
    //     .text(function(d){return d})
    //     .attr("fill","#F0E68C")
    //     .attr("font-family", "sans-serif")
    //     .attr("class", "resources")

}


var svg = d3.select("#mapdiv")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("class", "svg-content")
    .attr("id", "theSvg")
    .style("background","#6B8E23")


main(svg.node().id);

function keyHandler (e){

    var charCode = e.charCode;

    switch(charCode){


    case 115: {
        cursor = "quarantine";
        document.body.style.cursor = "copy"
    }break;
        //'document.body.style.cursor = "url(resources/quarantine.png), auto";
    case 100: {
        cursor="unlock";
        document.body.style.cursor = "url(resources/unlock.png), auto"
    } break;
        //document.body.style.cursor = "url(resources/unlock.png), auto";
    case 119: cursor = "default"; break;
    case 32: {
        if( ts == maxTime){
            ts++;
            rafId = null
            document.removeEventListener("keypress", keyHandler);
            end( svg );
            return;
        }
        else if( ts < maxTime ) {
            console.log(ts + " , " + maxTime);
            update( svg );
            resources.useKit();
            resources.replenish();
            resources_update(svg, 2);
        }; break;
    }
    default: document.body.style.cursor = "default"; break;
    }
}
