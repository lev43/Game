#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	float color = (ceil(gl_FragCoord.xy/u_resolution/1000)).x;
	gl_FragColor = vec4(color, color, color, 1.0);
}