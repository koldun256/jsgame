module.exports = function(){
    let height = 20;
    let width = 20;
    let users = {};
    function User(){
        this.position = [0,0];
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
    return {
        addUser: function(id){
            console.log("user "+id+" added");
            users[id] = new User();
        },
        move: function(id,direction){
            console.log(id+" moved");
            users[id].move(direction);
        },
        getUsers: function(){
            //console.log(users);
            return users;
        },
        height: height,
        width: width
    };
};