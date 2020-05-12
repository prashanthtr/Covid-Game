
import {populate_grid} from "./graphs.js"


var width = document.getElementById("mapdiv").offsetWidth;
var height = document.getElementById("mapdiv").offsetHeight;
var cagrid = [];
var rects = [];
var svgContainer = {}
var ts = 0;
var rafId = null;

var threeCursors = ["url(resources/lock.png), auto", "resources/quarantine.png), auto", "url(resources/unlock.png), auto" ]

// var svgContainer = d3.select("body").select("#mapdiv").select("#theSvg")
//     .attr("width", width)
//     .attr("height", height);


function create_grid(){

    cagrid = populate_grid();
    console.log(cagrid)

    var svgContainer = d3.select("body").select("#mapdiv").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "theSvg")
        .attr("style","positive:relative;left:10%")

    svgContainer.selectAll("rect").remove();

    rects = cagrid.nodesToPlot();
    var rectangles = svgContainer.selectAll("rect")
        .data(rects)
        .enter()
        .append("rect");

    // var bbbox = document.getElementById("theSvg").getBoundingClientRect();
    // var width = bbbox.width
    // var height = bbbox.height;

    console.log(width + "," + height)
    var w = width/30;
    var h = height/25;

    rectangles
        .attr('x', function(d) {
            return (d.x+2) * w;
        })
        .attr('y', function(d) {
            return (d.y+2) * h;
        })
        .attr("width",0.8*w)
        .attr("height", 0.9*h)
        .style("fill",function(d){
            return d.color;
        })
        .attr("cx",function(d){
            return d.x
        })
        .attr("cy", function(d){
            return d.y
        })
        .attr("class","dropzone")
}


function update(){

    //document.getElementById("ts").innerHTML = "Time step: " + (ts++) +  "\n" + "Score:" + cagrid.score();
    //var obj = cagrid.orderExport();

    if( ts == 60){
        screen4();
        rafId = null
        return;
    }

    ts++;//timestep increases

    cagrid.update();

    for(var iter=0; iter<rects.length; iter++){
        var objColor = cagrid.retrieveColor(rects[iter].y + "," + rects[iter].x)
        rects[iter].color = objColor;
    }

    d3.select("body").select("#mapdiv").select("#theSvg")
        .selectAll("rect")
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

d3.select(window).on('resize.updatesvg', create_grid);

function screen1( ){

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
        },

    ];


    //intro text to the game, with a next button
    var svg = d3.select("#mapdiv").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background","#6B8E23")
        .on("click", screen2)

    svg.selectAll("text")
        .data(text)
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
        .attr("fill","#6B8E23")
        .attr("font-family", "sans-serif")

    // svg.append("rect")
    //     .attr("x", 0.45*width)
    //     .attr("y", 0.8*height)
    //     .attr("width", 40)
    //     .attr("height", 20)
    //     .attr("fill","#6B8E23")
    //     .attr("stroke","#6B8E23")
    //     .attr("id","clickrect")
    //     .on("mouseover",function(){
    //     })
    //     .on("click",function(){
    //         screen2()
    //     })

    //         .transition()
    //     .delay(4000)
    //     .duration(1000)
    //     .attr("stroke","#F0E68C")
    //     .attr("stroke-width",1)

    // svg.append("text")
    //     .attr("cx", 0.45*width)
    //     .attr("cy", 0.8*height)
    //     .text("Click")
    //     .attr("fill","#6B8E23")
    //     .attr("id", "clicker")

    // .attr("width", 100)
    //     .attr("height",50)

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

    // svg.select("#clickrect")
    //     .transition()
    //     .delay(4000)
    //     .duration(1000)
    //     .attr("border", "1px solid lightgrey")

    // .attr({"x": width/3, "y": height/3})
        // .style("color","white")
        // .style("border","1px lightgray solid")
        // .transition().duration(1500)
        // .text("A city is in pandemic")
        // .transition().duration(1500)
        // .append("text")
        // .text("Your actions can save the city")
        // .transition().duration(1500)
        // .append("text")
        // .text("Let us proceed")
        // .transition().duration(1500)
        // .each("end", screen2)


    // var parah = document.createElement("p");
    // parah.setAttribute("innerHTML", "Intro to the game");
    // div1.appendChild(parah)

    // var button = document.createElement("button");
    // button.setAttribute("value", "Next");
    // div1.appendChild(button)

    // button.addEventListener("click",function(){
    //     alert("Move to next screen")
    //     screen2();
    // })


    // div1.select("p")
    //     .attr("innerHTML", "Intro to the game");

    // div1.select("button")
    //     .attr("value", "Next")
    //     .on("click",function(){
    //         alert("Move to next screen")
    //         screen2();
    //     })

}

screen1();

function screen2(){

    d3.select("body").select("#mapdiv").select("svg").selectAll("text").remove()
    d3.select("body").select("#mapdiv").select("svg").on("click",null)
    d3.select("body").select("#mapdiv").select("svg").on("click",screen3)

}

function screen3(){


    d3.select("body").select("#mapdiv").select("svg").remove()
    create_grid()


    d3.select("#mapdiv").select("svg").selectAll("rect")

        .on("mouseover", function(e){

            if( document.body.style.cursor == "" || document.body.style.cursor == "default" ){
                //nothing
            }
            else{

                let cursor = document.body.style.cursor.split(",")[0].split("/")[1].split(".png")[0]
                const item = this;
                console.log(item.classList)

                if( cursor == "lock"){
                    console.log("lock")
                    console.log(e.x + " , " + e.y)
                    item.classList.add('bordered')
                    cagrid.testing(e.y+","+e.x, 1);
                }
                else if( cursor == "unlock" ){
                    console.log("connect")
                    cagrid.disconnect(e.y+","+e.x, 0);
                    item.classList.remove('bordered')
                    item.classList.remove('testinprogress')
                    cagrid.testing(e.y+","+e.x, 0);
                }
                else if( cursor == "quarantine" ){
                    console.log("test")
                    cagrid.testing(e.y+","+e.x, 1);
                    item.classList.add('testinprogress')
                }
            }

        })


    rafId = setInterval(update,200)
}

function screen4(){

    d3.select("body").select("#mapdiv").select("svg")
        .transition()
        .duration(100)
        .style("background-color","#6B8E23")

    document.body.style.cursor = "default";

    d3.select("body").select("#mapdiv").select("svg").selectAll("rect").remove()

    d3.select("body").select("#mapdiv").select("svg").append("text")
        .attr("x", width/3)
        .attr("y", height/2)
        .text("End of game")
        .attr("fill","#F0E68C")
        .attr("font-family", "sans-serif")



}

document.addEventListener("keypress", function(e){

    var charCode = e.charCode;

    if( charCode == 97){
        document.body.style.cursor = "url(resources/lock.png), auto";
    }
    else if( charCode == 115){
        document.body.style.cursor = "url(resources/quarantine.png), auto";
    }
    else if( charCode == 100){
        document.body.style.cursor = "url(resources/unlock.png), auto";
    }
    else if( charCode == 102){
        document.body.style.cursor = "default";
    }

});
