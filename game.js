let height = 20;
let width = 20;
let users = {};
let waitingGame = null;
function User(send){
    this.position = [0,0];
    this.game = null;
    this.send = send;
    this.toSendingData = function(){
        return {position: this.position};
    };
    this.move = function(direction){
        switch(direction){
            case "ArrowLeft":
                if(((!this.position[0]-1)<0)){
                    this.position[0]--;
                }
                break;
            case "ArrowUp":
                if(!((this.position[1]-1)<0)){
                    this.position[1]--;
                }
                break;
            case "ArrowRight":
                if(!((this.position[0]+1)>(width-1))){
                    this.position[0]++;
                }
                break;
            case "ArrowDown":
                if(!((this.position[1]+1)>(height-1))){
                    this.position[1]++;
                }
                break;
        }
    }
}

module.exports = {
    newGame: function(player, startCallback){
        console.log("game created");
        waitingGame = {
            player1: player,
            start: startCallback,
            addPlayer: player=>{
                waitingGame.player2 = player;
                console.log("a");
                startCallback();
            }
        };
        player.game = waitingGame;
    },
    addUserToGame: function(player,startCallback2){
        if(waitingGame == null){
            player.send("wait");
            this.newGame(player,()=>{
                console.log("game started");
                startCallback2(waitingGame.player1,waitingGame.player2);
                waitingGame.player1.send("start",{a:"a"});
                waitingGame.player2.game = waitingGame;
                console.log(waitingGame.player2);
                waitingGame.player2.send("start",{a:"a"});
            });
        }else{
            waitingGame.addPlayer(player);

            
            waitingGame = null;
        }
    },
    addUser: function(id,send){
        console.log("user "+id+" added");
        let user = new User(send);
        users[id] = user;
        return user;
    },
    move: function(id,direction){
        console.log(id+" moved");
        users[id].move(direction);
    },
    getUsers: function(){
        return users;
    },
    height: height,
    width: width
};