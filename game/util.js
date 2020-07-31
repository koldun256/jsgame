Object.prototype.add = function(other){
	return Object.assign(this, other)
}
module.exports.generateID = () =>  Math.random().toString(36).substring(2, 15)
module.exports.middle = (a, b, c) => {
    if(b < a < c) return a
    if(a < b < c) return b
    if(a < c < b) return c
}
module.exports.removeElement = (arr, badElement) => {
    let arrCopy = [...arr]
    arrCopy.forEach((element, index) => {
        if(element == badElement)arrCopy.splice(index, 1)
    })
    return arrCopy
}
