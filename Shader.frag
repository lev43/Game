#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 st = vec2(gl_FragCoord.x/u_resolution.x*sin(u_time/2.0)*10.0, gl_FragCoord.y/u_resolution.y*cos(u_time/2.0)*10.0);
	gl_FragColor = vec4(st.x,st.y,0.0,1.0);
}