
import {populate_grid} from "./graphs.js"
import {resources} from "./resources.js"
import {main} from "./screenNav.js"

var width = document.getElementById("mapdiv").offsetWidth;
var height = document.getElementById("mapdiv").offsetHeight;
var cagrid = [];
var rects = [];
var svgContainer = {}
var ts = 0;
var rafId = null;
var score = []
var cursor_style = "default"
var scoring_text= []
var resources_text= []
var scoreTimeSeries = [];
var first_score = [];
var maxTime = 20;

// var svgContainer = d3.select("body").select("#mapdiv").select("#theSvg")
//     .attr("width", width)
//     .attr("height", height);

function create_grid(){

    cagrid = populate_grid();
    console.log(cagrid)

    // var svgContainer = d3.select("body").select("#mapdiv").select("svg")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .attr("background","#6B8E23")
    //     .attr("style","positive:relative;left:10%")

    //svgContainer.selectAll("rect").remove();

    rects = cagrid.nodesToPlot();

    var rectangles = d3.select("body").select("#mapdiv").select("svg").selectAll("circle")
        .data(rects)
        .enter()
        .append("circle");

    // var bbbox = document.getElementById("theSvg").getBoundingClientRect();
    // var width = bbbox.width
    // var height = bbbox.height;

    console.log(width + "," + height)
    var w = width/25;
    var h = height/18;

    rectangles
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
    //.attr("class","bordered")
}


function update(){

    //document.getElementById("ts").innerHTML = "Time step: " + (ts++) +  "\n" + "Score:" + cagrid.score();
    //var obj = cagrid.orderExport();

    ts++;//timestep increases

    cagrid.update();

    for(var iter=0; iter<rects.length; iter++){
        var objColor = cagrid.retrieveColor(rects[iter].y + "," + rects[iter].x)
        rects[iter].color = objColor;
    }

    scoring_text = cagrid.score();


    d3.select("#mapdiv").select("svg").selectAll(".scoring").remove();

    d3.select("body").select("#mapdiv").select("svg").selectAll(".time").remove();

    d3.select("body").select("#mapdiv").select("svg")
        .append("text")
        .attr("x",function(d,i){
            return (i+1)*width/3
        })
        .attr("y",0.05*height)
        .text("Time Left: " + (20-ts))
        .attr("fill","#F0E68C")
        .attr("font-family", "sans-serif")
        .attr("class", "time")


    // scoring_text = scoring_text.map( (s,ind) => {
    //     s.content = scoring[ind]
    //     return s;
    // });

    d3.select("#mapdiv").select("svg").selectAll(".scoring")
        .data(scoring_text)
        .enter()
        .append("text")
        .attr("x", 0.75*width)
        .attr("y", function(d,i){
            return (i+1)*height/4
        })
        .text(function(d){return d})
        .attr("fill","#F0E68C")
        .attr("font-family", "sans-serif")
        .attr("class", "scoring")

    // // .text(function(d){
    // //     return d
    // // })

    // d3.select("#mapdiv").select("svg").selectAll("text")
    //     .data(scoring_text)
    //     .enter()
    //     .append("text")
    //     .attr("x", 0.75*width)
    //     .attr("y", function(d,i){
    //         return (i+1)*height/4
    //     })
    //     .text(function(d){return d})
    //     .attr("fill","#F0E68C")
    //     .attr("font-family", "sans-serif")
    //     .attr("class", "scoring")


    d3.select("body").select("#mapdiv").select("svg")
        .selectAll("circle")
        .transition().duration(200)
        .style("fill", function(d){
            return d.color
        })

}

interact('.dropzone')
    .dropzone({
        accept: ['.testing','.disconnect','.connect'],
        overlap: 0.5,
        ondrop: function (event) {
            console.log(event.relatedTarget.getAttribute("class"));
            var x = event.target.getAttribute("cx");
            var y = event.target.getAttribute("cy");

            switch(event.relatedTarget.getAttribute("class")){
            case "testing": {
                cagrid.testing(y+","+x, 1);
                const item = event.target
                item.classList.add('testinprogress')
            } break;
            case "disconnect": {
                cagrid.disconnect(y+","+x, 1);
                const item = event.target
                item.classList.add('bordered')
            } break;
            case "connect": {
                cagrid.disconnect(y+","+x, 0);
                const item = event.target;
                item.classList.remove('bordered')
                item.classList.remove('testinprogress')
                cagrid.testing(y+","+x, 0);
            } break;
            default: {cagrid.testing(y+","+x, 0);cagrid.disconnect(y+","+x, 0);}
            }
        }
    });

