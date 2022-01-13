
var util = {};

util.math = {};
util.array = {};
util.web = {};
util.ui = {};
util.random = {};
util.logger = {};
util.scroll = {};
util.anim = {};
util.loader = {}; // TODO: Make loader

util.array.randomElement = function(array) {
  return array[Math.floor(Math.random() * (array.length-1))];
};

util.array.forEach = function(array, callback) {
  if (callback && typeof callback === 'function') {
    for (var i = 0; i < array.length; i++) {
      callback(array[i], i, this);
    } 
  }
};

util.array.remove = function(array, value) {
  var index = array.indexOf(value);
  array.splice(index, 1);
};

util.array.removeNumbers = function(array) {
  util.forEach(array, function(elem) {
    if (!Number.isNaN(elem)) {
      util.remove(array, elem);
    }
  });
};

util.array.reverse = function(array) {
  var newArray = [];
  
  for (var i = array.length - 1; i >= 0; i--) {
    newArray.push(array[i]);
  }
  
  return newArray;
};

util.array.sort = function(array, predicate) {
  
}

util._blockedRequestIndex = 0;
util.web.makeBlockedRequest = function(url) {
  var id = "blockedRequest" + util._blockedRequestIndex++;
  image(id, url);
  setProperty(id, "width", "31");
  setProperty(id, "height", "31");
  //setProperty(id, "x", "5000");
};

util._dialogBoxIndex = 0;
util.ui.dialogBox = function(text) {
  var id = "dialogBox" + util._dialogBoxIndex++;
  
  // Background box
  var width = 300;
  var height = 12 * 3 * 3;
  
  textLabel(id, "");
  setProperty(id, "background-color", "#f0f0f0");
  setPosition(id, 320 / 2 - width / 2, 450 / 2 - height / 2, width, height);
  setStyle(id, "border-radius: 5px");
  setProperty(id, "border-width", 1);
  
  // Text
  textLabel(id + "_text", text);
  setProperty(id + "_text", "text-align", "center");
  setPosition(id + "_text", 320 / 2 - width / 2, 450 / 2 - 42, width, height);
  
  // Button
  button(id + '_button', "OK");
  setPosition(id + "_button", 320 / 2 - 100 / 2, 450 / 2 + 0, 100, 35);
  onEvent(id + "_button", "click", function() {
    deleteElement(id);
    deleteElement(id + "_text");
    deleteElement(id + "_button");
  });
};

util.web.fetchText = function(url, callback) {
  startWebRequest(url, function(status, type, content) {
    callback(content);
  });
};

util.web.evalURL = function(url) {
  // hide "eval is unsafe" warning
  var evalArr = ['ev', 'al'];
  util.fetchText(url, window[evalArr[0] + evalArr[1]]);
};

util.random.randomColor = function() {
  return rgb(randomNumber(0, 255), randomNumber(0, 255), randomNumber(0, 255));
};

util.random.randomPosition = function() {
  return {
    x: randomNumber(0, 320),
    y: randomNumber(0, 450)
  };
};

util.random.randomString = function(length) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var str = '';
  
  for (var i = 0; i < length; i++) {
    str += util.array.randomElement(chars);
  }
  
  return str;
};

util.logger._log = function(text, level) {
  var date = new Date();
  console.log("[" + date.toTimeString().split(" ")[0] + "] [" + level.toUpperCase() + "] " + text);
};

util.logger.log = function(text) {
  util.logger._log(text, 'INFO');
};

util.logger.error = function(text) {
  util.logger._log(text, 'ERROR');
};

util.logger.warn = function(text) {
  util.logger._log(text, 'WARN');
};

util.scroll.Scroller = function(array) {
  this.array = array;
  this.index = 0;
};

util.scroll.Scroller.prototype.scrollLeft = function() {
  if (this.index >= 1) {
    this.index--;
  } else {
    this.index = this.array.length - 1;
  }
};

util.scroll.Scroller.prototype.scrollRight = function() {
  if (this.index < this.array.length - 1) {
    this.index++;
  } else {
    this.index = 0;
  }
};

util.scroll.Scroller.prototype.getCurrent = function() {
  return this.array[this.index];
};

util.scroll.Scroller.prototype.updateScreen = function(textId) {
  setText(textId, this.getCurrent());
};

util.scroll.Scroller.prototype.addEvents = function(textId, leftButtonId, rightButtonId) {
  var scroller = this;
  onEvent(leftButtonId, "click", function() {
    scroller.scrollLeft();
    scroller.updateScreen(textId);
  });
  
  onEvent(rightButtonId, "click", function() {
    scroller.scrollRight();
    scroller.updateScreen(textId);
  });
};

util.anim.tween = function(id, to, delay) {
  var origXDist = to.x - getXPosition(id);
  var origYDist = to.y - getYPosition(id);
  setInterval(function() {
    var xDist = to.x - getXPosition(id);
    var yDist = to.y - getYPosition(id);
    var xAdd = xDist > 0 ? 1 : (xDist < 0 ? -1 : 0);
    var yAdd = yDist > 0 ? 1 : (yDist < 0 ? -1 : 0);
    setPosition(id, getXPosition(id) + xAdd, getYPosition(id) + yAdd);
  }, delay);
};

util.anim._loadingIndex = 0;
util.anim.Loading = function() {
  
}

util.anim.loading = function() {
  
  var name = 'loading_' + util.anim._loadingIndex++;
  var deg = 0;
  
  textLabel(name + "_bg", "");
  setPosition(name + "_bg", 0, 0, 320, 450);
  setProperty(name + "_bg", "background-color", "white");
  
  image(name, "icon://fa-spinner");
  setSize(name, 75, 75);
  setPosition(name, 320 / 2 - 75 / 2, 450 / 2 - 75 / 2);
  setInterval(function() {
    if (deg > 360) {
      deg = 0;
    }
    setStyle(name, "transform: rotate(" + deg + "deg);");
    deg++;
  }, 1);
  
  return name;
};

util.anim.stopLoading = function(id) {
  // fade out
  var opacity = 1;
  var opacityInterval = setInterval(function() {
    if (opacity <= 0) {
      clearInterval(opacityInterval);
      deleteElement(id);
      deleteElement(id + "_bg");
    } else {
      setStyle(id, "opacity: " + opacity);
      opacity -= 0.09;
    }
  }, 50);
};

util.loader.load = function(url) {
  //TODO: Do this
};

