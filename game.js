// В этом файле описан геймплей
let selectors = { //Здесь описаны селекторы и их функционал
    player: [
        {
            name: "Остальные", // Название в меню создания заклинания
            defenition: "Выбирает всех игроков игры кроме тебя", // Описание в меню создания заклинания
            setting:[], // Значения, которые должен ввести поьзователь при создании
            startValues:[], // Значения по умолчанию
            manaCost: ()=>{return 3}, // Функция подсчёта стоимости маны селектора в зависимости от введённых пользователем значений и селекторов
            selectors: [],// Массив селекторов, нужных этому селектору
            validValues: [], // Массив функций, проверяющих, является ли введённое пользователем значение корректным
            onCast: function(){}, // Функция вызывающаяся при касте
            checkSelect: function(){ // Вызывается каждый кадр и проверяет, подверглись ли какие-то игроки селекторы в этот кадр
                let selector = this;
                return {result: selector.caster.others, isFinished: true};
            },
            onSelect:[] // Массив функций, которые вызываются, когда дочерний селектор активирован
        },
        {
            name: "Пуля",
            defenition: "Выбирает игрока, поражённого пулей",
            setting:[{type: 'number',name: 'Скорость'},{type: 'number', name: 'Продолжительность жизни'},{type: 'number',name: 'Размер'}],
            startValues:[10,5,3],
            manaCost: ()=>{return 1},
            selectors: [],
            toSendingData: function(color){
                return {color: color,position: this.bullet.position, speed: this.values[0], size: this.values[2], lifetime: this.values[1], target: this.bullet.movement.target};
            },
            validValues: [value=>{return typeof value=='number'},value=>{return typeof value=='number'},value=>{return typeof value=='number'}],
            onCast: function(caster){
                let bullet = {position: [...caster.position],id: Symbol()};
                this.bullet = bullet;
                let newTarget = ('movement' in caster)?
                                caster.movement.target:
                                    [   caster.position[0]+caster.prevDelta[0],
                                        caster.position[1]+caster.prevDelta[1]  ];
                bullet.movement = new Movement( bullet,
                                                newTarget,
                                                this.values[0],
                                                this.values[1]*10);
                bullet.collider = new Collider([...bullet.position],[this.values[2],this.values[2]]);
                caster.game.objects.bullets.push(bullet);
                let sendingData = this.toSendingData(caster.color);
                caster.send('bullet',sendingData);
            },
            checkSelect: function(caster){
                let selector = this;
                if(this.bullet.movement.move()){
                    return {result: null, isFinished: true};
                }
                caster.others.forEach(other=>{
                    if(selector.bullet.collider.isTouching(other.collider)) {
                        return {result: [other], isFinished: false};
                    }
                    if(other.screenCollider.isTouching(selector.bullet.collider)) {
                        if(!other.seeing.has(selector.bullet.id)){
                            other.send('bullet',selector.toSendingData(caster.color));
                            other.seeing.add(selector.bullet.id);
                        }
                    }else {
                        other.seeing.delete(selector.bullet.id);
                    }
                });
                return {result: null, isFinished:false};
            },
            onSelect:[]
        }
    ]
};

let actions = [{ // Тут описываются действия, шаблон почти тот же, что и селекторов
    name: "Стан",
    definishion: "Игрок на хъ секунд тепряет возможность что-либо делать, после чего телепортируется на базу",
    actionManaCost: function(){ // Стоимость действия
        return 200+this.values[0]*40;
    },
    spellManaCost: function(AMC,SMCs){ //Стоимость всего заклинания, AMC - AcitonManaCost - стоимость действия, SMCs = SelectorManaCostS - стоимость дочерних селекторов
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
            setTimeout(function(){
                player.position = player.team.basePosition;
                player.state = "active";
                player.send("activate");
                player.mana = 0;
            },action.values[0]*1000);
        });
    }],
    src: "spells/stun.png"
},
{
    name: "Заморозка",
    definishion: "Игрок на хъ секунд тепряет возможность что-либо делать",
    actionManaCost: function(){
        return this.values[0]*40;
    },
    spellManaCost: function(AMC,SMCs){
        return AMC*SMCs[0];
    },
    setting: [{type: "number",name: "Длительность заморозки"}],
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
            player.state = "freezed";
            if("movement" in player) delete player.movement
            player.send("freezed",action.values[0]);
            setTimeout(function(){
                player.state = "active";
                player.send("activate");
            },action.values[0]*1000);
        });
    }],
    src: "spells/freeze.png"
}];
// Игровые константы
const frameDelay = 100; // FPS
const maxMana = 2000; // Максимальный запас маны
const playersInTeam = 1; // Количество игроков в команде
const teamsInGame = 2; // Количество команд в игре
const startMana = 1000; // Начальное количество маны
const manaRegen = 10; // Регенерация маны в зонах регенерации маны
const baseSize = [100,100]; // Размер сторон базы
const manaZoneWidth = 100; // Ширина мана-круга
const manaZoneDistance = 1500; // Расстояние от базы до мана-круга
const updateDataDelay = 1000; // Длительность между синхронизациями
const playerSpeed = 10; // Скорость игрока
const height = 6000; // Высота поля
const width = 6000; // Ширина поля
const basesPositions = [[width/4,height/2],[width*0.75,height/2]]; // Положения баз
const playerScreenX = 900; // Ширина экрана
const playerScreenY = 900; // Высота экрана

