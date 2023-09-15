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

function restart(){
  index = 0;
  g_points = [];
  g_colors = [];
  kendoConsole.log("Restart.");
  main();
}

function rxSliderOnChange(e){
  surfaces[selection].xRotation = e.value;
  main();
}
function rxSliderOnSlide(e){
  surfaces[selection].xRotation = e.value;
  main();
}

function rySliderOnChange(e){
  surfaces[selection].yRotation = e.value;
  main();
}
function rySliderOnSlide(e){
  surfaces[selection].yRotation = e.value;
  main();
}

function rzSliderOnChange(e){
  surfaces[selection].zRotation = e.value;
  main();
}
function rzSliderOnSlide(e){
  surfaces[selection].zRotation = e.value;
  main();
}
function txSliderOnChange(e){
  surfaces[selection].xTranslation = e.value;
  main();
}
function txSliderOnSlide(e){
  surfaces[selection].xTranslation = e.value;
  main();
}

function tySliderOnChange(e){
  surfaces[selection].yTranslation = e.value;
  main();
}
function tySliderOnSlide(e){
  surfaces[selection].yTranslation = e.value;
  main();
}

function tzSliderOnChange(e){
  surfaces[selection].zTranslation = e.value;
  main();
}
function tzSliderOnSlide(e){
  surfaces[selection].zTranslation = e.value;
  main();
}
//
function sxSliderOnChange(e){
  surfaces[selection].xScale = e.value;
  main();
}
function sxSliderOnSlide(e){
  surfaces[selection].xScale = e.value;
  main();
}

function sySliderOnChange(e){
  surfaces[selection].yScale = e.value;
  main();
}
function sySliderOnSlide(e){
  surfaces[selection].yScale = e.value;
  main();
}

function szSliderOnChange(e){
  surfaces[selection].zScale = e.value;
  main();
}
function szSliderOnSlide(e){
  surfaces[selection].zScale = e.value;
  main();
}

