// Settings
const mapSize           = [80,80];
const baseColor         = "#000000";
const playerWidth       = 30;
const playerHeight      = 30;
const manaIndicatorSetting = {
    offsets: [10,10],
    size: [300,30],
    colors: {
        active: "#40b0c7",
        notActive: "#30899c",
        little: "#a83242"
    }
};

let baseSize;
let basesPositions;
let maxMana;
let speed;
let manaZonesSetting;
let width;
let height;
let screenWidth;
let screenHeight;

let buttons         = [{},{},{}];
let bullets         = [];
let littleMana      = false;
let screenCenter    = [0,0];
let state           = 0;
let stunLeft        = 0;
let freezeLeft      = 0;
let others          = {};
let me              = {};
let positionOnScreen= [0,0];
let isMouseDown     = false;
let socket          = -1;

let ctx = document.getElementById("canvas").getContext("2d");

let testSpellsMessage = [
    {
        name: "Заморозка",
        setting: [4],
        selectors: [{name: "Пуля",setting:[10,5,10],selectors:[],type: "player"}]
    },
    {
        name: "Стан",
        setting: [4],
        selectors: [{name: "Остальные",setting:[],selectors:[],type: "player"}]
    },
    {
        name: "Заморозка",
        setting: [4],
        selectors: [{name: "Остальные",setting:[],selectors:[],type: "player"}]
    },
];

