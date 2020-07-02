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
var pathColor = "#654321"
var pathWidth = 3;
var textStyle = "Press Start 2P"
var bradius = 1;

var setTimer = null;

export function main( ){

    //removes elements from previous gameplay if any

    // d3.select("#"+id).select("*").remove();
    // d3.select("#"+id).selectAll("text").remove();
    // d3.select("#"+id).selectAll(".lastscores").remove();
    // d3.select("#"+id).selectAll("line").remove();
    // d3.select("#"+id).selectAll("path").remove();
    // d3.select("#"+id).selectAll(".submission").remove();
    // d3.select("#"+id).selectAll("foreignObject").remove();

    // var bbbox = svg.node().getBoundingClientRect();
    // var width = bbbox.width
    // var height = bbbox.height;

    //adds elements on to the screen

    var mainmenu = document.createElement("div");
    mainmenu.classList.add("centerElDiv");

    var title = document.createElement("div");
    title.innerHTML = "<h2> <i> -- COVID-Life -- <i> </h2>"
    title.classList.add("mainTitle");

    var newgame = document.createElement("div");
    var gameintro = document.createElement("div");
    var instructions = document.createElement("div");
    var credits = document.createElement("div");

    var spanintro = document.getElementsByClassName("close")[0];
    var spaninstructions = document.getElementsByClassName("close")[1];
    var spancredits = document.getElementsByClassName("close")[2];

    newgame.innerHTML = "Start game"
    gameintro.innerHTML = "Introduction"
    instructions.innerHTML = "Instructions"
    credits.innerHTML = "Credits"

    newgame.classList.add("mainmenuItem")
    gameintro.classList.add("mainmenuItem")
    instructions.classList.add("mainmenuItem")
    credits.classList.add("mainmenuItem")

    newgame.addEventListener("click",function(){
        game(resources);
    })

    gameintro.addEventListener("click",function(){
        document.getElementById('introText').style.display='block'
    });

    instructions.addEventListener("click",function(){
        document.getElementById('instructionsText').style.display='block'
    });

    credits.addEventListener("click",function(){
        document.getElementById('creditsText').style.display='block'
    });

    spanintro.addEventListener("click",function(){
        document.getElementById('introText').style.display='none'
    })

    spaninstructions.addEventListener("click",function(){
        document.getElementById('instructionsText').style.display='none'
    })

    spancredits.addEventListener("click",function(){
        document.getElementById('creditsText').style.display='none'
    });


    window.addEventListener("click", function(e){
        if( e.target == document.getElementById('introText') ){
            document.getElementById('introText').style.display='none'
        }
        else if( e.target == document.getElementById('instructionsText') ){
            document.getElementById('instructionsText').style.display='none'
        }
        else if( e.target == document.getElementById('creditsText') ){
            document.getElementById('creditsText').style.display='none'
        }
    })

    instructions.addEventListener("click",instructions)
    credits.addEventListener("click",end)

    mainmenu.appendChild(title)
    mainmenu.appendChild(newgame)
    mainmenu.appendChild(gameintro)
    mainmenu.appendChild(instructions)
    mainmenu.appendChild(credits)

    document.getElementById("mapdiv").appendChild(mainmenu);

    //screen elements, specified as D3
    // var className = "main"
    // var color = textColor;

    // svg.node().prevFn = main;
    // appendText(svg.node().id, text, color, className, "pointer");
    // appendTextEvents(svg.node().id, className, [game, intro,instructions, credits]);

}


