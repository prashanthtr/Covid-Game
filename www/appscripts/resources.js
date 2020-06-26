
class Resources {
    constructor() {
        this.remaining = 0;
        this.unused = 4; //max
        this.carry = 0;
        this.maxStep = 4;
        this.last_rem = 0;
    }

    useKit(){
        this.carry = this.unused
        //this.temp_testKits = this.testing
        this.remaining += this.carry;
        this.last_rem = this.remaining;
        console.log(this.remaining);
        //this.used = this.remaining;
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
        if( this.unused > 0){
            this.unused--
        }
        else if( this.remaining > 0){
            this.remaining--
        }
        else{
            //nothing
        }

        //for a single screen
    }

    unselTesting(){
        console.log(this.last_rem)
        if( this.unused < 4){
            this.unused++
        }
        else if( this.remaining < this.last_rem){
            this.remaining++
        }
        else{
            //no change
        }
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
        if( (this.remaining+this.unused) <= 0){ //used more than the quota for the
            return -1;
        }
        return (this.remaining+this.unused);
    }

    // unselBarriers(){
    //     this.temp_barriers++
    // }

    // calibrate(){
    //     this.temp_testKits = this.testing
    //     this.temp_barriers= this.barriers;
    // }

    init(){

        this.remaining = 0;
        this.carry = 0;
        this.last_rem = 0;
        this.unused = this.maxStep;
    }

    replenish(){
        this.unused = this.maxStep // get 5 new test kits
        // this.barriers = 5
        //this.temp_barriers = 5;
    }

    getResState(){
        return ["Test kits :" + (this.remaining+this.unused)]
        //, "Barriers :" + this.barriers]
    }

}

export var resources = new Resources()
