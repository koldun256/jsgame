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
        //console.log(other);
        //console.log(this);
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
        //console.log("a: "+a);
        //console.log("b: "+b);
        //console.log("c: "+c);
        //console.log("d: "+d);
        return (a||b)&&(c||d);
    };
}
function Game(player){
    let loop = function(){
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
            console.log("aaa");
            if(!this.player2.seeing.has("other player")){
                this.player2.send(this.player1.movement.toSendingData());
                this.player2.seeing.add("other player");
            }
        }else{
            if(this.player2.seeing.has("other player")){
                this.player2.seeing.delete("other player")
            }
        }
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if(this.player1.screenCollider.isTouching(this.player2.collider)){
            if(!this.player1.seeing.has("other player")){
                this.player1.send(this.player1.movement.toSendingData());
                this.player1.seeing.add("other player");
            }
        }else{
            if(this.player1.seeing.has("other player")){
                this.player1.seeing.delete("other player")
            }
        }
        //this.player1.send("update",{myposition: this.player1.position, otherposition: this.player2.position});
        //this.player2.send("update",{myposition: this.player2.position, otherposition: this.player1.position});
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
    
    function calcDelta(point){
        let allXDelta = point[0] - user.position[0];
        let allYDelta = point[1] - user.position[1];
        let dx = user.speed/((allXDelta/allYDelta)+1);
        let dy = user.speed - dx;
        return [dx,dy];
    }
    function calcDirection(){
        let a = player.position[0] > point[0]; //true - right, false - left
        let b = player.position[1] > point[1]; //true - down , false - up
        return [a,b]; 
    }
    function isFinished(){
        if(direction[0]){
            if(direction[1]){
                return player.position[0] > point[0] && player.position[1] > point[1];
            }else{
                return player.position[0] > point[0] && player.position[1] < point[1];
            }
        }else {
            if(direction[1]){
                return player.position[0] < point[0] && player.position[1] > point[1];
            }else{
                return player.position[0] < point[0] && player.position[1] < point[1];
            }
        }
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
        return {player: player.id, target: point}
    }
    this.move = function(){
        player.position[0]+=this.d[0];
        player.position[1]+=this.d[1];
        if(isFinished()){
            delete player.movement;
        }
    };
}
function User(send,id,color){
    this.id = id;
    this.color = color;
    this.seeing = new Set();
    this.position = [Math.floor(Math.random()*width),Math.floor(Math.random()*height)];
    //console.log(this.position);
    this.game = null;
    this.send = send;
    this.speed = 2;
    this.screenCollider = new Collider(this.position, [playerScreenX,playerScreenY]);
    this.collider = new Collider(this.position, [10,10]);
    this.toSendingData = function(){
        return {
            position:   this.position,
            color:      this.color };
    };
    this.createMovement = function(point){
        console.log("movement creation");
        this.movement = new Movement(this,point);
        //console.log(this);
        this.send("get target",{
            movement: this.movement.toSendingData(),
            id: this.id});
        
        if(this.other.seeing.has("other player")){
            console.log("sending movement to other");
            this.other.send("get movement",{
                movement: this.movement.toSendingData(),
                id:this.id });
        }else{
            this.other.send("removeMovement",id);
        }
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
    move: function(id,direction){
        users[id].move(direction);
    },
    getUsers: function(){
        return users;
    },
    height: playerScreenX,
    width: playerScreenY
};