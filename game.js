let playerSpeed = 5;
let height = 6000;
let width = 6000;
let users = {};
let waitingGame = null;
let GAMES = {};
let playerScreenX = 900;
let playerScreenY = 900;
function Collider(center,size){
    this.sizeX = size[0]/2;
    this.sizeY = size[1]/2;
    this.position = center;
    this.isTouching = function(other){
        let a=false,b=false,c=false,d = false;
        if(other.position[0] > this.position[0]){
            b = (other.position[0]-other.sizeX) < (this.position[0]+this.sizeX);
        }else{
            a = (other.position[0]+other.sizeX) > (this.position[0]-this.sizeX);
        }
        if(other.position[1] > this.position[1]){
            d = (other.position[1]-other.sizeY) < (this.position[1]+this.sizeY);
        }else {
            c = (other.position[1]+other.sizeY) > (this.position[1]-this.sizeY);
        }
        let result = (a||b)&&(c||d);
        return result;
    };
}
function Game(player){
    this.loops = 0;
    let loop = function(){
        this.loops++;
        if("movement" in this.player1){ 
            this.player1.movement.move();
        }
        if("movement" in this.player2){ 
            this.player2.movement.move();
        }
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if(this.player2.screenCollider.isTouching(this.player1.collider)){
            console.log(this.loops+"| player2 seeing player1");
            if(!this.player2.seeing.has("other player")){
                console.log(this.loops+"| sending player1 to player2");
                if("movement" in this.player1) {
                    this.player2.send("get target",{movement: this.player1.movement.toSendingData(), id: this.player1.id});
                    console.log(this.loops+"| movement sent");
                }else {
                    this.player2.send("set player position",this.player1.position);
                    console.log(this.loops+"| movement not found, sending only position");
                }
                this.player2.seeing.add("other player");
            }
        }else{
            console.log(this.loops+"| player2 not seeing player1");
            if(this.player2.seeing.has("other player")){
                this.player2.seeing.delete("other player");
            }
        }
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if(this.player1.screenCollider.isTouching(this.player2.collider)){
            console.log(this.loops+"| player1 seeing player2");
            if(!(this.player1.seeing.has("other player"))){
                console.log(this.loops+"| sending player2 to player1");
                if("movement" in this.player2) {
                    this.player1.send("get target",{movement: this.player2.movement.toSendingData(), id: this.player2.id});
                    console.log(this.loops+"| movement sent");
                }else{
                    this.player1.send("set player position",this.player2.position);
                    console.log(this.loops+"| movement not found, sending position");
                }
                this.player1.seeing.add("other player");
            }
        }else{
            console.log(this.loops+"| player1 not seeing player2");
            if(this.player1.seeing.has("other player")){
                this.player1.seeing.delete("other player");
            }
        }
    };
    let loopTimer;
    let id = Symbol();
    this.colliders = [];
    GAMES[id] = this;
    this.player1 = player;
    this.start = function(){
        let player2Msg = {
            other:{
                color: this.player1.color,
                id: this.player1.id},
            me:{
                color: this.player2.color,
                id: this.player2.id,
                position: this.player2.position},
            height: height,
            width: width};
        let player1Msg = {
            me:{
                color: this.player1.color,
                id: this.player1.id,
                position: this.player1.position},
            other:{
                color: this.player2.color,
                id: this.player2.id },
            height: height,
            width: width};
        if(this.player2.collider.isTouching(this.player1.screenCollider)){
            this.player1.seeing.add("other player");
            player1Msg.other.position = this.player2.position;
        }
        if(this.player1.collider.isTouching(this.player2.screenCollider)){
            this.player2.seeing.add("other player");
            player2Msg.other.position = this.player1.position;
        }
        this.player1.send("start",player1Msg);
        this.player2.send("start",player2Msg);
        this.player2.game = this;
        let b = this;
        loopTimer = setInterval(function(){
            loop.apply(b,[]);
        },100);
    };
    this.end = function(winner){
        winner.send("win");
        if(this.player1 == winner){
            this.player2.send("loose");
        }else {
            this.player1.send("loose");
        }
        clearInterval(loopTimer);
        delete GAMES[id];
    };
    this.addPlayer = function(player){
        this.player2 = player;
        this.player1.other = this.player2;
        this.player2.other = this.player1;
        this.start();
    }
}
function Movement(user,point){
    let player = user;
    let moveCount = 0;
    function calcDelta(point){
        if(point.y == user.position[0]){
            return [0,user.speed];
        }else if(point.y == user.position[1]){
            return [user.speed,0];
        }else{    
            let allXDelta = point.x - user.position[0];
            let allYDelta = point.y - user.position[1];
            let dx;
            let dy;
            let a = allXDelta/allYDelta;
            if(a < 0){
                dx = Math.abs(user.speed*a/(a-1)) * (Math.abs(allXDelta)/allXDelta);
                dy = Math.abs(user.speed/(a-1)) * (Math.abs(allYDelta)/allYDelta);
            }else {
                dx = Math.abs(user.speed*a/(a+1)) * (Math.abs(allXDelta)/allXDelta);
                dy = Math.abs(user.speed/(a+1)) * (Math.abs(allYDelta)/allYDelta);
            }
            return [dx,dy];
        }
    }
    function calcDirection(){
        let a = player.position[0] < point.x; //true - right, false - left
        let b = player.position[1] < point.y; //true - down , false - up
        console.log("direction: "+a+" "+b);
        return [a,b]; 
    }
    function isFinished(){
        let result;
        if(direction[0]){
            if(direction[1]){
                result = player.position[0] > point.x && player.position[1] > point.y;
            }else{
                result = player.position[0] > point.x && player.position[1] < point.y;
            }
        }else {
            if(direction[1]){
                result = player.position[0] < point.x && player.position[1] > point.y;
            }else{
                result = player.position[0] < point.x && player.position[1] < point.y;
            }
        }
        console.log("is finished: "+result+", move count: "+moveCount);
        return result;
    }
    let direction = calcDirection();
    this.target = point;
    this.d = calcDelta(this.target);
    this.speed = user.speed;
    
    this.setTarget = function(newTarget){
        this.target = newTarget;
        this.d = calcDelta(newTarget);
    }
    this.toSendingData = function(){
        return {id: player.id, target: point, currentPosition: player.position};
    }
    this.move = function(){
        player.position[0]+=this.d[0];
        player.position[1]+=this.d[1];
        player.screenCollider.position = player.collider.position = player.position;
        moveCount++;
        if(isFinished()){
            console.log("movement finished||||||||||||||||||||||||||||||||||||||||||||");
            
            delete player.movement;
        }
    };
}
function User(send,id,color){
    this.id = id;
    this.color = color;
    this.seeing = new Set();
    this.position = [1500+Math.floor(Math.random()*1000),1500];
    this.game = null;
    this.send = send;
    this.speed = playerSpeed;
    this.screenCollider = new Collider(this.position, [playerScreenX,playerScreenY]);
    this.collider = new Collider(this.position, [10,10]);
    this.toSendingData = function(){
        return {
            position:   this.position,
            color:      this.color };
    };
    this.createMovement = function(point){
        console.log("new movement||||||||||||||||||||||||||||||||||||||||||||||||||||||");
        this.movement = new Movement(this,point);
        this.send("get target",{
            movement: this.movement.toSendingData(),
            id: this.id});
        this.other.seeing.delete("other player");
        this.other.send("removeMovement",id);
    };
}

module.exports = {
    addUserToGame: function(player){
        if(waitingGame == null){
            player.send("wait",{"a":0});
            player.game = waitingGame = new Game(player);
        }else{
            waitingGame.addPlayer(player);
            waitingGame = null;
        }
    },
    addUser: function(id,send,color){
        let user = new User(send,id,color);
        users[id] = user;
        return user;
    },
    getUsers: function(){
        return users;
    },
    height: playerScreenX,
    width: playerScreenY,
    speed: playerSpeed
};