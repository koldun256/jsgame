const frameDelay = 100;
const maxMana = 2000;
let playersInTeam = 1;
let selectors = {
    player: [
        {
            name: "Остальные",
            defenition: "Выбирает всех игроков игры кроме тебя",
            setting:[],
            startValues:[],
            manaCost: ()=>{return 3},
            selectors: [],
            validValues: [],
            onUse: function(){},
            checkSelect: function(){
                let selector = this;
                return {result: selector.caster.others, isFinished: true};
            },
            onSelect:[]
        }
    ]
};
let actions = [{
    name: "Стан",
    definishion: "Игрок на хъ секунд тепряет возможность что-либо делать, после чего телепортируется на базу",
    actionManaCost: function(){
        return 200+this.values[0]*40;
    },
    spellManaCost: function(AMC,SMCs){
        return AMC*SMCs[0];
    },
    setting: [{type: "number",name: "Длительность стана"}],
    startValues: [10],
    validValues: [function(newValue){
        if(typeof newValue == "number"){
            return newValue >= 1 && newValue <=20;
        }
        return false;
    }],
    selectorsSetting: [{type: "player",
                name: "Игрок, который будет убит"}],
    onCast: function(){
        return {activateSelectors: [this.selectors[0]]};
    },
    onSelect: [function(selectorResult){
        let action = this;
        selectorResult.forEach(function(player){
            player.state = "stunned";
            if("movement" in player) delete player.movement
            player.send("stunned",action.values[0]);
            console.log(action.values[0]);
            setTimeout(function(){
                player.position = player.team.basePosition;
                player.state = "active";
                player.send("activate");
                player.mana = 0;
                console.log(";");
            },action.values[0]*1000);
        });
    }],
    src: "graphic/spells/stun.png"
}];
let teamsInGame = 2;
let startMana = 1000;
let manaRegen = 10;
let baseSize = [100,100];
let manaZoneWidth = 100;
let manaZoneDistance = 1500;
let updateDataDelay = 1000;
let playerSpeed = 10;
let height = 6000;
let width = 6000;
let basesPositions = [[width/4,height/2],[width*0.75,height/2]];
let users = {};
let GAMES = {};
let waitingGame = new Game();
let playerScreenX = 900;
let playerScreenY = 900;