interact('.testing')
    .draggable({
        onmove: function(event) {
            const target = event.target;

            const dataX = target.getAttribute('data-x');
            const dataY = target.getAttribute('data-y');
            const initialX = parseFloat(dataX) || 0;
            const initialY = parseFloat(dataY) || 0;

            const deltaX = event.dx;
            const deltaY = event.dy;

            const newX = initialX + deltaX;
            const newY = initialY + deltaY;

            target
                .style
                .transform = `translate(${newX}px, ${newY}px)`;

            target.setAttribute('data-x', newX);
            target.setAttribute('data-y', newY);
        },
        inertia: true,
    })

interact('.disconnect')
    .draggable({
        onmove: function(event) {
            const target = event.target;

            const dataX = target.getAttribute('data-x');
            const dataY = target.getAttribute('data-y');
            const initialX = parseFloat(dataX) || 0;
            const initialY = parseFloat(dataY) || 0;

            const deltaX = event.dx;
            const deltaY = event.dy;

            const newX = initialX + deltaX;
            const newY = initialY + deltaY;

            target
                .style
                .transform = `translate(${newX}px, ${newY}px)`;

            target.setAttribute('data-x', newX);
            target.setAttribute('data-y', newY);
        },
        inertia: true,
    })

interact('.connect')
    .draggable({
        onmove: function(event) {
            const target = event.target;

            const dataX = target.getAttribute('data-x');
            const dataY = target.getAttribute('data-y');
            const initialX = parseFloat(dataX) || 0;
            const initialY = parseFloat(dataY) || 0;

            const deltaX = event.dx;
            const deltaY = event.dy;

            const newX = initialX + deltaX;
            const newY = initialY + deltaY;

            target
                .style
                .transform = `translate(${newX}px, ${newY}px)`;

            target.setAttribute('data-x', newX);
            target.setAttribute('data-y', newY);
        }
    })


//create_grid();

document.getElementById("moveForward").addEventListener("click",function(d){
    console.log("button")
    console.log(cagrid)
    update();
});


// document.getElementById("select_grid").addEventListener("change",function(e){
//     if( e.target.value == ""){
//         //no visuals
//     }
//     else{
//         create_grid();
//     }
// });


// d3.select(window).on('resize.updatesvg', function(){
//     gs.screenFn(svg.node());
// });

//create_grid

function resources_update( num ){

    d3.select("#mapdiv").select("svg").selectAll(".resources").remove();

    switch(num){
    case 1:  resources_text = resources.getTempRes(); break;
    case 2:  resources_text = resources.getResState(); break;
    default: resources_text = resources.getResState(); break;
    }

    console.log(resources_text)

    d3.select("#mapdiv").select("svg").selectAll(".resources")
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

    // resources_text[0].content = "Test Kits: " + state[0]
    // resources_text[1].content = "Barriers: " + state[1]

    // d3.select("body").select("#mapdiv").select("svg").selectAll(".resources")
    //     .text(function(d){
    //         return d
    //     })
}


// function screen1( ){

//     var text = [
//         {
//             x: width/3,
//             y: height/3,
//             content: "Your city is in a pandemic."
//         },
//         {
//             x: width/3,
//             y: height/2,
//             content: "Your actions can save the city."
//         },
//         {
//             x: width/3,
//             y: 2*height/3,
//             content: "Click to proceed..."
//         },

//     ];

//     //intro text to the game, with a next button
//     var svg = d3.select("#mapdiv").append("svg")
//         .attr("width", width)
//         .attr("height", height)
//         .style("background","#6B8E23")
//         .on("click", screen2);

//     svg.selectAll("text")
//         .data(text)
//         .enter()
//         .append("text")
//         .attr("x", function(d){
//             return d.x
//         })
//         .attr("y", function(d){
//             return d.y
//         })
//         .text(function(d){
//             return d.content
//         })
//         .attr("fill","#6B8E23")
//         .attr("font-family", "sans-serif")

//     // svg.append("rect")
//     //     .attr("x", 0.45*width)
//     //     .attr("y", 0.8*height)
//     //     .attr("width", 40)
//     //     .attr("height", 20)
//     //     .attr("fill","#6B8E23")
//     //     .attr("stroke","#6B8E23")
//     //     .attr("id","clickrect")
//     //     .on("mouseover",function(){
//     //     })
//     //     .on("click",function(){
//     //         screen2()
//     //     })

//     //         .transition()
//     //     .delay(4000)
//     //     .duration(1000)
//     //     .attr("stroke","#F0E68C")
//     //     .attr("stroke-width",1)

//     // svg.append("text")
//     //     .attr("cx", 0.45*width)
//     //     .attr("cy", 0.8*height)
//     //     .text("Click")
//     //     .attr("fill","#6B8E23")
//     //     .attr("id", "clicker")

