#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 cam_position;
vec2 direction;
vec3 position;
float len = 0.0;

float len_schere(vec3 a, vec3 b, float radius) {
	vec3 p = a-b;
	return sqrt(p.x+p.y+p.z) - radius;
}

vec4 cast_ray(vec3 position, vec2 direction) {
	while (len > 1000.0) {
		len = len_schere(position, vec3(0.0, 0.0, 10.0), 10.0);
		if(len < 1) {
			return vec4(1.0, 1.0, 1.0, 1.0);
		}
		position.x += len * sin(direction.x) * cos(direction.y);
		position.y += len * sin(direction.x) * sin(direction.y);
		position.z += len * cos(direction.x);
	}
	return vec4(0.0, 0.0, 0.0, 0.0);
}

void main() {
	float color = (ceil(gl_FragCoord.xy/u_resolution/1000)).x;
	gl_FragColor = vec4(color, color, color, 1.0);
}
