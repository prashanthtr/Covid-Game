import {populate_grid} from "./graphs.js"
import {resources} from "./resources.js"

var width = document.getElementById("mapdiv").offsetWidth;
var height = document.getElementById("mapdiv").offsetHeight;

// div foreign object in the game

var cagrid = {};
var circles = [];
var rafId = null;
var scoring_text= []
var resources_text= []
var scoreTimeSeries = [];
var first_score = [];
var maxTime = 30;
var ts = 0;
var cursor = "default";

var bg = "#ffffff"
var textColor = "#000000"
var pathColor = "#ffffff"
var pathWidth = 4;
var textStyle = "Press Start 2P"
var bradius = 2;

export function main( id ){

    var svg = d3.select("#"+id);

    d3.select("#"+id).select("*").remove();
    d3.select("#"+id).selectAll("text").remove();
    d3.select("#"+id).selectAll(".lastscores").remove();
    d3.select("#"+id).selectAll("line").remove();
    d3.select("#"+id).selectAll("path").remove();
    d3.select("#"+id).selectAll(".submission").remove();
    d3.select("#"+id).selectAll("foreignObject").remove();

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
    var color = textColor;

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
        .attr("fill",textColor)

    svg.select("#clicker")
        .transition()
        .delay(4000)
        .duration(1000)
        .attr("fill",textColor)


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

    // //screen elements, specified as D3
    // var text = [
    //     {
    //         x: width/10,
    //         y: height/3,
    //         content: "A pandemic has brought your city's operations to a grinding halt.",
    //     },
    //     {
    //         x: width/10,
    //         y: 2*height/5,
    //         content: "As people are finding livelihood difficult, we have to open up",
    //     },
    //     {
    //         x: width/10,
    //         y: 0.47*height,
    //         content: "the city whilst risking more infections.",
    //     },
    //     {
    //         x: width/10,
    //         y: 3*height/5,
    //         content: "Assemble safe zones and minimize overcrowding to enable people",
    //     },
    //     {
    //         x: width/10,
    //         y: 0.67*height,
    //         content: "find their livelihood in safety.",
    //     }
    // ];


    //intro text to the game, with a next button
    var svg = d3.select("#mapdiv").select("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svgDiv")
        .style("background",bg)

    var className = "intro"
    var color = textColor
    var id = svg.node().id

    //appendText(id, text, color, className);

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
        .attr("fill",textColor)
        .attr("font-family", textStyle)
        .style("cursor", "pointer")
        .attr("class", "introNav")
        .on("click", function(){
            svg.selectAll("*").remove();
            svg.node().prevFn(svg.node().id)
        });

    svg.append('foreignObject')
        .attr('x', width/15)
        .attr('y', height/4)
        .attr('width', 0.9*width)
        .attr('height', 0.8*height)
        .attr("fill",color)
        .attr("font-family", textStyle)
        .attr("class", "intro")
        .append("xhtml:body")
        .html('<div style="width: 90%; color:textColor;font-size:1.2vw"> A pandemic has brought your city\'s operations to a grinding halt. As people are finding livelihood difficult, you have to open up the city whilst risking more infections. <br> <br> Your task: Assemble safe (green) zones and enable people find their livelihood in 30 days. <br> <br> Guidelines: <ul> <li> Test infected (orange) zones to make them safe. </li> <li> Reduce the infected zones near safe zones (green). </li> <li> Do not increase overcrowding of safe (green) zones. </li> </div>')


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

    // var text = [
    //     {
    //         x: width/10,
    //         y: 3*height/15,
    //         content: "Player actions:"
    //     },
    //     {
    //         x: width/10,
    //         y: 4*height/15,
    //         content: "1) Press S once and Mouse click -> Box and Quarantine"
    //     },
    //     {
    //         x: width/10,
    //         y: 5*height/15,
    //         content: "2) Press D once + Mouse click -> Remove containment"
    //     },
    //     {
    //         x: width/10,
    //         y: 6.5*height/15,
    //         content: "Patterns to minimize overcrowding:"
    //     },
    //     {
    //         x: width/10,
    //         y: 11.5*height/15,
    //         content: "Connecting safe zones:"
    //     }
    // ];

    //appendText(svg.node().id, text, textColor, "actions");

    // var imgs = [
    //     {
    //         x: 1*width/10,
    //         y: height/2,
    //         src: "./resources/adj1.png"
    //     },
    //     {
    //         x: 2.5*width/10,
    //         y: height/2,
    //         src: "./resources/adj2.png"
    //     },
    //     {
    //         x: 4*width/10,
    //         y: height/2,
    //         src: "./resources/adj3.png"
    //     },
    //     {
    //         x: 5.5*width/10,
    //         y: height/2,
    //         src: "./resources/adj4.png"
    //     },
    //     {
    //         x: 7*width/10,
    //         y: height/2,
    //         src: "./resources/adj5.png"
    //     },
    //     {
    //         x: 2.5*width/10,
    //         y: 0.8*height,
    //         src: "./resources/adj3.png"
    //     },
    //     {
    //         x: 3.7*width/10,
    //         y: 0.8*height,
    //         src: "./resources/adj2.png"
    //     },
    //     {
    //         x: 5.5*width/10,
    //         y: 0.8*height,
    //         src: "./resources/adj2.png"
    //     },
    //     {
    //         x: 6.7*width/10,
    //         y: 0.8*height,
    //         src: "./resources/adj3.png"
    //     }

    // ];

    // svg.selectAll('image')
    //     .data(imgs)
    //     .enter()
    //     .append("image")
    //     .attr("x", function(d){return d.x})
    //     .attr("y", function(d){return d.y})
    //     .attr('xlink:href', (d)=> {return d.src})
    //     .attr('width', 75)
    //     .attr('height', 75)

    // var imgText = [
    //     {
    //         x: 1*width/10,
    //         y: 0.67*height,
    //         content: "Sparse"
    //     },
    //     {
    //         x: 2.5*width/10,
    //         y: 0.67*height,
    //         content: ""
    //     },
    //     {
    //         x: 4*width/10,
    //         y: 0.67*height,
    //         content: "Optimal"
    //     },
    //     {
    //         x: 5.5*width/10,
    //         y: 0.67*height,
    //         content: ""
    //     },
    //     {
    //         x: 7*width/10,
    //         y: 0.67*height,
    //         content: "Crowded"
    //     },
    //     {
    //         x: 3*width/10,
    //         y: 0.97*height,
    //         content: "Connected"
    //     },
    //     {
    //         x: 5.5*width/10,
    //         y: 0.97*height,
    //         content: "Disconnected"
    //     }
    // ];

    //appendText(svg.node().id, imgText, textColor, "crowding");

    // var connect = [
    //     {
    //         x: 2.5*width/10,
    //         y: 0.8*height,
    //         src: "./resources/adj2.png"
    //     },
    //     {
    //         x: 3*width/10,
    //         y: 0.8*height,
    //         src: "./resources/adj3.png"
    //     }
    // ];

    // svg.selectAll('image')
    //     .data(connect)
    //     .enter()
    //     .append("image")
    //     .attr("x", function(d){return d.x})
    //     .attr("y", function(d){return d.y})
    //     .attr('xlink:href', (d)=> {return d.src})
    //     .attr('width', 75)
    //     .attr('height', 75)
    //     .attr("class", "connect")

    //appendRules();

    //svg.on("click",this.screen2);

    // function(){
    //     this.selectAll("text").remove()
    //     this.on("click", null);
    //     this.screen3();
    // });

    var nav = [
        {
            x: width/15,
            y: 0.05*height,
            content: "< Main Screen",
        }
    ];

    d3.select("#"+id)
        .append("text")
        .attr("x", nav[0].x)
        .attr("y", nav[0].y )
        .text(nav[0].content)
        .attr("fill",textColor)
        .attr("font-family", textStyle)
        .style("cursor", "pointer")
        .attr("class", "introNav")
        .on("click", function(){
            svg.selectAll("*").remove();
            //console.log(svg.node().prevFn);
            svg.node().prevFn(svg.node().id)
        });

    svg.append('foreignObject')
        .attr('x', width/15)
        .attr('y', height/10)
        .attr('width', 0.95*width)
        .attr('height', 0.9*height)
        .attr("fill",textColor)
        .attr("font-family", textStyle)
        .attr("class", "intro")
        .append("xhtml:body")
        .html('<div style="width: 92%; color:textColor; font-size:1vw"> Game Actions: <br> <ul> <li> Press S + Mouseclick to test a cell. </li> <li> Press D + Mouseclick to undo selection. </li>  <li> Press "Spacebar" to move to the next time step. </li> <li> Test maximum of 4 cells in each step. Remaining test kits are carried over. </li> </ul> <img src="resources/stepwise.png" style="width: 75%; height: 30%; text-align:center" />  <br> Rules: <ul> <li> Orange cell changes to green on testing. </li> Without testing action: <li> Green cell changes to orange with less than 2 adjacent green cells (infection). </li>  <li> Green changes to orange  with more than 4 green cells (overcrowding). </li> <li> Green remains green when number of nearby green Cells is =2,=3 or =4 </li> </ul> </div>')

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
            color: textColor
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
            color: textColor
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
            color: textColor
        },
        {
            x: width/5,
            y: 6.5*height/10,
            content: "(Ph.D., Arizona State University)",
            color: "orange"
        }
    ]


    svg.append('foreignObject')
        .attr('x', width/15)
        .attr('y', height/3)
        .attr('width', 0.95*width)
        .attr('height', 0.9*height)
        .attr("fill",textColor)
        .attr("font-family", textStyle)
        .attr("class", "intro")
        .append("xhtml:body")
        .html('<div style="width: 92%; color:textColor; font-size:vw"> <ul> <li> Game development: Prashanth Thattai R <br> Ph.D., National University of Singapore </li> <br> <li> Design and ideation: Adithya Kumar <br> Ph.D., Pennsylvania State University </li> <br> <li> Modeling: Karthik Pushpavanam S <br> Ph.D., Arizona State University </li> </ul> </div>')


    //appendText(svg.node().id, text, "orange", "credits");

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
        .attr("fill",textColor)
        .attr("font-family", textStyle)
        .style("cursor", "pointer")
        .attr("class", "introNav")
        .on("click", function(){
            svg.selectAll("*").remove();
            svg.node().prevFn(svg.node().id)
        });

}