//     // .attr("width", 100)
//     //     .attr("height",50)

//     svg.selectAll("text")
//         .transition()
//         .delay(function(d,i){return i*1000})
//         .duration(1000)
//         .attr("fill","#F0E68C")

//     svg.select("#clicker")
//         .transition()
//         .delay(4000)
//         .duration(1000)
//         .attr("fill","#F0E68C")

//     // svg.select("#clickrect")
//     //     .transition()
//     //     .delay(4000)
//     //     .duration(1000)
//     //     .attr("border", "1px solid lightgrey")

//     // .attr({"x": width/3, "y": height/3})
//     // .style("color","white")
//     // .style("border","1px lightgray solid")
//     // .transition().duration(1500)
//     // .text("A city is in pandemic")
//     // .transition().duration(1500)
//     // .append("text")
//     // .text("Your actions can save the city")
//     // .transition().duration(1500)
//     // .append("text")
//     // .text("Let us proceed")
//     // .transition().duration(1500)
//     // .each("end", screen2)


//     // var parah = document.createElement("p");
//     // parah.setAttribute("innerHTML", "Intro to the game");
//     // div1.appendChild(parah)

//     // var button = document.createElement("button");
//     // button.setAttribute("value", "Next");
//     // div1.appendChild(button)

//     // button.addEventListener("click",function(){
//     //     alert("Move to next screen")
//     //     screen2();
//     // })


//     // div1.select("p")
//     //     .attr("innerHTML", "Intro to the game");

//     // div1.select("button")
//     //     .attr("value", "Next")
//     //     .on("click",function(){
//     //         alert("Move to next screen")
//     //         screen2();
//     //     })

// }

// screen1();

// function screen2(){

//     d3.select("body").select("#mapdiv").select("svg").selectAll("text").remove()
//     d3.select("body").select("#mapdiv").select("svg").on("click",null)

//     var text = [
//         {
//             x: 2*width/5,
//             y: height/5,
//             content: "Player actions"
//         },
//         {
//             x: width/5,
//             y: height/3,
//             content: "A + Mouse click -> Lock"
//         },
//         {
//             x: width/2,
//             y: height/3,
//             content: "S + Mouse click -> Test"
//         },
//         {
//             x: width/5,
//             y: 2*height/3,
//             content: "D + Mouse click -> Unlock"
//         },

//         {
//             x: width/2,
//             y: 2*height/3,
//             content: "F + Mouse click -> Default cursor"
//         },

//         {
//             x: 2*width/5,
//             y: 4*height/5,
//             content: "Click to proceed..."
//         },
//     ]

//     d3.select("#mapdiv").select("svg").selectAll("text")
//         .data(text)
//         .enter()
//         .append("text")
//         .attr("x", function(d){
//             return d.x
//         })
//         .attr("y", function(d){
//             return d.y
//         })
//         .text(function(d){
//             return d.content
//         })
//         .attr("fill","#F0E68C")
//         .attr("font-family", "sans-serif")

//     //needs a next button and a back button
//     d3.select("body").select("#mapdiv").select("svg").on("click",screen3)

// }

// function screen3(){

//     d3.select("body").select("#mapdiv").select("svg").selectAll("text").remove()
//     d3.select("body").select("#mapdiv").select("svg").on("click",null)

//     create_grid()

//     first_score = cagrid.score();

//     d3.select("#mapdiv").select("svg").selectAll("circle")

//     //.style("filter", "filter:drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))")
//     //.attr("class", "bordered")
//         .on("click", function(e){

//             if( document.body.style.cursor == "" || document.body.style.cursor == "default" ){
//                 //nothing
//             }
//             else{

//                 let cursor = document.body.style.cursor.split(",")[0].split("/")[1].split(".png")[0]
//                 const item = this;

//                 if( cursor == "unlock" ){

//                     console.log("connect")
//                     cagrid.disconnect(e.y+","+e.x, 0);
//                     cagrid.testing(e.y+","+e.x, 0);
//                     item.classList.remove('bordered')
//                     item.classList.remove('testinprogress')
//                     //update();
//                     //resources.unuseBarriers();

//                     if( resources.check_testKits() >= 0 && resources.check_testKits() < 5){
//                         resources.unselTesting();
//                     }
//                     //dopn't allow carryover
//                     //resources.calibrate();
//                     resources_update(1);
//                 }
//                 else if( cursor == "quarantine" ){

//                     if( resources.check_testKits() > 0){
//                         console.log("test")
//                         cagrid.testing(e.y+","+e.x, 1);
//                         cagrid.disconnect(e.y+","+e.x, 1);
//                         item.classList.add('testinprogress')
//                         //update();
//                         //resources.useTesting();
//                         resources.selTesting();
//                         //resources.calibrate();
//                         //resources.selTesting();
//                         resources_update(1);
//                     }
//                 }
//             }