function calcPosOnScreen(){
    if(me.position[0]<(0.5*screenWidth)){
        screenCenter[0] = screenWidth*0.5;
        positionOnScreen[0] = me.position[0];
    }else if(me.position[0] > width - (0.5*screenWidth)){
        screenCenter[0] = width-(screenWidth*0.5);
        positionOnScreen[0] = screenWidth+me.position[0]-width;
    }else {
        screenCenter[0] = me.position[0];
        positionOnScreen[0] = 0.5*screenWidth;
    }

    if(me.position[1]<(0.5*screenHeight)){
        screenCenter[1] = screenHeight*0.5;
        positionOnScreen[1] = me.position[1];
    }else if(me.position[1]>height-(0.5*screenHeight)){
        screenCenter[1] = height-(screenHeight*0.5);
        positionOnScreen[1] = screenHeight+me.position[1]-height;
    }else {
        screenCenter[1] = me.position[1];
        positionOnScreen[1] = 0.5*screenHeight;
    }
}
//================================================================= Drawing functions ===========================================================================
function drawMap(){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.clearRect(screenWidth-(mapSize[0]+10),10,mapSize[0],mapSize[1]);
    ctx.strokeRect(screenWidth-(mapSize[0]+10),10,mapSize[0],mapSize[1]);
    ctx.fillStyle = me.color;
    ctx.fillRect(   screenWidth-(mapSize[0]+10)+(me.position[0]/width*mapSize[0]),
                    10+(me.position[1]/height*mapSize[1]),
                    4,4);
    drawBases(true);
    drawManaZones(true);
}
function drawTarget(globalPosition){
    let x = globalPosition[0]-screenCenter[0] + (screenWidth/2);
    let y = globalPosition[1]-screenCenter[1] + (screenHeight/2);
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI, false);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "red";
    ctx.stroke();
}
function drawManaZones(isOnMap){
    basesPositions.forEach(zoneCenter=>{
        ctx.beginPath();
        if(isOnMap){
            let compressing = [mapSize[0]/width,mapSize[1]/height];
            ctx.arc(screenWidth-(mapSize[0]+10)+zoneCenter[0]/width*mapSize[0],
                    10+zoneCenter[1]/height*mapSize[1],
                    manaZonesSetting.distance/2*compressing[0],0,Math.PI*2,false);
            ctx.lineWidth = manaZonesSetting.width*compressing[0];
        }else{
            ctx.arc(zoneCenter[0] - screenCenter[0] + screenWidth/2,
                zoneCenter[1] - screenCenter[1] + screenHeight/2,
                manaZonesSetting.distance/2, 0, 2 * Math.PI, false);
                ctx.lineWidth = manaZonesSetting.width;
        }
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = "#599ede";
        ctx.stroke();
        ctx.globalAlpha = 1;
    });
}
function drawPlayer(player){
    if(!("position" in player)) return;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.position[0] - screenCenter[0] + screenWidth/2 - playerWidth/2,
                player.position[1] - screenCenter[1] + screenHeight/2 - playerHeight/2,
                playerWidth,
                playerHeight)
}
function clear(){
    ctx.clearRect(0, 0, document.getElementById("canvas").width, document.getElementById("canvas").height);
}
function drawBullets(){
    bullets.forEach(function(bullet){
        console.log('drawing bullet');
        let bulletDrawing = [bullet.position[0]-bullet.size/2-screenCenter[0]+screenWidth/2,
                    bullet.position[1]-bullet.size/2-screenCenter[1]+screenHeight/2,
                    bullet.size,
                    bullet.size];
        console.log(bulletDrawing);
        ctx.fillStyle = bullet.color;
        ctx.fillRect(...bulletDrawing);
    });
}
function drawManaIndicator(){
    ctx.fillStyle = "white"
    ctx.fillRect(...manaIndicatorSetting.offsets,...manaIndicatorSetting.size);
    ctx.fillStyle = manaIndicatorSetting.colors[littleMana?"little":(me.isInManaZone?"active":"notActive")];
    ctx.fillRect(...manaIndicatorSetting.offsets,me.mana/maxMana*manaIndicatorSetting.size[0],manaIndicatorSetting.size[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(...manaIndicatorSetting.offsets,...manaIndicatorSetting.size);
}
function drawBases(isOnMap){
    basesPositions.forEach(basePosition => {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = baseColor;
        if(isOnMap){
            let compressing = [mapSize[0]/width,mapSize[1]/height];
            ctx.fillRect(   screenWidth-(mapSize[0]+10)+basePosition[0]/width*mapSize[0],
                            basePosition[1]/height*mapSize[1]+10,
                            Math.ceil(baseSize[0]*compressing[0]),
                            Math.ceil(baseSize[1]*compressing[1]));
        }else {
            ctx.fillRect(   basePosition[0] - screenCenter[0] + screenWidth/2 -baseSize[0]/2,
                basePosition[1] - screenCenter[1] + screenHeight/2 -baseSize[1]/2,
                baseSize[0],baseSize[1]);
        }
            ctx.globalAlpha = 1;
    });
}
function drawSpellButtons(){
    buttons.forEach(function(button){
        let butPosition = button.position;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.clearRect(...butPosition);
        ctx.drawImage(button.image,...butPosition);
        ctx.strokeRect(...butPosition);
        ctx.fillStyle = "black";

        ctx.font = "20px serif";
        ctx.fillText(button.manaCost,button.position[0],button.position[1]+butPosition[3]-20);
    });
}
// ======================================================================> Classes <======================================================================
function Movement(user,point,speed,lifetime){
    let player = user;
    let isBullet = typeof(lifetime)=='number';
    let currentLifetime = lifetime;
    function calcDelta(point){
        if(point[0] == user.position[0]){
            return [0,speed];
        }else if(point[1] == user.position[1]){
            return [speed,0];
        }else{
            let allXDelta = point[0] - user.position[0];
            let allYDelta = point[1] - user.position[1];
            let dx;
            let dy;
            let a = allXDelta/allYDelta;
            if(a < 0){
                dx = Math.abs(speed*a/(a-1)) * (Math.abs(allXDelta)/allXDelta);
                dy = Math.abs(speed/(a-1)) * (Math.abs(allYDelta)/allYDelta);
            }else {
                dx = Math.abs(speed*a/(a+1)) * (Math.abs(allXDelta)/allXDelta);
                dy = Math.abs(speed/(a+1)) * (Math.abs(allYDelta)/allYDelta);
            }
            return [dx,dy];
        }
    }
    function calcDirection(){
        let a = !(player.position[0] > point[0]); //true - right, false - left
        let b = !(player.position[1] > point[1]); //true - down , false - up
        return [a,b];
    }
    function isFinished(){
        if(isBullet){
            currentLifetime--;
            return currentLifetime<0;
        }else{
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
            return false;
        }
    }
    let direction = calcDirection();
    this.target = point;
    this.d = calcDelta(point);
    this.speed = user.speed;
    this.setTarget = function(newTarget){
        this.target = newTarget;
        this.d = calcDelta(newTarget);
    }
    this.move = function(){
        player.position[0]+=this.d[0];
        player.position[1]+=this.d[1];
        if(isBullet){
            return isFinished();
        }else{
            if(isFinished()){
                delete player.movement;
            }
        }
    };
}

// ============================================================================> Algorithms <=================================================================
function updateImage(bg){
    clear();
    if(me.state == 'active' || me.state == 'freezed'){
        ctx.drawImage(  bg,
                        screenCenter[0]-screenWidth/2,
                        screenCenter[1]-screenHeight/2,
                        screenWidth,
                        screenHeight,
                        0,
                        0,
                        screenWidth,
                        screenHeight);

        if('movement' in me) drawTarget(me.movement.target)
        drawPlayer(me);
        for(let key in others){
            drawPlayer(others[key]);
        }
        drawBases();
        drawBullets();
        drawManaZones(false);
        drawMap(false);
        drawManaIndicator();
        drawSpellButtons();

        if(me.state == 'freezed'){
            ctx.font = '40px arial';
            ctx.fillStyle = 'black';
            ctx.fillText('Вы заморожены', 10, 70);
            ctx.fillText(`До разморозки ${freezeLeft}`, 10, 120);
        }
    }else if(me.state == 'stunned'){
        ctx.font = '40px arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Вы умерли', 10, 20);
        ctx.fillText(`До возрождения ${stunLeft}`, 10, 70);
    }
}
function isPlayerInManaZone(playerPos,basePos){
    function calcDistance(pointA,pointB){
        return Math.abs(Math.sqrt((pointA[0]-pointB[0])**2 + (pointA[1]-pointB[1])**2));
    }
    let distance = calcDistance(playerPos,basePos);
    return (distance > (manaZonesSetting.distance/2 - manaZonesSetting.width/2)) && (distance < (manaZonesSetting.distance/2 + manaZonesSetting.width/2))
}
function debounce(f,ms){
    let isCooldown = false;
    return function(){
        if (isCooldown) return
        f.apply(this, arguments);
        isCooldown = true;
        setTimeout(() => isCooldown = false, ms);
    }
}
function checkSpellButton(position){
    let result = -1;
    buttons.forEach(function(button,index){
        let butPosition = button.position;
        if( position[0] < (butPosition[0]+butPosition[2])&&
            position[0] > butPosition[0] &&
            position[1] < butPosition[1]+butPosition[3]&&
            position[1] > butPosition[1]){

            result = index;
        }
    });
    return result;
}
function localToGlobalCoords(x,y){
    return [x+screenCenter[0]-screenWidth/2,y+screenCenter[1]-screenHeight/2];
}

let addTarget = debounce(function(x, y){
    socket.emit('setTarget', [x, y]);
}, 100);
//===================================================================> Socket events <========================================================================
socket.on('update data',    msg=>{
    me.position = msg.me.position;
    me.mana = msg.me.mana;
    if('movement' in msg.me){
        me.movement = new Movement(me, msg.me.movement.target, speed);
    }else{
        delete me.movement;
    }

    for(let key in others){
        if(key in msg){
            others[key].position = msg[key].position;
            if('movement' in msg[key]){
                others[key].movement = new Movement(others[key],msg[key].movement.target,speed);
            }else {
                delete others[key].movement;
            }
        }
    }
});
socket.on("get target",     msg=>{
    if(msg.id == me.id){
        me.postion = msg.currentPosition;
        me.movement = new Movement(me,msg.target,speed);
        return;
    }
    if(msg.id in others){
        others[msg.id].position = msg.currentPosition;
        others[msg.id].movement = new Movement(others[msg.id],msg.target,speed);
    }
});
socket.on('bullet',         msg=>{
    console.log("|||||||||||||||||||||||||||||||||||||||||||||||");
    console.log(msg);
    let bullet = {size: msg.size, position: msg.position, color: msg.color};
    bullet.movement = new Movement(bullet,msg.target,msg.speed,msg.lifetime*10);

    bullets.push(bullet);
});
socket.on("wait",           ()=>{
    clear();
    ctx.fillText("Ждите", 10, 50);
    state = 1;
});
socket.on("removeMovement", id=>{
    if(id==me.id){
        if("movement" in me){
            delete me.movement;
        }
    }else {
        for(let key in others){
            if("movement" in others[key]) delete others[key].movement;
        }
    }
});
socket.on("activate",       ()=>{
    me.state="active";});
socket.on("stunned",        delay=>{
    stunLeft = delay;
    me.state = "stunned";
    setInterval(()=>{
        stunLeft--;
        if(stunLeft < 0) stunLeft = 0
    },1000);
});
socket.on("freezed",        delay=>{
    console.log("freezed, delay: "+delay);
    freezeLeft = delay;
    me.state = "freezed";
    setInterval(()=>{
        freezeLeft--;
        if(freezeLeft < 0) freezeLeft = 0
    },1000);
});
socket.on("not enough mana",()=>{
    littleMana = true;
    setTimeout(()=>littleMana=false,1000);
});
socket.on("set position",   msg=>{
    for(let key in others){
        if(others[key].id==msg.id) others[key].position = msg.position;
    }
});
//============================================================================> Scene <=========================================================================
export default {
    start:          (currentSocket, setting) => {
        function generateButtonsPositions(){
            const buttonsXsize = 100;
            const buttonsYsize = 100;
            const buttonsOffsets = 15;
            return [[buttonsOffsets,screenHeight-(buttonsOffsets+buttonsYsize),buttonsXsize,buttonsYsize],
                    [buttonsOffsets*2+buttonsXsize,screenHeight-(buttonsOffsets+buttonsYsize),buttonsXsize,buttonsYsize],
                    [buttonsOffsets*3+buttonsXsize*2,screenHeight-(buttonsOffsets+buttonsYsize),buttonsXsize,buttonsYsize]];
        }
        speed = setting.speed;
        $("canvas").attr("height",setting.height+"px");
        $("canvas").attr("width",setting.width+"px");
        ctx = document.getElementById("canvas").getContext("2d");
        screenWidth = setting.width;
        screenHeight = setting.height;
        width = setting.fieldWidth;
        height = setting.fieldHeight;
        let buttonsPositions = generateButtonsPositions();
        buttons.forEach(function(button,index){
            button.position = buttonsPositions[index];
        });
        baseSize = setting.baseSize;
        socket = currentSocket;
        buttons.forEach((button, index) => {
            button.manaCost = setting.me.spells[index].manaCost;
            button.image = new Image();
            button.image.src = 'graphic/spells/' + setting.me.spells[index].src;
        });
        let bg = new Image();
        bg.src = 'graphic/bg.png';
        others = setting.others;
        me = setting.me;
        me.state = "active";
        basesPositions = setting.basesPositions;
        me.isInManaZone = false;
        manaZonesSetting = setting.manaRegenZone;
        maxMana = setting.maxMana;
        calcPosOnScreen();
        window.addEventListener("load", function(){
            $('#canvas').mousedown(function(event){
                let result = checkSpellButton([a.pageX,a.pageY]);
                if(me.state == 'active'){
                    if(result == -1){
                        isMouseDown = true;
                        addTarget(...localToGlobalCoords(a.clientX,a.clientY));
                    }else{
                        socket.emit("spell",result);
                    }
                }
            });
            $("#canvas").mouseup(function(){
                isMouseDown = false;
            });
            $("#canvas").mousemove(function(a){
                if(isMouseDown) addTarget(...localToGlobalCoords(a.clientX,a.clientY));
            });
        },false);
    },
    needsUpdate:    true,
    ID:             'game',
    divID:          'game',
    update:         ()=>{
        if('movement' in me){
            me.movement.move();
            calcPosOnScreen();
        }
        me.isInManaZone = false;
        basesPositions.forEach(base=>{
            if(isPlayerInManaZone(me.position,base)){
                me.isInManaZone = true;
            }
        });
        bullets.forEach((bullet,index,array)=>{if(bullet.movement.move()) array.splice(index,1)});
        if(me.isInManaZone){
            me.mana += manaZonesSetting.regen;
            if(me.mana > maxMana){
                me.mana = maxMana;
            }
        }
        for(let key in others){
            if('movement' in others[key]){
                others[key].movement.move();
            }
        }
        updateImage(bg);
    }
}