//only changng the colors of game grid
function game( id ){

    var svg = d3.select("#"+id);

    maxTime = 30;
    ts = 0;
    resources.init(); //for multiple gameplay

    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    svg.selectAll("text").remove();
    svg.on("click", null);

    cagrid = populate_grid();
    cagrid.update();

    circles = cagrid.nodesToPlot();

    resources_update(svg)

    var circleEl = svg.selectAll("rect")
        .data(circles)
        .enter()
        .append("rect");

    var w = width/25;
    var h = height/18; //height/20;

    circleEl
        .attr('x', function(d,i) {
            return (d.x+2) * w
        })
        .attr('y', function(d,i) {
            return (d.y+2) * h
        })
        .attr("width", 0.75*w)
        .attr("height",0.8*h)
        .style("fill",function(d){
            return d.color;
        })
        .attr("rx", bradius)
        .attr("class","dropzone")
        .attr("class","connected")
        .attr("xpos",function(d){
            return d.x
        })
        .attr("ypos", function(d){
            return d.y
        })


    first_score = cagrid.score();

    var event = d3.dispatch('click', 'dblclick');//event dispatcher for
                                                 //segmenting single and double
                                                 //clics based on time (same
                                                 //would be used for single and
                                                 //double taps on mobile)

    function getClickDispatcher (){
        const clickEvent = d3.dispatch('click', 'dblclick')

        return d3.rebind((selection) => {
            let waitForDouble = null

            // Register click handler on selection, that issues click and dblclick as appropriate
            selection.on('click', (projectProxy) => {
                d3.event.preventDefault()
                if (waitForDouble != null) {
                    clearTimeout(waitForDouble); //dont wait for a double
                    waitForDouble = null
                    clickEvent.dblclick(d3.event, projectProxy)
                } else {
                    const currentEvent = d3.event;
                    waitForDouble = setTimeout(() => {
                        console.log(currentEvent)
                        clickEvent.click(currentEvent, projectProxy)
                        waitForDouble = null
                    }, 200);
                }
            })
        }, clickEvent, 'on');
    }

    const clickDispatcher = getClickDispatcher();

    console.log(clickDispatcher)

    clickDispatcher
        .on('click', (e) => {
            const item = e.target;
            var x = e.target.getAttribute("xpos")
            var y = e.target.getAttribute("ypos")
            if( resources.check_testKits() > 0){
                if( cagrid.alreadyTested(y+","+x) == 0 ){
                    cagrid.testing(y+","+x, 1);
                    //cagrid.disconnect(e.y+","+e.x, 1);
                    item.classList.add('testinprogress')
                    item.classList.remove('connected')
                    resources.selTesting();
                    resources_update(svg, 1);
                }
            }
          })
          .on('dblclick', (e) => {
              const item = e.target;
              var x = e.target.getAttribute("xpos")
              var y = e.target.getAttribute("ypos")
              console.log("connect")
              //cagrid.disconnect(e.y+","+e.x, 0);
              cagrid.testing(y+","+x, 0);
              //console.log(item)
              //item.classList.remove('bordered')
              item.classList.add('connected')
              item.classList.remove('testinprogress')
              resources.unselTesting();
              resources_update(svg, 1);
          });

    circleEl
        .call(clickDispatcher);


    // circleEl.on("dblclick", function(e){

    //     const item = this;
    //     console.log("connect")
    //     //cagrid.disconnect(e.y+","+e.x, 0);
    //     cagrid.testing(e.y+","+e.x, 0);
    //     //console.log(item)
    //     //item.classList.remove('bordered')
    //     item.classList.remove('testinprogress')

    //     resources.unselTesting();

        // if( resources.check_testKits() >= 0 && resources.check_testKits() < 5){
        // }

    //     resources_update(svg, 1);
    // });

    // circleEl.on("click", function(e){

    //     const item = this;
    //     if( resources.check_testKits() > 0){
    //         cagrid.testing(e.y+","+e.x, 1);
    //         //cagrid.disconnect(e.y+","+e.x, 1);
    //         item.classList.add('testinprogress')
    //         resources.selTesting();
    //         resources_update(svg, 1);
    //     }

        // if( cursor == "" || cursor == "default" ){
        //     //nothing
        // }
        // else{

        //     //let cursor = document.body.style.cursor.split(",")[0].split("/")[1].split(".png")[0]
        //     const item = this;

        //     if( cursor == "unlock" ){

        //         console.log("connect")
        //         //cagrid.disconnect(e.y+","+e.x, 0);
        //         cagrid.testing(e.y+","+e.x, 0);
        //         //console.log(item)
        //         //item.classList.remove('bordered')
        //         item.classList.remove('testinprogress')

        //         resources.unselTesting();

        //         // if( resources.check_testKits() >= 0 && resources.check_testKits() < 5){
        //         // }

        //         resources_update(svg, 1);
        //     }
        //     else if( cursor == "quarantine" ){

        //         if( resources.check_testKits() > 0){
        //             cagrid.testing(e.y+","+e.x, 1);
        //             //cagrid.disconnect(e.y+","+e.x, 1);
        //             item.classList.add('testinprogress')
        //             resources.selTesting();
        //             resources_update(svg, 1);
        //         }
        //     }
        // }
    // });


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

    var content = scoring_text[0] + "<br> <br> <br> " + scoring_text[1] + "<br> <br> <br>"  + scoring_text[2];

    //appendText(svg.node().id, scoringData, textColor, "scoring");

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
            content: "Time Left: " + (maxTime-ts) + " days"
        }

    ];

    var content = "Time Left: " + (maxTime-ts) + " days" + "<br> <br> <br>" + resources_text[0] + "<br> ------- <br> " + scoring_text[0] + "<br> <br> <br> " + scoring_text[1] + "<br> <br> <br>"  + scoring_text[2];

    svg.append('foreignObject')
        .attr('x', 0.75*width)
        .attr('y', height/4)
        .attr('width', 0.2*width)
        .attr('height', 0.7*height)
        .attr("fill",textColor)
        .attr("font-family", textStyle)
        .attr("class", "intro")
        .append("xhtml:body")
        .html('<div style="width: 92%; color:textColor; font-size:vw">' + content + '</div>')

    //console.log(resourcesData)
    //appendText(svg.node().id, resourcesData, textColor, "resources");

    resources_update(svg, 1);

    document.addEventListener("keypress", keyHandler);

}


