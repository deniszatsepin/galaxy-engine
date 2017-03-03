precision mediump float;

#pragma glslify: lambert = require(glsl-diffuse-lambert)

//vertex position, normal and light position in view space
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vLightPosition;

void main()
{
  //normalize normal here for smoother gradients
  vec3 N = normalize(vNormal);
  //calculate direction towards the light
  vec3 L = normalize(vLightPosition - vPosition);
  vec3 eyeDir = normalize(-vPosition);
  vec3 ambient = vec3(0.04, 0.09, 0.04);

  if (dot(N, eyeDir) < 0.0) {
    gl_FragColor = vec4(ambient, 1.0);
  } else {
    //diffuse intensity
    float Id = lambert(L, N);

    //surface and light color, full white
    vec4 baseColor = vec4(1.0);
    vec4 lightColor = vec4(1.0);

    vec4 finalColor = vec4((baseColor.rgb * lightColor.rgb * Id) + ambient, 1.0);
    gl_FragColor = finalColor;
  }
}
