function readFile(path){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send();
    return xhr.responseText;
}
