#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 u_coord;

vec3 center = vec3(u_resolution/2.0, 0.0);
vec3 light = vec3(sin(u_time/2.0) * 10000000.0, cos(u_time/2.0) * 10000000.0,  0.0);

vec4 schere1 = vec4(sin(u_time*2.0)*200.0+u_resolution.x/2.0, cos(u_time*2.0)*200.0+u_resolution.x/2.0, 10.0, 25.0);
vec4 schere2 = vec4(
	sin(u_time*-4.0)*30.0 + sin(u_time*2.0)*200.0 + u_resolution.x/2.0,
	cos(u_time*-4.0)*30.0 + cos(u_time*2.0)*200.0 + u_resolution.x/2.0,
	10.0, 21.0
);
vec4 schere3 = vec4(u_resolution/2.0, 10.0, 70.0);

float get_length_to_schere(vec3 p, vec4 s) {
	return length(p - s.xyz) - s.w;
}


float get_dist(vec3 position) {
	return min(get_length_to_schere(position, schere3), min(get_length_to_schere(position, schere1), get_length_to_schere(position, schere2)));
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
    float dif = clamp(dot(n, l) * 1.1 + 0.5, 0.0, 1.0);
    return dif;
}

vec3 raymarching(vec3 ray_origin, vec2 direction) {
	vec3 position = ray_origin;
	for(float i = 0.0; i < 100.0; i++) {
		float len = get_dist(position);
		if (len < 0.1) return vec3(get_light(position, light));
		if (len > 1000.0) return vec3(0.0);
		position += vec3(
		len * sin(direction.x) * cos(direction.y),
		len * sin(direction.x) * sin(direction.y),
		len * cos(direction.x)
		);
	}
	return vec3(0.0);
}

float scal(float a, float b) {
	return (a * b) / (sqrt(pow(a, 2.0)) * sqrt(pow(b, 2.0)));
}

float scal(vec2 a, vec2 b) {
	return (a.x * b.x + a.y * b.y) / (sqrt(pow(a.x, 2.0) + pow(a.y, 2.0)) * sqrt(pow(b.x, 2.0) + pow(b.y, 2.0)));
}

void main() {
	vec3 c = vec3(gl_FragCoord.xy+u_coord.xy, -10.0+u_coord.z);
	vec2 direction = vec2(
		acos(sqrt(pow(c.x, 2.0) + pow(c.y, 2.0)) / c.z) - 90,
		atan(c.y / c.x)
	);
	// direction += vec2(u_time/60*90-90);
	// vec2 direction = vec2(
	// 	scal(gl_FragCoord.yz, vec2(u_resolution.y/2.0, -10.0)),
	// 	scal(gl_FragCoord.xz, vec2(u_resolution.x/2.0, -10.0))
	// );
	// vec2 direction = vec2(1.0, 1.0);
	gl_FragColor = vec4(raymarching(vec3(gl_FragCoord.xy+u_coord.xy, -10.0+u_coord.z), direction), 1.0);
  //gl_FragColor = vec4(vec3(get_light(gl_FragCoord.xyz, light)), 1.0);
	// gl_FragColor = gl_Color;
}
