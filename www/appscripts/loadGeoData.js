
// The graphs can be generated from a map with geojson files as is given here,
// or they can be plugged in with a artificial grid of cells.


var width = document.getElementById("mapdiv").offsetWidth;
var height = document.getElementById("mapdiv").offsetHeight;

export function plotMap ( name ){

    d3.json("resources/" + name + ".json", function (json) {

        var projection = d3.geoMercator().fitExtent( [[20, 20] ,[width-20, height-20]], json);

        // var center = d3.geo.centroid(json)
        // var scale  = 200;
        // var offset = [width/2, height/2];
        // var projection = d3.geo.mercator().scale(scale).center(center)
        //     .translate(offset);

        // create the path
        var path = d3.geo.path().projection(projection);
        console.log(projection);

        json.features = json.features.map(function(data){

            var bounds  = d3.geo.bounds(data)
            let newData = data
            let coords1 = bounds[0]
            let coords2 = bounds[1]
            newData.minlat = coords1[1]
            newData.minlon = coords1[0]
            newData.maxlat = coords2[1]
            newData.maxlon = coords2[0]
            return newData
        });


        // // using the path determine the bounds of the current map and use
        // // these to determine better values for the scale and translation
        // var bounds  = path.bounds(json);
        // var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
        // var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
        // var scale   = (hscale < vscale) ? hscale : vscale;
        // var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
        //                height - (bounds[0][1] + bounds[1][1])/2];

        // // new projection
        // projection = d3.geo.mercator().center(center)
        //     .scale(scale).translate(offset);
        // path = path.projection(projection);

        // indiaj.selectAll("path")
        //     .data(json.features)
        //     .enter().append("path")
        //     .attr("d", path)
        //     .style("fill", color)
        //     .style("opacity", 0.5)


        // var chenn = india.selectAll("path")
        //     .data(json.features)
        //     .enter().append("path")
        //     .attr("x", function(d,i){
        //         return d.x
        //     })
        //     .attr("y", function(d,i){
        //         return d.y
        //     })
        //     .attr("width", function(d){
        //         return d.width
        //     })
        //     .attr("height", function(d){
        //         return d.height
        //     })
        //     .style("fill", function(){

        //         if(Math.random() > 0.5){
        //             return "green"
        //         }
        //         else {
        //             return "red"
        //         }
        //     });

        var india = d3.select("#mapdiv");

        var chenn = india.selectAll("path")
            .data(json.features)
            .enter().append("path")
            .attr("d", path)
            .style("stroke", "black")
            .style("fill", function(){
                let d = Math.random();
                if( d <= 0.1){
                    return "Lightblue"
                }
                else if( d > 0.1 && d <= 0.4){
                    return "yellowgreen"
                }
                else if( d > 0.4 && d <= 0.7){
                    return "ffda6b"
                }
                else{
                    return "crimson"
                }
            })
            .style("opacity", 1)
            .attr("minlat", function(d){
                return d.minlat
            })
            .attr("minlon", function(d){
                return d.minlong
            })
            .attr("maxlat", function(d){
                return d.maxlat
            })
            .attr("maxlon", function(d){
                return d.maxlon
            })

        // var sorted = india.selectAll("path")
        //     .sort(function(a,b){
        //         return d3.ascending(a.minlat, b.minlon)
        //     });


        var nodes = india.selectAll("path")[0];
        build_from_map(nodes);

        chenn.on('click', function (d, i) {
            d3.select(this).transition().duration(300).style("opacity", 1);
            div.transition().duration(300)
                .style("opacity", 1)
            console.log(d)
            div.text(d.id + " : " + d.total)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 30) + "px");

            if( d.id == "Tamil Nadu"){
                plotMap(d.id);
            }

            if( d.id == "Chennai"){
                plotMap(d.id);
            }
        })

            .on('mouseleave', function (d, i) {
                d3.select(this).transition().duration(300)
                    .style("opacity", 0.5);
                // div.transition().duration(300)
                //     .style("opacity", 0);
            })
            .on('mouseenter', function (d, i) {
                d3.select(this).transition().duration(300)
                    .style("opacity", 0.5);
                // div.transition().duration(300)
                //     .style("opacity", 0);

            });

    });
}

//plotMap("chennai_wards")

const haversineDistance = (lat1, lon1, lat2, lon2, isMiles = false) => {

    //console.log(lat1 + "," + lon1 + "," + lat2 + "," + lon2)
    const toRadian = angle => (Math.PI / 180) * angle;
    const distance = (a, b) => (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM = 6371;

    const dLat = distance(lat2, lat1);
    const dLon = distance(lon2, lon1);

    lat1 = toRadian(lat1);
    lat2 = toRadian(lat2);

    // Haversine Formula
    const a =
          Math.pow(Math.sin(dLat / 2), 2) +
          Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.asin(Math.sqrt(a));

    let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

    if (isMiles) {
        finalDistance /= 1.60934;
    }

    //console.log(finalDistance)
    return finalDistance;
};

//place regions within 3km distance as neighbours
export function build_from_map( nodes ){

    for(let n=0; n<nodes.length; n++){

        nodes[n].adjacency = [];
        var lat1 = nodes[n].getAttribute("minlat")
        var lon1 = nodes[n].getAttribute("minlon")
        var lat1max = nodes[n].getAttribute("maxlat")
        var lon1max = nodes[n].getAttribute("maxlon")

        for(let ad = 0; ad < nodes.length; ad++){

            if( n!=ad){

                var lat2 = nodes[ad].getAttribute("latitude")
                var lon2 = nodes[ad].getAttribute("longitude")
                var lat2max = nodes[ad].getAttribute("maxlat")
                var lon2max = nodes[ad].getAttribute("maxlon")

                var t = 1.75

                if( haversineDistance( lat1, lon1, lat2, lon2, false  ) <= t ||
                    haversineDistance( lat1, lon1, lat2max, lon2max, false  ) <= t ||
                    haversineDistance( lat1max, lon1max, lat2, lon2, false  ) <= t ||
                    haversineDistance( lat1max, lon1max, lat2max, lon2max, false  ) <= t
                  ){
                    nodes[n].adjacency.push(nodes[ad]);
                    //create a connection
                }
            }

        }
    }

    nodes.map((n)=>{
        console.log("Node")
        console.log(n)
        console.log("Adjacent")
        console.log(n.adjacency);
    })
}

export function simulate_data( n1, n2 ){

    var gridArr = []

    for(var row=0; row < n1; row++){
        let n1 = 10
        gridArr[row] = [];
        for( var col=0; col<n2; col++){

            //let n2 = 10;
            gridArr[row][col] = [];

            var up1 = (row - 1) < 0?row:gridArr[row][col].push((row-1)+","+col);

            var down1 = (row + 1)>= n1?0:gridArr[row][col].push((row+1)+","+col)

            var left1 = (col - 1) < 0? (n2-1):gridArr[row][col].push(row+","+(col-1))

            var right1 = (col + 1) >= n2? 0:gridArr[row][col].push(row+","+(col+1))

            var upleft = ((row - 1 >= 0)&&(col - 1 >= 0))?gridArr[row][col].push((row-1)+","+(col-1)):0
            var upright = ((row - 1 >= 0)&&(col + 1 < n2))?gridArr[row][col].push((row-1)+","+(col+1)):0
            var downright = ((row + 1 < n1)&&(col + 1 < n2))?gridArr[row][col].push((row+1)+","+(col+1)):0
            var downleft = ((row + 1 < n1)&&(col - 1 >= 0))?gridArr[row][col].push((row+1)+","+(col-1)):0;

        }
    }
    return gridArr;
}