function isPlayerInManaZone(playerPos,basePos){
    function calcDistance(pointA,pointB){
        return Math.abs(Math.sqrt((pointA[0]-pointB[0])**2 + (pointA[1]-pointB[1])**2));
    }
    let distance = calcDistance(playerPos,basePos);
    let result = (distance > (manaZoneDistance/2 - manaZoneWidth/2)) && (distance < (manaZoneDistance/2 + manaZoneWidth/2));
    return result;
}
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
function Game(){
    this.players = [];
    this.activeSelectors = [];
    let selectorsLoops = [];
    let playersCount = 0;
    const maxPlayers = teamsInGame * playersInTeam;
    this.teams = [];
    this.loops = 0;
    let updateLoopID;
    let loop = function(){
        this.loops++;
        let game = this;
        this.players.forEach(function(player){
            if("movement" in player){
                player.movement.move();
                player.isOnBase = player.collider.isTouching(player.team.baseCollider);
                player.isInManaZone = isPlayerInManaZone(player.position,player.team.basePosition);
            }
            if(player.isInManaZone){
                player.mana += manaRegen;
                if(player.mana > maxMana){
                    player.mana = maxMana;
                }
            }
            player.others.forEach(function(other){
                if(player.screenCollider.isTouching(other.collider)){
                    if(!player.seeing.has(other.id)){
                        player.seeing.add(other.id);
                        if("movement" in other){
                            player.send("get target",other.movement.toSendingData());
                        }else {
                            player.send("set position",{id: other.id, position: other.position});
                        }
                    }
                }else{
                    player.seeing.delete(other.id);
                }
            });
        });

        this.activeSelectors.forEach(function(selector,index,arr){
            let result = selector.checkSelect();
            if(result.result){
                selector.sendToParent(result.result);
            }
            if(result.isFinished){
                arr.splice(index,1);
            }
        });
    };
    function updateLoop(){
        this.send("update data",function(player){
            let message = {me: {position: player.position, mana: player.mana}};
            if("movement" in player){
                message.me.movement = player.movement.toSendingData();
            }
            player.others.forEach(function(otherPlayer){
                if(player.seeing.has(otherPlayer.id)){
                    message[otherPlayer.id] = {position: otherPlayer.position};
                    if("movement" in otherPlayer){
                        message[otherPlayer.id].movement = otherPlayer.movement;
                    }
                }
            });
            return message;
        });
    }
    let loopTimer;
    let id = Symbol();
    this.colliders = [];
    GAMES[id] = this;
    this.send = function(msg,func){
        this.teams.forEach(function(team){
            team.send(msg,func);
        });
    }
    this.start = function(){
        this.players.forEach(player=>player.position = [...player.team.basePosition]);
        this.send("start",function(player){
            let spells = [];
            player.spells.forEach(spell=>spells.push(spell.toSendingData()));
            let message = {
                me:{
                    position: player.position,
                    color: player.color,
                    id: player.id,
                    mana: player.mana,
                    basePosition: player.team.basePosition,
                    spells: spells},
                others: {},
                basesPositions: basesPositions,
                manaRegenZone: {
                    width: manaZoneWidth,
                    distance: manaZoneDistance,
                    regen: manaRegen},
                maxMana: maxMana};
            player.others.forEach(function(other){
                message.others[other.id] = {color: other.color};
                if(player.screenCollider.isTouching(other.collider)){
                    message.others[other.id].position = other.position;
                }
            });
            return message;
        });
        let game = this;
        this.players.forEach(player => player.game=game);
        updateLoopID = setInterval(function(){
            updateLoop.apply(game,[]);
        },updateDataDelay);
        loopTimer = setInterval(function(){
            loop.apply(game,[]);
        },frameDelay);
    };
    this.end = function(winner){
        winner.send("win");
        winner.others.forEach(other=>other.send("loose",()=>{return 0}));
        clearInterval(loopTimer);
        clearInterval(updateLoopID);
        delete GAMES[id];
    };
    this.addPlayer = function(player){
        playersCount++;
        player.others = [...this.players];
        this.players.forEach(function(curPlayer){
            curPlayer.others.push(player);
        });
        this.players.push(player);
        if(playersCount%playersInTeam==0){
            let newTeam = new Team(basesPositions[this.teams.length]);
            newTeam.others = [...this.teams];
            this.teams.forEach(function(oldTeam){
                oldTeam.others.push(newTeam);
            });
            this.teams.push(newTeam);
        }
        this.teams[this.teams.length - 1].addPlayer(player);
        if(playersCount==maxPlayers){
            this.start();
            return true;
        }
        return false;
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
            delete player.movement;
        }
    };
}
function Spell(player){
    this.action = {};
    this.player = player;
    function addAction(action){
        let n = Object.assign({selectors:[]},action);
        this.action = n;
        this.action.values = n.startValues;
    };
    function addSelector(destSelector,selector){
        destSelector = Object.assign({},selector);
    };
    function changeActionValue(newValue,id){
        if(this.action.validValues[id](newValue)){
            this.action.values[id] = newValue;
        }
    };
    this.manaCost = 0;
    this.cast = function(){
        return this.action.onCast().activateSelectors;
    }
    this.toSendingData = function(){
        let action = this.action;
        return {src: action.src,manaCost: action.curManaCost};
    }
    this.fromSendingData = function(sendingData){
        let spell = this;
        actions.forEach(curAction=>{
            if(sendingData.name == curAction.name){
                addAction.apply(spell,[curAction]);
            }
        });
        function calcManaCost(action){
            function calcManaCostS(selectors){
                let result = [];
                selectors.forEach(selector=>result.push(selector.manaCost(calcManaCostS(selector.selectors))));
                return result;
            }
            return action.spellManaCost(action.actionManaCost(),calcManaCostS(action.selectors));
        }
        function analiseSelector(selector){
            let trueSelector;
            selectors[selector.type].forEach(a=>{
                if(a.name == selector.name){
                    trueSelector = Object.assign({caster: player},a);
                }
            });
            selector.setting.forEach((setting,index)=>{
                if(trueSelector.validValues(setting,index)){
                    trueSelector.values[index] = setting;
                }
            });
            selector.selectors.forEach(function(rawSelector,index){
                let newSelector = analiseSelector(rawSelector);
                newSelector.sendToParent = function(result){trueSelector.onSelect[index].apply(trueSelector,[result])};
                trueSelector[index] = newSelector;
            });
            return trueSelector;

        }
        sendingData.selectors.forEach(function(selector,index){
            let newSelector = analiseSelector(selector);
            newSelector.sendToParent = function(result){spell.action.onSelect[index].apply(spell.action,[result])}
            spell.action.selectors[index] = newSelector;
        });
        sendingData.setting.forEach(function(value,id){
            if(spell.action.validValues[id](value)){
                spell.action.values[id] = value;
            }
        });
        spell.manaCost = this.action.curManaCost = calcManaCost(this.action);
    }
}
function Team(basePosition){
    this.baseCollider = new Collider(basePosition, baseSize[0]);
    this.basePosition = basePosition;
    this.players = [];
    this.others = [];
    this.addPlayer = function(newPlayer){
        newPlayer.team = this;
        newPlayer.teamMates = this.players;
        this.players.forEach(function(player){
            player.teamMates.push(newPlayer);
        });
        this.players.push(newPlayer);
    }
    this.send = function(msgText,func){
        this.players.forEach(player=>player.send(msgText,func(player)));
    }
}
function User(send,id,color,position){
    this.isOnBase = true;
    this.spells = [];
    this.state = "active";
    this.isInManaZone = false;
    this.others = [];
    this.id = id;
    this.mana = startMana;
    this.teamMates = [];
    this.color = color;
    this.seeing = new Set();
    this.position = position;
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
    this.cast = function(index){
        let game = this.game;
        if(this.mana>=this.spells[index].manaCost){
            this.mana -= this.spells[index].manaCost;
            this.spells[index].cast().forEach(spell=>game.activeSelectors.push(spell));
        }else{
            this.send("not enough mana");
        }
    };
    this.createMovement = function(point){
        this.movement = new Movement(this,point);
        this.send("get target",this.movement.toSendingData());
        let id = this.id;
        this.others.forEach(other=>{
            other.seeing.delete(id);
            other.send("removeMovement",id);
        });
    };
}

module.exports = {
    addUserToGame: function(player,spells){
        player.game = waitingGame;
        spells.forEach(spell=>{
            let newSpell = new Spell(player);
            newSpell.fromSendingData(spell);
            player.spells.push(newSpell);
        });
        if(waitingGame.addPlayer(player)){
            waitingGame = new Game();
        }else {
            player.send("wait");
        }
    },
    addUser: function(id,send,color){
        let user = new User(send,id,color,[0,0]);
        users[id] = user;
        return user;
    },
    getUsers: function(){
        return users;
    },
    height: playerScreenX,
    width: playerScreenY,
    speed: playerSpeed,
    fieldWidth: width,
    fieldHeight: height,
    baseSize: baseSize};