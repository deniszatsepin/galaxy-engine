//vertex position in model space
attribute vec3 positions;
//vertex normal in model space
attribute vec3 normals;
//uvs
attribute vec2 uvs;
//skin
attribute vec4 joint;
attribute vec4 weight;

//current transformation matrices
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;
//skin
#ifdef SKINNING
uniform mat4 jointMat[32];
#endif

//light gl_Position
uniform vec3 lightPosition;

//vertex position in view space
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vLightPosition;

//texture coordinates;
varying vec2 vTexCoord;

void main()
{
  //skin
#ifdef SKINNING
  mat4 skinMat = weight.x * jointMat[int(joint.x)];
  skinMat += weight.y * jointMat[int(joint.y)];
  skinMat += weight.z * jointMat[int(joint.z)];
  skinMat += weight.w * jointMat[int(joint.w)];
  vec4 pos = viewMatrix * modelMatrix * skinMat * vec4(positions, 1.0);
  vNormal = normalMatrix * mat3(skinMat) * normals;
#else
  vec4 pos = viewMatrix * modelMatrix * vec4(positions, 1.0);
  vNormal = normalMatrix * normals;
#endif

  //transform vertex into the eye space
  vPosition = pos.xyz;

  vLightPosition = vec3(viewMatrix * modelMatrix * vec4(lightPosition, 1.0));

  vTexCoord = uvs;

  gl_Position = projectionMatrix * pos;
}