function end(svg){

    document.removeEventListener("keypress", keyHandler);
    document.body.style.cursor = "default";
    svg.selectAll("path").remove();

    svg.selectAll("text").remove()
    svg.selectAll("rect").remove()
    svg.selectAll("foreignObject").remove();

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

    appendText(svg.node().id, lastScores, textColor, "lastScores");

    let old_score = first_score.map( (s) => {return parseFloat((s.split(":")[1]))})
    let cur_score = scoring_text.map( (s) => {return parseFloat((s.split(":")[1]))})

    var inf = cur_score[0] - old_score[0];
    var saf = cur_score[1] - old_score[1];
    var econ = parseInt( (cur_score[2] - old_score[2]) *100/ old_score[2]);

    var nav = [
        {
            x: width/5,
            y: 0.9*height,
            content: "Submit"
        },
        {
            x: 2*width/5,
            y: 0.9*height,
            content: "New game"
        }
    ];

    if(  saf> 0 && econ > 0){

        var content = "You have saved " + saf + " infected people and improved mobility by " + econ + "% <br> These noble actions are potential solutions for safely exiting COVID-19 lockdowns. <br> Will you allow us to collect and analyze your gameplay strategies?"

        // var nav = [
        //     {
        //         x: width/10,
        //         y: 0.65*height,
        //         content: "You have saved " + saf + " infected people and improved mobility by " + econ + "%"
        //     },
        //     {
        //         x: width/10,
        //         y: 0.7*height,
        //         "content": "These noble actions are potential solutions for safely exiting COVID-19 lockdowns."
        //     },
        //     {
        //         x: width/10,
        //         y: 0.75*height,
        //         "content": "Will you allow us to collect and analyze your gameplay strategies"
        //     },
        //     {
        //         x: width/5,
        //         y: 0.9*height,
        //         content: "Submit"
        //     },
        //     {
        //         x: 3*width/5,
        //         y: 0.9*height,
        //         content: "New game"
        //     }
        // ];

    }
    else if ( saf > 0){

        var content = "You have saved " + saf + " infected people. <br> These noble actions are potential solutions for safely exiting COVID-19 lockdowns. <br> Will you allow us to collect and analyze your gameplay strategies?"


        // var nav = [
        //     {
        //         x: width/10,
        //         y: 0.65*height,
        //         content: "You have saved " + saf + " infected people"
        //     },
        //     {
        //         x: width/10,
        //         y: 0.7*height,
        //         "content": "These noble actions are potential solutions for safely exiting COVID-19 lockdowns."
        //     },
        //     {
        //         x: width/10,
        //         y: 0.75*height,
        //         "content": "Will you allow us to collect and analyze your gameplay strategies"
        //     },
        //     {
        //         x: width/5,
        //         y: 0.9*height,
        //         content: "Submit"
        //     },
        //     {
        //         x: 3*width/5,
        //         y: 0.9*height,
        //         content: "New game"
        //     }
        // ];

    }
    else if (econ > 0){

        var content = "You have improved mobility by " + econ + "% <br> These noble actions are potential solutions for safely exiting COVID-19 lockdowns. <br> Will you allow us to collect and analyze your gameplay strategies?"

        // var nav = [
        //     {
        //         x: width/10,
        //         y: 0.65*height,
        //         content: "You have improved mobility by " + econ + "%"
        //     },
        //     {
        //         x: width/10,
        //         y: 0.7*height,
        //         "content": "These noble actions are potential solutions for safely exiting COVID-19 lockdowns."
        //     },
        //     {
        //         x: width/10,
        //         y: 0.75*height,
        //         "content": "Will you allow us to collect and analyze your gameplay strategies"
        //     },
        //     {
        //         x: width/5,
        //         y: 0.9*height,
        //         content: "Submit"
        //     },
        //     {
        //         x: 3*width/5,
        //         y: 0.9*height,
        //         content: "New game"
        //     }
        // ];

    }
    else{

        var content = "We encourage you to try again to improve gameplay. <br> Your noble actions are potential solutions for safely exiting COVID-19 lockdowns. <br> Would you give this another try?"

        // var nav = [
        //     {
        //         x: width/10,
        //         y: 0.65*height,
        //         content: "We encourage you to try again to improve gameplay."
        //     },
        //     {
        //         x: width/10,
        //         y: 0.7*height,
        //         "content": "Your noble actions are potential solutions for safely exiting COVID-19 lockdowns."
        //     },
        //     {
        //         x: width/10,
        //         y: 0.75*height,
        //         "content": "Would you give this another try?"
        //     },
        //     {
        //         x: width/5,
        //         y: 0.9*height,
        //         content: ""
        //     },
        //     {
        //         x: 2*width/5,
        //         y: 0.9*height,
        //         content: "New game"
        //     }
        // ];

        nav = [
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

    svg.append('foreignObject')
        .attr('x', width/10)
        .attr('y', 0.65*height)
        .attr('width', 0.9*width)
        .attr('height', 0.8*height)
        .attr("fill",textColor)
        .attr("font-family", textStyle)
        .attr("class", "intro")
        .append("xhtml:body")
        .html('<div style="width: 90%; color:textColor;font-size:1vw">' + content + '</div>')


    appendText(svg.node().id, nav, textColor, "submission", "pointer");
    appendTextEvents(svg.node().id, "submission", [submit, main]);

}

function submit(){
    console.log("creating logs")
}


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
        .style("stroke", "black")
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
        .style("stroke", "#000000")
        .style("stroke-width", pathWidth)
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
        .attr("font-family", textStyle)
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
    svg.selectAll("foreignObject").remove();
    svg.selectAll("path").remove();

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


    cagrid.getConnectedGreen();
    var gridAdjacent = cagrid.getConnections();

    console.log(gridAdjacent)

    var w = width/25;
    var h = height/18;

    for(var iter =0; iter < gridAdjacent.length; iter++){

        var adjacencyList = gridAdjacent[iter]
        //var rest = adjacencyList.slice(1, adjacencyList.length);
        //not an elegant solution

        var st = adjacencyList[0];
        for( let adjIter = 1; adjIter < adjacencyList.length; adjIter++){

            var d = adjacencyList[adjIter]
            var adjacencyPath = "M" + Math.floor(((st.x+2)*w)) + " " + Math.floor(((st.y+2)*h)) + " L" + Math.floor(((d.x+2)*w)) + " " + Math.floor(((d.y+2)*h));

            // svg.append('path')
            //     .attr("stroke-width", pathWidth)
            //     .attr("stroke", pathColor)
            //     .attr("fill-opacity", 0)
            //     .style("stroke-dasharray", ("6, 4"))  // <== This line here for pixel on and off !!
            //     .attr("d", adjacencyPath)
        }
    }

    resources_text = resources.getResState();

    //appendText(svg.node().id, scoringData, textColor, "scoring");

    var content = "Time Left: " + (maxTime-ts) + " days" + "<br> <br> <br>" + resources_text[0] + "<br> ------- <br> " + scoring_text[0] + "<br> <br> <br> " + scoring_text[1] + "<br> <br> <br>"  + scoring_text[2];

    svg.append('foreignObject')
        .attr('x', 0.75*width)
        .attr('y', height/4)
        .attr('width', 0.2*width)
        .attr('height', 0.7*height)
        .attr("fill",textColor)
        .attr("font-family", textStyle)
        .attr("class", "intro")
        .append("xhtml:body")
        .html('<div style="width: 92%; color:textColor; font-size:vw">' + content + '</div>')


    var resourcesData = [
        {
            x: width/3,
            y: 0.95*height,
            content: resources_text[0]
        },
        {
            x: width/3,
            y: 0.05*height,
            content: "Time Left: " + (maxTime-ts) + " days"
        }
    ];

    //appendText(svg.node().id, resourcesData, textColor, "resources");

    svg
        .selectAll("rect")
        .transition().duration(200)
        .style("fill", function(d){
            return d.color
        })

}

function resources_update( svg ){

    svg.selectAll(".resources").remove();
    svg.selectAll("foreignObject").remove();

    //resources_text = resources.getResState();
    //console.log(resources_text);
    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    // var resourcesData = [
    //     {
    //         x: width/3,
    //         y: 0.95*height,
    //         content: resources_text[0]
    //     },
    //     {
    //         x: width/3,
    //         y: 0.05*height,
    //         content: "Time Left: " + (maxTime-ts) + " days"
    //     }

    // ];

    scoring_text = cagrid.score();
    resources_text = resources.getResState();

    //appendText(svg.node().id, scoringData, textColor, "scoring");

    var content = "Time Left: " + (maxTime-ts) + " days" + "<br> <br> <br>" + resources_text[0] + "<br> ------- <br> " + scoring_text[0] + "<br> <br> <br> " + scoring_text[1] + "<br> <br> <br>"  + scoring_text[2];

    svg.append('foreignObject')
        .attr('x', 0.75*width)
        .attr('y', height/8)
        .attr('width', 0.25*width)
        .attr('height', 0.7*height)
        .attr("fill",textColor)
        .attr("font-family", textStyle)
        .attr("class", "intro")
        .append("xhtml:body")
        .html('<div style="width: 92%; color:textColor; font-size:vw">' + content + '</div>')


    //appendText(svg.node().id, resourcesData, textColor, "resources");

    // svg.selectAll(".resources")
    //     .data(resources_text)
    //     .enter()
    //     .append("text")
    //     .attr("y", 0.95*height)
    //     .attr("x", function(d,i){
    //         return (i+1)*width/3
    //     })
    //     .text(function(d){return d})
    //     .attr("fill",textColor)
    //     .attr("font-family", "sans-serif")
    //     .attr("class", "resources")

}


function keyHandler (e){

    var charCode = e.charCode;

    //a little bit of a cheat
    svg = d3.select("#theSvg");

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

            svg.selectAll("rect")
                .each(function(l) {
                    //console.log(this.classList)
                    this.classList.remove("testinprogress");
                });

            cagrid.update();
            end( svg );
            return;
        }
        else if( ts < maxTime ) {
            console.log(ts + " , " + maxTime);

            svg.selectAll("rect")
                .each(function(l) {
                    //console.log(this.classList)
                    this.classList.remove("testinprogress");
                });

            update( svg );
            resources.useKit();
            resources.replenish();
            resources_update(svg, 1);
            cagrid.resetTesting();
        }; break;
    }
    default: {cursor = "default"; document.body.style.cursor = "default"; } break;
    }
}

var svg = d3.select("#mapdiv")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("class", "svg-content")
    .attr("id", "theSvg")
    .style("background",bg)


main(svg.node().id);