var min = -360;
var max = 360;
$(document).ready(function(){

  $('#slider-rx').kendoSlider({
    change: rxSliderOnChange,
    slide: rxSliderOnSlide,
    min: -360,
    max: 360,
    smallStep: 45,
    largeStep: 90,
    value: 0
  });

  $('#slider-ry').kendoSlider({
    change: rySliderOnChange,
    slide: rySliderOnSlide,
    min: -360,
    max: 360,
    smallStep: 45,
    largeStep: 90,
    value: 0
  });

  $('#slider-rz').kendoSlider({
    change: rzSliderOnChange,
    slide: rzSliderOnSlide,
    min: -360,
    max: 360,
    smallStep: 45,
    largeStep: 90,
    value: 0
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
    value: 1
  });
  $('#slider-sx').kendoSlider({
    change: sxSliderOnChange,
    slide: sxSliderOnSlide,
    min: 0,
    max: 5,
    smallStep: 0.1,
    largeStep: 0.2,
    value: 1
  });
  $('#slider-sy').kendoSlider({
    change: sySliderOnChange,
    slide: sySliderOnSlide,
    min: 0,
    max: 5,
    smallStep: 0.1,
    largeStep: 0.2,
    value: 1
  });
  $('#slider-sz').kendoSlider({
    change: szSliderOnChange,
    slide: szSliderOnSlide,
    min: 0,
    max: 5,
    smallStep: 0.1,
    largeStep: 0.2,
    value: 1
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

function updateSilders(){
  const sliderTx = document.getElementById('slider-tx');
  sliderTx.value = surfaces[selection].xTranslation;

  const sliderTy = document.getElementById('slider-ty');
  sliderTy.value = surfaces[selection].yTranslation;

  const sliderTz = document.getElementById('slider-tz');
  sliderTz.value = surfaces[selection].zTranslation;


  const sliderSx = document.getElementById('slider-sx');
  sliderSx.value = surfaces[selection].xScale;

  const sliderSy = document.getElementById('slider-sy');
  sliderSy.value = surfaces[selection].yScale;

  const sliderSz = document.getElementById('slider-sz');
  sliderSz.value = surfaces[selection].zScale;
}

var selection = 0;
function create_surface_selection_button(idx){
  const surfaceSelector = document.getElementById('surface-selector');
  const button = document.createElement('button');
  button.style.width = 20;
  button.style.height = 20;
  button.style.margin = 10;
  button.style.backgroundColor = 'red';
  button.style.color = 'white';
  button.innerHTML = 'Surf: ' + idx;
  button.onclick = function() {
    selection = idx;
    const pSelection = document.getElementById('current-selection');
    pSelection.textContent = 'Current Selection: ' + selection;
    updateSilders();
  };
  surfaceSelector.appendChild(button);
}

function rightclick(ev, gl){ // create surface
  create_surface_selection_button(index);
  surfaces.push(new Surface(g_points[index], g_colors[index]));

  selection = index; // select last created surface
  const pSelection = document.getElementById('current-selection');
  pSelection.textContent = 'Current Selection: ' + selection;

  updateSilders();

  index++;
  draw(gl);

}

function initVertexBuffers(gl, surface){
  var colors = surface.colors;
  var vertices = surface.vertices; 
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
  modelMatrix.setRotate(surface.xRotation, 1, 0, 0);

  var yRotationMatrix = new Matrix4();
  yRotationMatrix.setRotate(surface.yRotation, 0, 1, 0);
  modelMatrix.multiply(yRotationMatrix);

  var zRotationMatrix = new Matrix4();
  zRotationMatrix.setRotate(surface.zRotation, 0, 0, 1);
  modelMatrix.multiply(zRotationMatrix);

  

  var translationMatrix = new Matrix4();
  translationMatrix.setTranslate(surface.xTranslation, surface.yTranslation, surface.zTranslation);
  modelMatrix.multiply(translationMatrix);

  var scaleMatrix = new Matrix4();
  scaleMatrix.setScale(surface.xScale, surface.yScale, surface.zScale);
  modelMatrix.multiply(scaleMatrix);

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

var surfaces = [];
var colorR = 1
var colorG = 1
var colorB = 1

var colorpicker = document.getElementById("colorpicker");

colorpicker.addEventListener("change", function() { // change hexadecimal to rgb 
  var colorHex = colorpicker.value;
  colorR = parseInt(colorHex.substring(1, 3), 16) / 255;
  colorG = parseInt(colorHex.substring(3, 5), 16) / 255;
  colorB = parseInt(colorHex.substring(5, 7), 16) / 255;
});
var applyColorBtn = document.getElementById("apply-color");
applyColorBtn.onclick = function() {
  var nVertex = surfaces[selection].colors.length / 3
  var newColors = [];
  for(var i = 0; i < nVertex; i++){
    newColors.push(colorR);
    newColors.push(colorG);
    newColors.push(colorB);
  }
  surfaces[selection].colors = new Float32Array(newColors);
  main();
};


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

  g_colors[index].push(colorR);
  g_colors[index].push(colorG);
  g_colors[index].push(colorB);

  draw(gl);
}

function Surface(vertices, colors) {
  this.vertices = new Float32Array(vertices);
  this.colors = new Float32Array(colors);
  this.xRotation = 0;
  this.yRotation = 0;
  this.zRotation = 0;
  this.xTranslation = 0;
  this.yTranslation = 0;
  this.zTranslation = 0;
  this.xScale = 1;
  this.yScale = 1;
  this.zScale = 1;
  }

function draw(gl){
  gl.clear(gl.COLOR_BUFFER_BIT);

  for(var i = 0; i < surfaces.length; i++){
      var n = initVertexBuffers(gl, surfaces[i]) / 3;
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }

  const surface = new Surface(g_points[index]);
  var n = initVertexBuffers(gl, surface, new Float32Array(g_colors[i])) / 3;
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

  
}