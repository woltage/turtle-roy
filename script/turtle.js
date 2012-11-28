;(function() {
  Turtle = function(element, w, h) {
    var x = w / 2
    var y = h / 2
    var pendown = true

    element.css({position: "relative", width: w, height: h})
    var paper = createCanvas(0)
    var turtle = createCanvas(1)
    turtle.clearRect(0, 0, w, h)

    paper.translate(x, y);
    turtle.translate(x, y);

    drawTurtle()
    function createCanvas(zIndex) {
      var canvas = $("<canvas></canvas>").attr("width", w).attr("height", h)
      canvas.css({position: "absolute", left: 0, right: 0})
      canvas.css({"z-index": zIndex})
      element.append(canvas)
      return canvas.get(0).getContext('2d');
    }
    function clearTurtle() {
      turtle.clearRect(-10, -10, 21, 21)
    }
    function drawTurtle() {
      turtle.beginPath(); 
      turtle.moveTo(0, -10);
      turtle.lineTo(5, 10);
      turtle.lineTo(-5, 10);
      turtle.lineTo(0, -10);
      turtle.stroke();
    }
    var queue = []
    var polling = false
    var delay = 1
    var chunk = 5

    function enqueue(f) {
      queue.push(f)
      schedule()
    }

    function schedule() {
      if (!polling) {
        polling = true
        setTimeout(checkQueue, delay)
      }
    }

    function checkQueue() {
      polling = false
      var left = chunk
      while (left > 0 && queue.length > 0) {
        var first = queue.splice(0,1)[0]
        first()
        left--
      }
      if (queue.length > 0) {
        schedule()
      }
    }

    function delayed(f) {
      return function() {
        var args = arguments
        var command = function() {
          f.apply(null, args)
        }
        enqueue(command)
      };
    }
    var api = {
      fd: delayed(function(dist) {
        if (pendown) {
          paper.beginPath()
          paper.moveTo(0, 0)
          paper.lineTo(0, -dist)
          paper.stroke()
        }
        clearTurtle()
        paper.translate(0, -dist)
        turtle.translate(0, -dist)
        drawTurtle()
      }),
      lt: function(angle) {
        this.rt(-angle)
      },
      rt: delayed(function(angle) {
        clearTurtle()
        paper.rotate(angle * Math.PI / 180)
        turtle.rotate(angle * Math.PI / 180)
        drawTurtle()
      }),
      pendown: delayed(function() {
        pendown = true
      }),
      penup: delayed(function() {
        pendown = false
      }),
      spin: function(degrees, delay) {
        this.lt(10)
        if (degrees > 10) {
          setTimeout(function() {
            api.spin(degrees - 10, delay)
          }, delay)
        }
      }
    }
    return api
  }
})()