//only changng the colors of game grid
function game( resources ){

    //init time and resources
    maxTime = 30;
    ts = 0;

    cagrid = populate_grid();
    cagrid.update();

    resources.init(); //for multiple gameplay
    scoring_text = cagrid.score();
    resources_text = resources.getResState();

    var mapdiv = document.getElementById("mapdiv")
    mapdiv.querySelectorAll('*').forEach(n => n.remove());

    mapdiv.classList.remove("centerElDiv");
    mapdiv.classList.add("gameDiv");

    var gamediv = document.createElement("div");
    var scorediv = document.createElement("div");
    gamediv.classList.add("gameScreen");
    scorediv.classList.add("scoreScreen");

    mapdiv.appendChild(gamediv)
    mapdiv.appendChild(scorediv)

    var timeleft = document.createElement("div");
    timeleft.innerHTML = "Time Left: " + (maxTime-ts) + " days"
    timeleft.classList.add("scoreContent")
    timeleft.id = "timeleft"

    var resources = document.createElement("div");
    resources.innerHTML = "Test kits: " + resources_text
    resources.classList.add("scoreContent")
    resources.id = "resources";

    var scoring1 = document.createElement("div");
    scoring1.innerHTML = scoring_text[0];
    scoring1.classList.add("scoreContent")
    scoring1.id = "infected"

    var scoring2 = document.createElement("div");
    scoring2.innerHTML = scoring_text[1];
    scoring2.classList.add("scoreContent")
    scoring2.id = "safe"

    var scoring3 = document.createElement("div");
    scoring3.innerHTML = scoring_text[2];
    scoring3.classList.add("scoreContent")
    scoring3.id = "connected"

    scorediv.appendChild(timeleft);
    scorediv.appendChild(resources);
    scorediv.appendChild(scoring1);
    scorediv.appendChild(scoring2);
    scorediv.appendChild(scoring3);

    var gamewidth = gamediv.offsetWidth;
    var gameHeight = gamediv.offsetHeight;

    var svg = d3.select(".gameScreen")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + gamewidth + " " + gameHeight)
        .attr("id", "theSvg")
        .style("background",bg)

    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    svg.selectAll("text").remove();
    svg.on("click", null);

    circles = cagrid.nodesToPlot();

    //resources_update(textsvg)

    var circleEl = svg.selectAll("rect")
        .data(circles)
        .enter()
        .append("rect");

    var w = width/18;
    var h = height/18; //height/20;

    circleEl
        .attr('x', function(d,i) {
            return (d.x) * w
        })
        .attr('y', function(d,i) {
            return (d.y) * h
        })
        .attr("width", w)
        .attr("height", h)
        .style("fill",function(d){
            return d.color;
        })
        .style("fill-opacity",function(d){
            return d.opacity;
        })
        .attr("rx", bradius)
        .attr("class","dropzone")
        .attr("class","connected")
        .classed("cells",true)
        .classed("shadow",true)
        .attr("xpos",function(d){
            return d.x
        })
        .attr("ypos", function(d){
            return d.y
        })
    // .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    first_score = cagrid.score();

    circleEl
        .call(clickDispatcher);

    scoring_text = cagrid.score();

    var content = scoring_text[0] + "<br> <br> <br> " + scoring_text[1] + "<br> <br> <br>"  + scoring_text[2];

    //appendText(svg.node().id, scoringData, textColor, "scoring");

    //resources_text = resources.getResState();

    var content = "Time Left: " + (maxTime-ts) + " days" + "<br> <br> <br>" + resources_text[0] + "<br> ------- <br> " + scoring_text[0] + "<br> <br> <br> " + scoring_text[1] + "<br> <br> <br>"  + scoring_text[2];

    // textsvg.append('foreignObject')
    //     .attr('x', width)
    //     .attr('y', height/8)
    //     .attr('width', width/3)
    //     .attr('height', height)
    //     .attr("fill",textColor)
    //     .attr("font-family", textStyle)
    //     .attr("font-size", 10)
    //     .attr("class", "intro")
    //     .append("xhtml:body")
    //     .html('<div style="width: 92%; color:black; font-size:vw">' + content + '</div>')

    //console.log(resourcesData)
    //appendText(svg.node().id, resourcesData, textColor, "resources");

    //resources_update(textsvg, 1);

    // function changeCol(){

    //     cagrid.setOpacity();
    //     //thinking if it needs to be consistent with graph. hmm
    //     for(var iter=0; iter<circles.length; iter++){
    //         if( circles[iter].color == "grey"){
    //             circles[iter].opacity = cagrid.retrieveOpacity(circles[iter].y + "," + circles[iter].x);
    //         }
    //     }

    //     svg
    //         .selectAll(".cells")
    //         .transition().duration(200)
    //         .style("fill-opacity", function(d){
    //             return d.opacity
    //         })
    // }

    //setTimer = setInterval(changeCol, 4000);

    document.addEventListener("keypress", keyHandler);

}


