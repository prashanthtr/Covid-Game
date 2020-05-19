
class Resources {
    constructor() {
        this.testing = 0;
        this.temp_testKits = 5;
        this.left = 0;
    }


    useKit(){
        this.left = this.temp_testKits
        //this.temp_testKits = this.testing
    }

    // useBarrier(){
    //     this.barriers--
    //     //this.temp_testKits = this.barriers
    // }

    // unuseBarrier(){
    //     this.barriers++
    //     //this.temp_testKits = this.barriers
    // }

    selTesting(){
        this.temp_testKits--
    }

    unselTesting(){
        this.temp_testKits++
    }

    // selBarriers(){
    //     this.temp_barriers--
    // }

    // check_barrier(){
    //     if( this.temp_barriers < 0){
    //         return -1;
    //     }
    //     else if (this.temp_barriers > 5){
    //         return -1
    //     }
    //     return this.temp_barriers;
    // }

    check_testKits(){
        if( this.temp_testKits < 0){
            return -1;
        }
        return this.temp_testKits;
    }

    // unselBarriers(){
    //     this.temp_barriers++
    // }

    calibrate(){
        this.temp_testKits = this.testing
        this.temp_barriers= this.barriers;
    }

    init(){
        this.testing = 0;
        this.temp_testKits = 5;
        this.left = 0;
    }

    replenish(){
        this.testing = this.left + 5 // get 5 new test kits
        console.log(this.testing)
        // this.barriers = 5
        this.temp_testKits = 5;
        //this.temp_barriers = 5;
    }

    getTempRes (){
        return ["Test kits :" + (this.testing+ this.temp_testKits)]
        //"Barriers :" + this.temp_barriers]
    }

    getResState(){
        return ["Test kits :" + this.testing]
        //, "Barriers :" + this.barriers]
    }

}


export var resources = new Resources();