//         });

//     scoring_text = cagrid.score();

//     d3.select("#mapdiv").select("svg").selectAll(".scoring")
//         .data(scoring_text)
//         .enter()
//         .append("text")
//         .attr("x", 0.75*width)
//         .attr("y", function(d,i){
//             return (i+1)*height/4
//         })
//         .text(function(d){
//             return d
//         })
//         .attr("fill","#F0E68C")
//         .attr("font-family", "sans-serif")
//         .attr("class", "scoring")

//     var resources_text = resources.getResState();

//     d3.select("body").select("#mapdiv").select("svg").selectAll(".resources")
//         .data(resources_text)
//         .enter()
//         .append("text")
//         .attr("x",function(d,i){
//             return (i+1)*width/3
//         })
//         .attr("y",0.95*height)
//         .text(function(d){
//             return d
//         })
//         .attr("fill","#F0E68C")
//         .attr("font-family", "sans-serif")
//         .attr("class", "resources")

//     d3.select("body").select("#mapdiv").select("svg")
//         .append("text")
//         .attr("x",function(d,i){
//             return (i+1)*width/3
//         })
//         .attr("y",0.05*height)
//         .text("Time Left: " + (maxTime-ts))
//         .attr("fill","#F0E68C")
//         .attr("font-family", "sans-serif")
//         .attr("class", "time")


//     document.addEventListener("keypress", function(e){

//         var charCode = e.charCode;

//         if( charCode == 115){

//             document.body.style.cursor = "url(resources/quarantine.png), auto";
//             cursor_style = "quarantine"
//         }
//         else if( charCode == 100){

//             document.body.style.cursor = "url(resources/unlock.png), auto";
//             cursor_style = "unlock"
//         }
//         else if( charCode == 119){

//             cursor_style = "default"
//             document.body.style.cursor = "default";
//         }
//         else if( charCode == 32){

//             if( ts == maxTime){
//                 ts++;
//                 rafId = null
//                 screen4();
//                 return;
//             }
//             else if( ts < maxTime ) {
//                 update();
//                 //document.body.style.cursor = "default";
//                 //cursor_style = "default"
//                 resources.useKit();
//                 resources.replenish();
//                 resources_update(2);

//             }
//             else{
//                 //nothing
//             }
//         }
//     });

//     //rafId = setInterval(update,100)
// }

// function screen4(){


//     // d3.select("body").select("#mapdiv").select("svg")
//     //     .transition()
//     //     .duration(100)
//     //     .style("background-color","#6B8E23")

//     document.removeEventListener("keypress", function(){console.log("removed")});

//     document.body.style.cursor = "default";

//     d3.select("body").select("#mapdiv").select("svg").selectAll("text").remove()
//     d3.select("body").select("#mapdiv").select("svg").selectAll("circle").remove()

//     var series = cagrid.retrieveScore()
//     var infected = [], safe = [], cs = [];
//     var timeSeries = [];

//     for(var i=0; i < series.length; i++ ){
//         timeSeries.push(i);
//         infected.push(series[i].i)
//         safe.push(series[i].s)
//         cs.push(series[i].cs)
//     }

//     var last_score = cagrid.score();

//     plot(width/10, 3*width/10, 2*height/5, height/5, infected);

//     plot(4*width/10, 6*width/10, 2*height/5, height/5, safe);

//     plot(7*width/10, 9*width/10, 2*height/5, height/5, cs);

//     scoring_text = cagrid.score();

//     d3.select("body").select("#mapdiv").select("svg").selectAll(".lastScores")
//         .data(scoring_text)
//         .enter()
//         .append("text")
//         .attr("x", function(d,i){
//             return (i*3+1)*width/10
//         })
//         .attr("y", 2*height/5 + height/10)
//         .text(function(d){return d})
//         .attr("fill","#F0E68C")
//         .attr("font-family", "sans-serif")
//         .attr("class","lastScores")

//     let old_score = first_score.map( (s) => {return parseFloat((s.split(":")[1]))})
//     let cur_score = scoring_text.map( (s) => {return parseFloat((s.split(":")[1]))})

//     var inf = cur_score[0] - old_score[0];
//     var saf = cur_score[1] - old_score[1];
//     var econ = cur_score[2] - old_score[2];

//     if( inf > 0 ){
//         console.log(" You have saved " + inf + "people. The poeple are grateful for you timely actions. The economy can start growing now");

//     }

// }

var svg = d3.select("#mapdiv")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("class", "svg-content")
    .attr("id", "theSvg")
    .style("background","#6B8E23")


main(svg.node());
