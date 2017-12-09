var Murmuration=function(){"use strict";var t=function(t,i,s){this.x=t,this.y=i,this.z=s};t.prototype.getDistanceFrom=function(t){var i={};return i.x=this.x-t.x,i.y=this.y-t.y,i.z=this.z-t.z,Math.abs(Math.sqrt(i.x*i.x+i.y*i.y+i.z*i.z))},t.prototype.normalise=function(t){var i=Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z);this.x=t*(this.x/i),this.y=t*(this.y/i),this.z=t*(this.z/i)},t.prototype.addVector=function(t){this.x+=t.x,this.y+=t.y,this.z+=t.z},t.prototype.multiplyBy=function(t){this.x*=t,this.y*=t,this.z*=t},t.prototype.print=function(){return"<"+this.x+","+this.y+","+this.z+">"};var i=function(t){function i(i,s,e,n){t.call(this,i,s,e),this.elem=n,this._width=this.elem.offsetWidth,this._height=this.elem.offsetHeight,this.zMod=1e-4,this.vel=new t(.1,0,0),this.maxSpeed=6,this.skill=Math.random()/10}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype._render=function(){var t=this.z*this.zMod*100+1,i="scale("+(t<0?0:t)+")",s=this.x+"px",e=this.y+"px";Object.assign(this.elem.style,{transform:i,left:s,bottom:e})},i.prototype.update=function(){var i=new t;i.x=(Math.random()-.5)*this.skill,i.y=(Math.random()-.5)*this.skill,i.z=(Math.random()-.5)*this.skill,this.vel.normalise(this.maxSpeed),this.vel.addVector(i),this.x+=this.vel.x,this.y+=this.vel.y,this.z+=this.vel.z,this._render(),i=void 0},i}(t),s=function(i){var s=this;this.starlingCount=200,this.homing=1,this.alignment=1,this.cohesion=1,this.separation=1,this.randomiseHome=!0,this.homeChangeInterval=1e3,this.neighbourDistance=400,this.parentElem=document.body,this._canvasWidth=this.parentElem.offsetWidth,this._canvasHeight=this.parentElem.offsetHeight,this.home=new t(this._canvasWidth/2,this._canvasHeight/2,0),this._starlings=[],this._homingMod=.024*this.homing,this._alignmentMod=18e-5*this.alignment,this._cohesionMod=6*this.cohesion,this._separationMod=5.994*this.separation,Object.assign(this,i);for(var e=0;e<this.starlingCount;e++)s._addStarling();this.randomiseHome&&(this._changeHomeFunc=function(){s._changeHome(),setTimeout(s._changeHomeFunc,s.homeChangeInterval)},this._changeHomeFunc())};return s.prototype.generateStarlingElement=function(){var t=document.createElement("starling");return t.style.backgroundColor="black",t.style.position="absolute",t.style.width="30px",t.style.height="30px",t},s.prototype._addStarling=function(){var t=Math.random()*this._canvasWidth/4+this._canvasWidth/4,s=Math.random()*this._canvasHeight/4+this._canvasHeight/4,e=this.generateStarlingElement(),n=new i(t,s,0,e);this._starlings.push(n),this.parentElem.append(n.elem)},s.prototype._changeHome=function(){this.home.x=this._canvasWidth*Math.random(),this.home.y=this._canvasHeight*Math.random(),this.home.z=.1},s.prototype.run=function(){var t=this;requestAnimationFrame(function(){return t.run()}),this.updateStarlings()},s.prototype._alignStarling=function(i){for(var s=0,e=new t,n=0;n<this.starlingCount;n++){var h=this._starlings[n];i!=h&&i.getDistanceFrom(h)<this.neighbourDistance&&(e.x=h.vel.x,e.y=h.vel.y,e.z=h.vel.z,s++)}e.x/=s,e.y/=s,e.z/=s,e.normalise(1),e.multiplyBy(this._alignmentMod),s>0&&i.vel.addVector(e),e=void 0},s.prototype._cohereStarling=function(i){for(var s=0,e=new t,n=new t,h=0;h<this.starlingCount;h++){var o=this._starlings[h];i!=o&&(i.getDistanceFrom(o)<this.neighbourDistance&&(e.x=o.x-i.x,e.y=o.y-i.y,e.z=o.z-i.z,s++),n.x+=o.x,n.y+=o.y,n.z+=o.z)}n.x/=this._starlings.length-1,n.y/=this._starlings.length-1,n.z/=this._starlings.length-1,e.x/=s,e.y/=s,e.z/=s,e.normalise(1),e.multiplyBy(this._cohesionMod),s>0&&i.vel.addVector(e),e=void 0,n=void 0},s.prototype._separateStarling=function(i){for(var s=0,e=new t,n=0;n<this.starlingCount;n++){var h=this._starlings[n];i!=h&&i.getDistanceFrom(h)<this.neighbourDistance&&(e.x=h.x-i.x,e.y=h.y-i.y,e.z=h.z-i.z,s++)}e.x/=s,e.y/=s,e.z/=s,e.normalise(1),e.multiplyBy(this._separationMod),s>0&&(i.vel.x+=-1*e.x,i.vel.y+=-1*e.y,i.vel.z+=-1*e.z),e=void 0},s.prototype._homeStarling=function(i){var s=new t;s.x=this.home.x-i.x,s.y=this.home.y-i.y,s.z=this.home.z-i.z,s.normalise(1),s.multiplyBy(this._homingMod*(10*Math.random())),i.vel.addVector(s),s=void 0},s.prototype.updateStarlings=function(){for(var t=0;t<this.starlingCount;t++){var i=this._starlings[t];this._alignStarling(i),this._cohereStarling(i),this._separateStarling(i),this._homeStarling(i),i.update()}},s}();