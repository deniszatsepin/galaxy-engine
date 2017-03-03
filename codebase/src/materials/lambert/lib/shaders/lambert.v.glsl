precision mediump float;
//vertex position in model space
attribute vec3 positions;
//vertex normal in model space
attribute vec3 normals;

//current transformation matrices
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

//light gl_Position
uniform vec3 lightPosition;

//vertex position in view space
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vLightPosition;

void main()
{
  //transform vertex into the eye space
  vec4 pos = viewMatrix * modelMatrix * vec4(positions, 1.0);
  vPosition = pos.xyz;
  vNormal = normalMatrix * normals;

  vLightPosition = vec3(viewMatrix * modelMatrix * vec4(lightPosition, 1.0));

  gl_Position = projectionMatrix * pos;
}
