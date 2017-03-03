precision highp float;
//vertex position in model space
attribute vec3 positions;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

void main()
{
  //transform vertex into the projection space
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(positions, 1.0);
}
