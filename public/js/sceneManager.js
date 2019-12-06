let SceneManager = (function(){
    const frameDelay = 100;
    const mustHave = ['ID', 'divID', 'start'];
    let Scenes = new Map();
    let first = true;
    let currentScene = {};
    $('body > div').css('display', 'none');
    let manifest = readFile('js/scenes/manifest');
    let scenesNames = manifest.split(' ');
    for(let name of scenesNames){
        let scene;
        import('js/scenes/'+name).then(module=>scene=module.Scene);
        Map.set(name, scene);
    }
    return {
        browse: function(id, ...args){
            if(!Scenes.has(id)){
                console.log('trying to open nonexistent scene');
                return;
            }
            let obj = currentScene = Scenes.get(id);
            if(first){
                first = false;
            }else {
                $('#'+currentScene.id).css('display', 'none');
                if('loopID' in currentScene) clearInterval(currentScene.loopID)
            }
            $('#'+id).css('display', 'block');
            obj.start(...args);
            if(obj.needsUpdate) obj.loopID = setInterval(obj.loop, frameDelay);
        }
    }
})();
