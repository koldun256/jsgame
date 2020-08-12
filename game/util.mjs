Object.prototype.add = function(other){
	return Object.assign(this, other)
}
Array.prototype.most = function(getValue){
	let result;
	let max = -Infinity;
	this.forEach(object => {
		let value = getValue(object)
		if (value > max) {
			result = object;
			max = value;
		}
	});
	return result;
}
Array.prototype.remove = function(detectBadElement) {
	this.splice(this.findIndex(detectBadElement), 1)
}
Array.prototype.middle = function(){
	return this.sort()[Math.floor(this.length / 2)]	
}
export const generateID = () =>  Math.random().toString(36).substring(2, 15)
export const removeElement = (arr, badElement) => {
    let arrCopy = [...arr]
    arrCopy.forEach((element, index) => {
        if(element == badElement)arrCopy.splice(index, 1)
    })
    return arrCopy
}
