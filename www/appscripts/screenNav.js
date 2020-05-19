
// Keeping separate functions for screens and navgiation

//game screen only manages the content of hte svg on resize

import {populate_grid} from "./graphs.js"
import {resources} from "./resources.js"

var cagrid = {};
var circles = [];
var rafId = null;
var scoring_text= []
var resources_text= []
var scoreTimeSeries = [];
var first_score = [];
var maxTime = 20;
var ts = 0;

export function main( svg ){

    d3.select("#"+svg.id).select("*").remove();
    d3.select("#"+svg.id).select("text").remove();

    var bbbox = svg.getBoundingClientRect();
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

    svg.prevFn = main;
    appendText(svg.id, text, color, className, "pointer");
    appendTextEvents(svg.id, className, [game, intro,instructions, credits]);

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
            x: width/3,
            y: height/3,
            content: "Your city is in a pandemic.",
        },
        {
            x: width/3,
            y: height/2,
            content: "Your actions can save the city.",
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
        .attr("font-family", "sans-serif")
        .style("cursor", "pointer")
        .attr("class", "introNav")
        .on("click", function(){
            svg.selectAll("*").remove();
            svg.node().prevFn(svg.node())
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
            x: 2*width/5,
            y: height/5,
            content: "Player actions"
        },
        {
            x: width/5,
            y: height/3,
            content: "A + Mouse click -> Lock"
        },
        {
            x: width/2,
            y: height/3,
            content: "S + Mouse click -> Test"
        },
        {
            x: width/5,
            y: 2*height/3,
            content: "D + Mouse click -> Unlock"
        },

        {
            x: width/2,
            y: 2*height/3,
            content: "F + Mouse click -> Default cursor"
        },

        {
            x: 2*width/5,
            y: 4*height/5,
            content: "Click to proceed..."
        },
    ]

    appendText(svg.node().id, text, "#F0E68C", "actions");

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
        .attr("font-family", "sans-serif")
        .style("cursor", "pointer")
        .attr("class", "introNav")
        .on("click", function(){
            svg.selectAll("*").remove();
            svg.node().prevFn(svg.node())
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
        .attr("font-family", "sans-serif")
        .style("cursor", "pointer")
        .attr("class", "introNav")
        .on("click", function(){
            svg.selectAll("*").remove();
            svg.node().prevFn(svg.node())
        });


}


function game( id ){

    var svg = d3.select("#"+id);

    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    svg.selectAll("text").remove();
    svg.on("click", null);

    cagrid = populate_grid();
    circles = cagrid.nodesToPlot();

    var circles = svg.selectAll("circle")
        .data(circles)
        .enter()
        .append("circle");

    var w = width/25;
    var h = height/18;

    circles
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

    circles.on("click", function(e){

        if( document.body.style.cursor == "" || document.body.style.cursor == "default" ){
            //nothing
        }
        else{

            let cursor = document.body.style.cursor.split(",")[0].split("/")[1].split(".png")[0]
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
                resources_update(1);
            }
            else if( cursor == "quarantine" ){

                if( resources.check_testKits() > 0){
                    console.log("test")
                    cagrid.testing(e.y+","+e.x, 1);
                    cagrid.disconnect(e.y+","+e.x, 1);
                    item.classList.add('testinprogress')
                    resources.selTesting();
                    resources_update(1);
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

    appendText(svg.node().id, resourcesData, "#F0E68C", "resources");

    document.addEventListener("keypress", function(e){

        var charCode = e.charCode;

        switch(charCode){

        case 115: document.body.style.cursor = "url(resources/quarantine.png), auto"; break;
        case 100: document.body.style.cursor = "url(resources/unlock.png), auto"; break;
        case 119: document.body.style.cursor = "default"; break;
        case 32: {
            if( ts == maxTime){
                ts++;
                rafId = null
                end();
                return;
            }
            else if( ts < maxTime ) {
                update( svg );
                //document.body.style.cursor = "default";
                //cursor_style = "default"
                resources.useKit();
                resources.replenish();
                resources_update(2);

            }; break;
        }
        default: document.body.style.cursor = "default"; break;
        }
    });
}


function end(){


    // var nav = [
    //     {
    //         x: width/10,
    //         y: 0.1*height,
    //         content: "<Main Screen>",
    //     }
    // ];

    // d3.select("#"+id)
    //     .append("text")
    //     .attr("x", nav[0].x)
    //     .attr("y", nav[0].y )
    //     .text(nav[0].content)
    //     .attr("fill","#F0E68C")
    //     .attr("font-family", "sans-serif")
    //     .style("cursor", "pointer")
    //     .attr("class", "introNav")
    //     .on("click", function(){
    //         svg.selectAll("*").remove();
    //         svg.node().prevFn(svg.node())
    //     });

}

//     screen3(cagrid){

//         d3.select("body").select("#mapdiv").select("svg").selectAll("text").remove()
//         d3.select("body").select("#mapdiv").select("svg").on("click",null)

//         create_grid()

//         first_score = cagrid.score();

//         d3.select("#mapdiv").select("svg").selectAll("circle")

//         //.style("filter", "filter:drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))")
//         //.attr("class", "bordered")
//             .on("click", function(e){

//                 if( document.body.style.cursor == "" || document.body.style.cursor == "default" ){
// z                    //nothing
//                 }
//                 else{

//                     let cursor = document.body.style.cursor.split(",")[0].split("/")[1].split(".png")[0]
//                     const item = this;

//                     if( cursor == "unlock" ){

//                         console.log("connect")
//                         cagrid.disconnect(e.y+","+e.x, 0);
//                         cagrid.testing(e.y+","+e.x, 0);
//                         item.classList.remove('bordered')
//                         item.classList.remove('testinprogress')
//                         //update();
//                         //resources.unuseBarriers();

//                         if( resources.check_testKits() >= 0 && resources.check_testKits() < 5){
//                             resources.unselTesting();
//                         }
//                         //dopn't allow carryover
//                         //resources.calibrate();
//                         resources_update(1);
//                     }
//                     else if( cursor == "quarantine" ){

//                         if( resources.check_testKits() > 0){
//                             console.log("test")
//                             cagrid.testing(e.y+","+e.x, 1);
//                             cagrid.disconnect(e.y+","+e.x, 1);
//                             item.classList.add('testinprogress')
//                             //update();
//                             //resources.useTesting();
//                             resources.selTesting();
//                             //resources.calibrate();
//                             //resources.selTesting();
//                             resources_update(1);
//                         }
//                     }
//                 }

//             });

//         scoring_text = cagrid.score();

//         d3.select("#mapdiv").select("svg").selectAll(".scoring")
//             .data(scoring_text)
//             .enter()
//             .append("text")
//             .attr("x", 0.75*width)
//             .attr("y", function(d,i){
//                 return (i+1)*height/4
//             })
//             .text(function(d){
//                 return d
//             })
//             .attr("fill","#F0E68C")
//             .attr("font-family", "sans-serif")
//             .attr("class", "scoring")

//         var resources_text = resources.getResState();

//         d3.select("body").select("#mapdiv").select("svg").selectAll(".resources")
//             .data(resources_text)
//             .enter()
//             .append("text")
//             .attr("x",function(d,i){
//                 return (i+1)*width/3
//             })
//             .attr("y",0.95*height)
//             .text(function(d){
//                 return d
//             })
//             .attr("fill","#F0E68C")
//             .attr("font-family", "sans-serif")
//             .attr("class", "resources")

//         d3.select("body").select("#mapdiv").select("svg")
//             .append("text")
//             .attr("x",function(d,i){
//                 return (i+1)*width/3
//             })
//             .attr("y",0.05*height)
//             .text("Time Left: " + (maxTime-ts))
//             .attr("fill","#F0E68C")
//             .attr("font-family", "sans-serif")
//             .attr("class", "time")


//         document.addEventListener("keypress", function(e){

//             var charCode = e.charCode;

//             if( charCode == 115){

//                 document.body.style.cursor = "url(resources/quarantine.png), auto";
//                 cursor_style = "quarantine"
//             }
//             else if( charCode == 100){

//                 document.body.style.cursor = "url(resources/unlock.png), auto";
//                 cursor_style = "unlock"
//             }
//             else if( charCode == 119){

//                 cursor_style = "default"
//                 document.body.style.cursor = "default";
//             }
//             else if( charCode == 32){

//                 if( ts == maxTime){
//                     ts++;
//                     rafId = null
//                     screen4();
//                     return;
//                 }
//                 else if( ts < maxTime ) {
//                     update();
//                     //document.body.style.cursor = "default";
//                     //cursor_style = "default"
//                     resources.useKit();
//                     resources.replenish();
//                     resources_update(2);

//                 }
//                 else{
//                     //nothing
//                 }
//             }
//         });



//     }


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

//     plot( w1, w2, h1, h2, data ){

//         var svg = d3.select("body").select("#mapdiv").select("svg");

//         var xscale = d3.scale.linear()
//             .domain([0, data.length])
//             .range([w1, w2]);

//         var yscale = d3.scale.linear()
//             .domain([0, d3.max(data)])
//             .range([h1,h2]);

//         var x_axis = d3.svg.axis()
//             .scale(xscale)
//             .orient("bottom")

//         var y_axis = d3.svg.axis()
//             .scale(yscale)
//             .orient("left")

//         svg.append("line")
//             .style("stroke", "Lightblue")
//             .style("stroke-width", 4)
//             .attr("x1", xscale(0))
//             .attr("y1", yscale(0))
//             .attr("x2", xscale(data.length-1))
//             .attr("y2", yscale(0))

//         //Lets draw the Y axis
//         svg.append("line")
//             .style("stroke", "Lightblue")
//             .style("stroke-width", 4)
//             .attr("x1", xscale(0))
//             .attr("y1", yscale(0))
//             .attr("x2", xscale(0))
//             .attr("y2", yscale(d3.max(data)))

//         var line = d3.svg.line()
//             .x(function(d,i) { return xscale(i); })
//             .y(function(d) { return yscale(d); })

//         svg.append("path")
//             .transition()
//             .delay(200)
//             .attr("d", line(data))
//             .style("stroke", "#F0E68C")
//             .style("stroke-width", 2)
//             .style("fill", "none")

//     }


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
        .attr("font-family", "sans-serif")
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

function nextFn( callback ){

}

function prevFn( callback ){

}


function update( svg ){

    ts++;//timestep increases

    cagrid.update();

    for(var iter=0; iter<circles.length; iter++){
        var objColor = cagrid.retrieveColor(circles[iter].y + "," + circles[iter].x)
        circles[iter].color = objColor;
    }

    svg.selectAll(".scoring").remove();
    svg.selectAll(".time").remove();

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

    console.log(resources_text)

    svg.selectAll(".resources")
        .data(resources_text)
        .enter()
        .append("text")
        .attr("y", 0.95*height)
        .attr("x", function(d,i){
            return (i+1)*width/3
        })
        .text(function(d){return d})
        .attr("fill","#F0E68C")
        .attr("font-family", "sans-serif")
        .attr("class", "resources")

}
