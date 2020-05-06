
// if a cell is red, then it continues to stay red
// if a cell is orange, then it continues to stay orange, or move to red
// if a cell is green, then it turns orange or continues to stay green.


// THe goal of the rules in the Game of life were to keep adjacenecy interactions and state interactios such that based on letting chaos like things emerge out of the interaction.

// The goal of our game is to model a game such that there are human interactions that alter the game rules to bring about a dynamic and chaotic state. Otherwise, all the cells will eventually turn red.

// map structures for game of life simulation


class Grid {
    constructor() {
        this.connected = {};
        this.nodes = {};
    }

    addNode(node) {
        this.nodes[node.id] = node;
        this.connected[node.id] = [];
        this.nodes[node.id].disconnected = 0;
        this.nodes[node.id].tested = 0;
        var r = Math.random();
        if(r< 0.3 ){
            this.nodes[node.id].state = 2
            this.nodes[node.id].color = "red"
        }
        else if( r >= 0.3 && r < 0.6){
            this.nodes[node.id].state = 1
            this.nodes[node.id].color = "orange"
        }
        else{
            this.nodes[node.id].state = 0
            this.nodes[node.id].color = "green"
        }
    }

    addEdge(node1id, node2id, weight = 1/3) {
        this.connected[node1id].push({ node: this.nodes[node2id], weight: weight });
        var connectStr = this.connected[node1id].map((n) => JSON.stringify(n.node));

        // add only when it is not already in the connected list
        if( connectStr.indexOf( JSON.stringify(this.nodes[node2id])  ) == -1 )
            this.connected[node2id].push({ node: this.nodes[node1id], weight: weight });
    }

    display() {
        let graph = "";

        for (const value of Object.values(this.nodes)) {
            graph += value.state + " " +  "->" + this.connected[value.id].map(n => n.node.state).join(", ") + "\n";
        }
        console.log(graph);
    }

    gridDisplay (){

        var grid = ""
        for(var row=0; row < n; row++){
            for(var col=0; col < n; col++){

                if( this.nodes[row+","+col].disconnected != 0){
                    grid += "[" + this.nodes[row+","+col].color + "]\t"
                }
                else if(  this.nodes[row+","+col].tested != 0 ){
                    grid += "*" + this.nodes[row+","+col].color + "*\t"
                }
                else {
                    grid += this.nodes[row+","+col].color + "\t"
                }

            }
            grid+= "\n"
        }
        console.log(grid)
    }

    testing ( nodeid ){
        this.nodes[nodeid].tested = 0.6; //weight for testing
    }

    disconnect ( nodeid, value ){

        if(value == 1 ){
            // connect the nodes with adjacent
            this.nodes[nodeid].disconnected = 1/3 //weight for connecting
        }
        else {
            // connect the nodes with adjacent
            this.nodes[nodeid].disconnected = 0; //weight for connecting
        }
    }

    //reset the tested, and disconnected values at end of the trial/ keep it there?
    reset (){

    }

    //takes two percentages
    simulate_input ( n, disconnect, testing) {

        //testing 1% of cells
        for(var row=0; row < n; row++){
            for(var col=0; col < n; col++){

                if( Math.random() > (1-testing/100)){
                    this.testing(row+","+col);
                }

                if( Math.random() > (1-disconnect/100)){
                    this.disconnect(row+","+col, 1);
                }
                else{
                    this.disconnect(row+","+col, 0);
                }

            }
        }


    }

    update (){

        //shouldnt' I be storing it and using the old values
        var new_obj = JSON.parse(JSON.stringify(this.nodes));

        var sum = 0
        for (const value of Object.values(new_obj)) {

            //calculate adjacent neighbours sum
            let adjacent = this.connected[value.id].map( n => ((value.disconnected!=0||n.node.disconnected!=0)?0:n.node.weight*n.node.state)).reduce((a,b)=> a+b);
            //the edge weights are added here to keep connection and disconnection


            let spread_across_region = adjacent/16; //to keep sum within 1
            let R0 = 2.28; // a corona constant. testing reduces its impact spread

            let w2 = 1/3;
            let spread_within_region = (w2-value.tested)*R0
            let w3 = 0.1; //persistence of each cell to continue its current state
            let persistence = w3*value.state/2; //1/3 if red, 1/6 if orange, and 0 is green

            let score = spread_across_region + spread_within_region  + persistence; //

            if ( score <= 0.25){
                value.state = 0
                value.color = "green"
            }
            else if( score > 0.25 && score <= 0.5){
                value.state = 1
                value.color = "orange"
            }
            else{
                value.state = 2
                value.color = "red"
            }
        }

        //repaste
        this.nodes = JSON.parse(JSON.stringify(new_obj))

    }

}

var cagrid = new Grid();

function populate_grid ( n ){

    for(var row=0; row < n; row++){
        for(var col=0; col < n; col++){
            cagrid.addNode({x: col, y: row, id: ""+row+","+col});
        }
    }

    for(var row=0; row < n; row++){
        for(var col=0; col < n; col++){

            var up1 = (row - 1) < 0?row:(cagrid.addEdge( (row+","+col), ((row-1)+","+col)));
            var down1 = (row + 1)>= n?0: (cagrid.addEdge( (row+","+col), ((row+1)+","+col)));
            var left1 = (col - 1) < 0? (n-1): (cagrid.addEdge( (row+","+col), ((row)+","+(col-1))));
            var right1 = (col + 1) >= n? 0: (cagrid.addEdge( (row+","+col), ((row)+","+(col+1))));

            var upleft = ((row - 1 >= 0)&&(col - 1 >= 0))?(cagrid.addEdge( (row+","+col), ((row-1)+","+(col-1)))):0
            var upright = ((row - 1 >= 0)&&(col + 1 < n))?(cagrid.addEdge( (row+","+col), ((row-1)+","+(col+1)))):0
            var downright = ((row + 1 < n)&&(col + 1 < n))?(cagrid.addEdge( (row+","+col), ((row+1)+","+(col+1)))):0
            var downleft = ((row + 1 < n)&&(col - 1 >= 0))?(cagrid.addEdge( (row+","+col), ((row+1)+","+(col-1)))):0

        }
    }
}


function iterate( n, disconnect, testing ){

    for( let iter = 0; iter < n; iter++){
        cagrid.gridDisplay()
        cagrid.simulate_input(iter, disconnect, testing)
        cagrid.update()

    }
}


// cagrid.gridDisplay()
// cagrid.simulate_input()
// cagrid.update()
// cagrid.gridDisplay()
// cagrid.simulate_input()
// cagrid.update()
// cagrid.gridDisplay()


// takes 4 arguments now - number_cells, n_iterations, %disconnection, %testing (last two are inputs)

//console.log("Type input as : node graphs.js number_cells n_iterations, disconnection%, testing%")

var n = parseFloat(process.argv[2]);
var iterations = parseFloat(process.argv[3]);
var disconnect = parseFloat(process.argv[4]);
var testing = parseFloat(process.argv[5]);

populate_grid(n);
iterate( iterations, disconnect, testing);
