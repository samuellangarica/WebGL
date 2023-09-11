var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main(){
    gl_Position = a_Position;
    gl_PointSize = 10.0;
  }
`;
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main(){
    gl_FragColor = u_FragColor;
  }
`;

function main(){
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  if(!gl){
    console.log('Failed to get the WebGL context');
    return;
  }

  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log('Failed to initalize shaders');
    return;
  }

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
    console.log('Failed to get location of a_Position');
    return;
  }

  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if(!u_FragColor){
    console.log('Failed to get location of u_FragColor');
    return;
  }
  gl.clearColor(1.0,1.0,1.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // SINGLE POINT
  /*
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  gl.uniform4f(u_FragColor, 1.0, 0.5, 0.0, 1.0);
  gl.drawArrays(gl.POINTS, 0, 1);
  */

  //MULTIPLE POINTS IN A ROW (NO CLICK)
  /*
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
  for(x = 1; x <= 4; x++){
    gl.vertexAttrib3f(a_Position, 0.2 * x, 0.2, 0.3);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
*/
gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position, u_FragColor); }

}

var g_points = [];
function click(ev, gl, canvas, a_Position, u_FragColor){
  // SINGLE POINT Click
  /*
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  console.log(x)
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  gl.vertexAttrib3f(a_Position, x, y, 0.3);
  gl.drawArrays(gl.POINTS, 0, 1);
  */
  // CLICK MULTIPLE POINTS AT ONCE
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  g_points.push(x);
  g_points.push(y);

  var len = g_points.length;
  for(var i = 0; i < len; i+=2){
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.31);
    gl.drawArrays(gl.POINTS, 0, 1);
  }

}