let users = {}; // Тут хранятся объекты игроков
let GAMES = {}; // Тут хранятся объекты партий
let waitingGame = new Game();

function isPlayerInManaZone(playerPos,basePos){ // Алгоритм определения, находится ли игрок в мана-круге
    // Основной принцип: вычисляется расстояние от игрока до базы, и проверяется, примерно ранво ли это расстоянию от базы до кольца
    function calcDistance(pointA,pointB){ // Алгоритм вычисления расстояния от игрока до базы
        return Math.abs(Math.sqrt((pointA[0]-pointB[0])**2 + (pointA[1]-pointB[1])**2));
    }
    let distance = calcDistance(playerPos,basePos);
    let result = (distance > (manaZoneDistance/2 - manaZoneWidth/2)) && (distance < (manaZoneDistance/2 + manaZoneWidth/2));
    return result;
}

function Collider(center,size){ // Класс прямоугольной области сталкивания
    // Установка параметров коллайдера исходя из аргументов
    this.sizeX = size[0]/2;
    this.sizeY = size[1]/2;
    this.position = center;
    // Алгоритм определения,касается ли этот коллайдер другого
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
    }
}
// Класс игровой партии
function Game(){
    // Установка позже заполняющихся параметров, лень объяснять каждый из них
    this.players = [];
    this.activeSelectors = [];
    this.teams = [];
    this.objects = {
        bullets: []
    };
    this.loops = 0;
    let selectorsLoops = [];
    let playersCount = 0;
    const maxPlayers = teamsInGame * playersInTeam;
    let updateLoopID;

    let loop = function(){ // выполняется каждый кадр игры
        this.loops++;
        let game = this;
        this.players.forEach(function(player){ // До конца функции - код, выполняющийся для каждого игрока, текущий - переменная player

            if("movement" in player/*Если текущий игрок находится в движении*/){
                player.movement.move(); // Игрок двигается на один шаг
                player.isOnBase = player.collider.isTouching(player.team.baseCollider); // Обновляется нахождение игрока на базе
                player.isInManaZone = isPlayerInManaZone(player.position,player.team.basePosition); // Обновляется нахождение игрока в зоне маны
            }

            if(player.isInManaZone){ // Если текущий игрок в зоне маны
                player.mana += manaRegen; // Ему востанавливается немного маны
                if(player.mana > maxMana){ // Если запас маны игрока переполнен,
                    player.mana = maxMana; // Ему возвращается значение максимального запаса маны
                }
            }

            player.others.forEach(function(other){ // До конца функции - код, выполняющийся для каждого из других игроков игрока player, текущий - переменная other
                if(player.screenCollider.isTouching(other.collider)){ // Если other видим для player
                    if(!player.seeing.has(other.id)){ // Если player до этого не видел other (значит этот игрок только сейчас заметил other)
                        player.seeing.add(other.id); // Во множество видимых объектов для этого игрока добавляется other
                        if("movement" in other){ // Если other сейчас в движении
                            player.send("get target",other.movement.toSendingData()); // тогда player'у отправляются данные об other включая данных движения
                        }else { // иначе
                            player.send("set position",{id: other.id, position: other.position}); // player'у отправляются только данные об положении other
                        }
                    }
                }else{ // Если other невидим для player
                    player.seeing.delete(other.id); // Тогда удаляем other'а из списка видимого для player'a
                }
            });
        });

        this.activeSelectors.forEach(function(selector,index,arr){ // Для каждого активного selector'а в игре
            let result = selector.selector.checkSelect.apply(selector.selector,[selector.caster]); // Вызывается checkselect для этого selector'a, а результат записывается в result
            if(result.result != null){ // Если селеткор что-то выбрал, то
                selector.selector.sendToParent(result.result); // То мы отправляем данные об этом "родителю" селектора
            }
            if(result.isFinished){ // Если селектор закончен, то
                arr.splice(index,1); // он удаляется из списка активных селекторов
            }
        });
    };
    function updateLoop(){ // Функция синхронизации
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
function Movement(user,point,speed,lifetime){
    let isBullet = typeof(lifetime)=='number';
    let currentLifetime = lifetime;
    let player = user;
    let moveCount = 0;
    function calcAllDelta(){
        return [point[0] - user.position[0], point[1] - user.position[1]];
    }
    function calcDelta(point){
        if(point[0] == user.position[0]){
            return [0,speed];
        }else if(point[1] == user.position[1]){
            return [speed,0];
        }else{
            let dx;
            let dy;
            let a = this.allDelta[0]/this.allDelta[1];
            if(a < 0){
                dx = Math.abs(speed*a/(a-1)) * (Math.abs(this.allDelta[0])/this.allDelta[0]);
                dy = Math.abs(speed/(a-1)) * (Math.abs(this.allDelta[1])/this.allDelta[1]);
            }else {
                dx = Math.abs(speed*a/(a+1)) * (Math.abs(this.allDelta[0])/this.allDelta[0]);
                dy = Math.abs(speed/(a+1)) * (Math.abs(this.allDelta[1])/this.allDelta[1]);
            }
            return [dx,dy];
        }
    }
    function calcDirection(){
        let a = player.position[0] < point[0]; //true - right, false - left
        let b = player.position[1] < point[1]; //true - down , false - up
        return [a,b];
    }
    function isFinished(){
        let result;
        if(isBullet){
            currentLifetime--;
            return currentLifetime < 0;
        }else{
            if(direction[0]){
                if(direction[1]){
                    result = player.position[0] > point[0] && player.position[1] > point[1];
                }else{
                    result = player.position[0] > point[0] && player.position[1] < point[1];
                }
            }else {
                if(direction[1]){
                    result = player.position[0] < point[0] && player.position[1] > point[1];
                }else{
                    result = player.position[0] < point[0] && player.position[1] < point[1];
                }
            }
            return result;
        }
    }
    let direction = calcDirection();
    this.target = point;
    this.allDelta = calcAllDelta();
    this.d = calcDelta.apply(this,[this.target]);
    this.speed = user.speed;

    this.setTarget = function(newTarget){
        this.target = newTarget;
        this.d = calcDelta(newTarget).apply(this,[]);
    }
    this.toSendingData = function(){
        return {id: player.id, target: point, currentPosition: player.position};
    }
    this.move = function(){
        player.position[0]+=this.d[0];
        player.position[1]+=this.d[1];
        if(isBullet){
            player.collider.position = player.position;
        }else{
            player.screenCollider.position = player.collider.position = player.position;
        }
        moveCount++;
        if(isBullet){
            return isFinished();
        }else{
            if(isFinished()){
                player.prevDelta = this.allDelta;
                delete player.movement;
            }
        }
    };
}
function Spell(player){
    this.action = {};
    this.player = player;
    function addAction(action){
        let n = Object.assign({selectors:[],values: []},action);
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
        return this.action.onCast.apply(this.action,[]).activateSelectors;
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
                    trueSelector = Object.assign({caster: player, selectors:[],values:[]},a);
                }
            });
            selector.setting.forEach((setting,index)=>{
                if(trueSelector.validValues[index](setting)){
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
    this.prevDelta = [1,1];
    this.color = color;
    this.seeing = new Set();
    this.position = position;
    this.game = null;
    this.send = send;
    this.speed = playerSpeed;
    this.screenCollider = new Collider(this.position, [playerScreenX,playerScreenY]);
    this.collider = new Collider(this.position, [50,50]);
    this.toSendingData = function(){
        return {
            position:   this.position,
            color:      this.color };
    };
    this.cast = function(index){
        let game = this.game;
        let player = this;
        if(this.mana>=this.spells[index].manaCost){
            this.mana -= this.spells[index].manaCost;
            this.spells[index].cast().forEach(selector=>{
                selector.onCast.apply(selector,[player]);
                game.activeSelectors.push({ selector: selector,
                                            caster: player  });
            });
        }else{
            this.send("not enough mana");
        }
    };
    this.createMovement = function(point){
        if('movement' in this){
            this.prevDelta = [...this.movement.allDelta];
        }
        this.movement = new Movement(this,point,this.speed);
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
