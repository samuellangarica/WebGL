var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_FragColor;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_FragColor = a_Color;
    gl_PointSize = 10.0;
  }`;

var FSHADER_SOURCE =`
  precision mediump float;
  varying vec4 v_FragColor;
  void main(){
    gl_FragColor = v_FragColor;
  }`;

function changeAxis() {
  var xAxis = document.getElementById("x-axis");
  var yAxis = document.getElementById("y-axis");
  var zAxis = document.getElementById("z-axis");

  if(xAxis.checked){
    kendoConsole.log("X Rotation Axis selected");
    rotAxis = [1,0,0];
  }
  if(yAxis.checked){
    kendoConsole.log("Y Rotation Axis selected");
    rotAxis = [0,1,0];
  }
  if(zAxis.checked){
    kendoConsole.log("Z Rotation Axis selected");
    rotAxis = [0,0,1];
  }
}
function changeTAxis() {
  var xAxis = document.getElementById("x-axis-t");
  var yAxis = document.getElementById("y-axis-t");
  var zAxis = document.getElementById("z-axis-t");

  if(xAxis.checked){
    kendoConsole.log("X Translation Axis selected");
    translationAxis = [1,0,0];
  }
  if(yAxis.checked){
    kendoConsole.log("Y Translation Axis selected");
    translationAxis = [0,1,0];
  }
  if(zAxis.checked){
    kendoConsole.log("Z Translation Axis selected");
    translationAxis = [0,0,1];
  }
  main();
}

function restart(){
  index = 0;
  g_points = [];
  g_colors = [];
  kendoConsole.log("Restart.");
  main();
}
function sliderOnSlide(e){
  kendoConsole.log("Slide :: new slide value is: " + e.value);
  angle = e.value;
  main();
}
function sliderOnChange(e){
  kendoConsole.log("Change :: new value is: "+ e.value);
  angle =  e.value;
  main();
}


function rangeSlideronSlide(e){
  kendoConsole.log("Slide :: new slide values are: " + e.value.toString().replace(",", " - "));
}

function rangeSliderOnChange(e){
  kendoConsole.log("Change :: new values are: " + e.value.toString().replace(",", " - "));
  var slider = $('#slider').data("kendoSlider");
  slider.min(e.value[0]);
  slider.max(e.value[1]);

  if(slider.value() < e.value[0]){
    slider.value(e.value[0]);
  }else if(slider.value() > e.value[1]){
    slider.value(e.value[1]);
  }
  slider.resize();
  angle = slider.value();
  main();
}

function txSliderOnChange(e){
  xTranslation = e.value;
  main();
}
function txSliderOnSlide(e){
  xTranslation = e.value;
  main();
}

function tySliderOnChange(e){
  yTranslation = e.value;
  main();
}
function tySliderOnSlide(e){
  yTranslation = e.value;
  main();
}

function tzSliderOnChange(e){
  zTranslation = e.value;
  main();
}
function tzSliderOnSlide(e){
  zTranslation = e.value;
  main();
}

var min = -360;
var max = 360;
$(document).ready(function(){

  $('#slider').kendoSlider({
    change: sliderOnChange,
    slide: sliderOnSlide,
    min: min,
    max: max,
    smallStep: 10,
    largeStep: 60,
    value: 0
  });

  $('#rangeslider').kendoRangeSlider({
    change: rangeSliderOnChange,
    slide: rangeSlideronSlide,
    min: min,
    max: max,
    smallStep: 10,
    largeStep: 60,
    tickPlacement: "both"
  });

  $('#slider-tx').kendoSlider({
    change: txSliderOnChange,
    slide: txSliderOnSlide,
    min: -1,
    max: 1,
    smallStep: 0.1,
    largeStep: 0.2,
    value: 0
  });

  $('#slider-ty').kendoSlider({
    change: tySliderOnChange,
    slide: tySliderOnSlide,
    min: -1,
    max: 1,
    smallStep: 0.1,
    largeStep: 0.2,
    value: 0
  });

  $('#slider-tz').kendoSlider({
    change: tzSliderOnChange,
    slide: tzSliderOnSlide,
    min: -1,
    max: 1,
    smallStep: 0.1,
    largeStep: 0.2,
    value: 0
  });


}) ;
function main(){
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  if(!gl){
    console.log('Failed to get the WebGL context');
    return;
  }

  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log('Failed to initialize shaders');
    return;
  }

  canvas.onclick = function(ev){ click(ev, gl, canvas); }
  canvas.oncontextmenu = function(ev){ rightclick(ev, gl); return false; }

  window.addEventListener('keydown', keyPressed);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  draw(gl);
}

function keyPressed(event){
   if(event.keyCode == '17'){
      //pressing ctrl key (pushes the z coordenate to front)
      z += 0.1;
      console.log(z);
   }
   if(event.keyCode == '16'){
      //pressing shift key (pushes the z coordante to back)
      z -= 0.1;
      console.log(z);
   }
}

function rightclick(ev, gl){
  surfaces.push(new Surface(g_points[index]));
  index++;
  draw(gl);
}

function initVertexBuffers(gl, surface, colors){
  vertices = surface.vertices; 
  var n = vertices.length;
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
    console.log('Failed to get location of a_Position');
    return;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  var modelMatrix = new Matrix4();
  modelMatrix.setRotate(angle, rotAxis[0], rotAxis[1], rotAxis[2]);

  var translationMatrix = new Matrix4();
  translationMatrix.setTranslate(xTranslation, yTranslation, zTranslation);
  modelMatrix.multiply(translationMatrix);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){ console.log('Failed to get location of u_ModelMatrix'); }
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){ console.log('Failed to get location of u_ViewMatrix'); }
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.0, 0.0, 1.5,   0.0, 0.0, 0.0,   0.0, 1.0, 0.0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if(!u_ProjMatrix){ console.log('Failed to get location of u_ProjMatrix'); }
  var projMatrix = new Matrix4();
  projMatrix.setPerspective(60.0, 1.0, 0.1, 5.0);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(!a_Color < 0){
    console.log('Failed to get location of a_Color');
    return;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  return n;
}

var index = 0;
var g_points = [];
var g_colors = [];
var angle = 0.0;
var rotAxis = [1,0,0];

var xTranslation = 0;
var yTranslation = 0;
var zTranslation = 0;

var surfaces = [];

function click(ev, gl, canvas){
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  if(g_points.length <= index){
    var arrayPoints = [];
    g_points.push(arrayPoints);
    var arrayColors = [];
    g_colors.push(arrayColors);
  }

  g_points[index].push(x);
  g_points[index].push(y);
  var z = 0;
  if(ev.ctrlKey){
    z= -0.5;
  }else if(ev.shiftKey){
    z = -1.0;
  }
  g_points[index].push(z);

  g_colors[index].push(Math.random());
  g_colors[index].push(Math.random());
  g_colors[index].push(Math.random());

  draw(gl);
}

function Surface(vertices) {
  this.vertices = new Float32Array(vertices);
  this.xRotation = 0;
  this.yRotation = 0;
  this.zRotation = 0;
  this.xTranslation = 0;
  this.yTranslation = 0;
  this.zTranslation = 0;
  }

function draw(gl){
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (surfaces.length == 0) {
    for(var i = 0; i < g_points.length; i++){
      const surface = new Surface(g_points[i]);
      var n = initVertexBuffers(gl, surface, new Float32Array(g_colors[i])) / 3;
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
  }else{
    for(var i = 0; i < surfaces.length; i++){
      var n = initVertexBuffers(gl, surfaces[i], new Float32Array(g_colors[i])) / 3;
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
  }

  

  
}