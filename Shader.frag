#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 color1 = vec3(1.0, 0.0, 0.0);
vec3 color2 = vec3(0.0, 1.0, 1.0);

float len(vec2 a, vec2 b) {
	vec2 c = pow(a-b, vec2(2.0));
	return sqrt(c.x+c.y);
}

float len(vec3 a, vec3 b) {
	vec3 c = pow(a-b, vec3(2.0));
	return sqrt(c.x+c.y+c.z);
}

void main() {
	gl_FragColor = vec4(step(len(gl_FragCoord.xy, u_resolution.xy/2.0), 10000.0) * mix(color1, color2, abs(smoothstep(0.8, 1.0, cos(u_time*1.5)))) / len(gl_FragCoord.xy, u_resolution.xy/2.0) * 20.0, 1.0);
}