function end(svgold){

    document.removeEventListener("keypress", keyHandler);
    document.body.style.cursor = "default";
    svgold.selectAll("path").remove();
    svgold.selectAll(".road").remove();
    svgold.selectAll("end").remove();

    d3.select("#theSvgText").selectAll("*").remove()
    d3.select("mapdiv").remove("#theSvg")
    d3.select("mapdiv").remove("#theSvgText")

    setTimer = null;

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


function update( svg ){

    ts++;//timestep increases

    cagrid.update();

    for(var iter=0; iter<circles.length; iter++){
        var objColor = cagrid.retrieveColor(circles[iter].y + "," + circles[iter].x)
        var opacity = cagrid.retrieveOpacity(circles[iter].y + "," + circles[iter].x)
        circles[iter].color = objColor;
        circles[iter].opacity = opacity;
    }

    svg.selectAll("path").remove();
    svg.selectAll(".road").remove();

    //update scores
    scoring_text = cagrid.score();
    resources_text = resources.getResState();

    document.getElementById("timeleft").innerHTML = "Time Left: " + (maxTime-ts) + " days"
    document.getElementById("resources").innerHTML = "Test kits: " + resources_text
    document.getElementById("infected").innerHTML = scoring_text[0];
    document.getElementById("safe").innerHTML = scoring_text[1];
    document.getElementById("connected").innerHTML = scoring_text[2];

    //draw paths
    var bbbox = svg.node().getBoundingClientRect();
    var width = bbbox.width
    var height = bbbox.height;

    cagrid.getConnectedGreen();
    var gridAdjacent = cagrid.getConnections();

    var w = width/18;
    var h = height/18;

    //getting adjacent connected green without diagonals
    for(var iter =0; iter < gridAdjacent.length; iter++){

        var adjacencyList = gridAdjacent[iter]
        //var rest = adjacencyList.slice(1, adjacencyList.length);
        //not an elegant solution

        var st = adjacencyList[0];
        for( let adjIter = 0; adjIter < adjacencyList.length; adjIter++){

            //probably selectively add horizontal and vertical
            svg.append("circle")
                .attr('cx', (st.x+2)*w + 0.5*w) //center it
                .attr('cy', (st.y+2)*h +  0.5*h)
                // .attr("width", 0.4*w)
            // .attr("height", 0.4*h)
                .attr("r", 7)
                .style("fill", "wheat") //#006994
                .attr("class","dropzone")
                .classed("road", true)


            // svg.append("rect")
            //     .attr('x', (st.x+2)*w + 0.2*w) //center it
            //     .attr('y', (st.y+2)*h + 0.3*h)
            //     .attr("width", 0.2*w)
            //     .attr("height", 0.2*h)
            //     .style("fill", "wheat")
            //     .attr("class","road")
            //     .attr("class","dropzone")
            //     .classed("road", true)
                //.style("stroke-dasharray", ("1, 3"))  // <== This line here for pixel on and off !!

            // //.style("fill", "grey")
            // // .style("fill-opacity", 0.5)
         }
    }

    //getting adjacent connected green without diagonals
    for(var iter =0; iter < gridAdjacent.length; iter++){

        var adjacencyList = gridAdjacent[iter]
        //var rest = adjacencyList.slice(1, adjacencyList.length);
        //not an elegant solution

        var st = adjacencyList[0];
        for( let adjIter = 0; adjIter < adjacencyList.length; adjIter++){

            var d = adjacencyList[adjIter]
            var adjacencyPath = "M" + (Math.floor(((st.x+2)*w))+w/2) + " " + Math.floor(((st.y+2)*h+h/2)) + " L" + (Math.floor(((d.x+2)*w))+w/2) + " " + Math.floor(((d.y+2)*h+h/2));

            svg.append('path')
                .attr("stroke-width", pathWidth)
                .attr("d", adjacencyPath)
                .style("stroke", pathColor)
                .style("stroke-width", 5)
                .style("stroke-dasharray", ("5, 3"))

        }
    }

    svg
        .selectAll(".cells")
        .transition().duration(200)
        .style("fill", function(d){
            return d.color
        })
        .style("fill-opacity", function(d){
            return d.opacity
        });
}

function resources_update( svg ){


    resources_text = resources.getResState();
    document.getElementById("resources").innerHTML = "Test kits: " + resources_text;
}


function keyHandler (e){

    var charCode = e.charCode;

    //a little bit of a cheat
    var svg = d3.select("#theSvg");

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
            var mapdiv = document.getElementById("mapdiv")
            mapdiv.querySelectorAll('*').forEach(n => n.remove());

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
            resources_update();
            cagrid.resetTesting();
        }; break;
    }
    default: {cursor = "default"; document.body.style.cursor = "default"; } break;
    }
}

// var svg = d3.select("#mapdiv")
//     .append("svg")
//     .attr("preserveAspectRatio", "xMinYMin meet")
//     .attr("viewBox", "0 0 " + width + " " + height)
//     .attr("class", "svg-content")
//     .attr("id", "theSvg")
//     .style("background",bg)

// var svg2 = d3.select("#textdiv")
//     .append("svg")
//     .attr("preserveAspectRatio", "xMinYMin meet")
//     .attr("viewBox", "0 0 " + width/3 + " " + height)
//     .attr("class", "svg-content")
//     .attr("id", "theSvgText")
//     .style("background",bg)




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
                resources_update();
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
        resources_update();
    });


main();
//svg.node().id, svg2.node().id);
