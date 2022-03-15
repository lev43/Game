#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 center = vec3(u_resolution/2.0, 0.0);
vec3 light = vec3(0.0, 10000000.0, 0.0);

vec4 schere1 = vec4(sin(u_time*2.0)*150.0+u_resolution.x/2.0, cos(u_time*2.0)*150.0+u_resolution.x/2.0, 1.0, 100.0);
vec4 schere2 = vec4(u_resolution/2.0, 1.0, 100.0);

float get_length_to_schere(vec3 p, vec4 s) {
	return length(p - s.xyz) - s.w;
}


float get_dist(vec3 position) {
	return min(get_length_to_schere(position, schere1), get_length_to_schere(position, schere2));
}

vec3 getNormal(vec3 p)
{
	float d = get_dist(p);
	vec2 e = vec2(0.001, 0.0);
	vec3 n = d - vec3(get_dist(p - e.xyy), get_dist(p - e.yxy), get_dist(p - e.yyx));
	return normalize(n);
}

float get_light(vec3 p, vec3 light_pos) {
    vec3 l = normalize(light_pos - p);
    vec3 n = getNormal(p);
    float dif = clamp(dot(n, l) * 0.5 + 0.5, 0.0, 1.0);
    return dif;
}

vec3 raymarching(vec3 ray_origin, vec2 direction) {
	vec3 position = ray_origin;
	for(float i = 0.0; i < 100.0; i++) {
		float len = get_dist(position);
		if (len < 0.1) return position;
    if (len > 1.0) break;
		position = vec3(
			len * sin(direction.x) * cos(direction.y),
			len * sin(direction.x) * sin(direction.y),
			len * cos(direction.x)
		);
	}
	return vec3(ray_origin);
}

void main() {
  vec2 direction = vec2(0.0, 0.0);
	gl_Position = vec4(raymarching(vec3((gl_ModelViewProjectionMatrix*gl_Vertex).xy, 0.0), direction), 1.0);
  // gl_FrontColor = vec4(vec3(get_light(gl_Position.xyz, light)), 1.0);
}