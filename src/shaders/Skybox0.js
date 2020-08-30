const {
  UniformsUtils,
  UniformsLib,
  Vector3
} = THREE;

const Skybox0 = {
	uniforms: {},
    vertexShader:`
		// varying vec3 vWorldPosition;

    	void main() {
		  // vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
		  // vWorldPosition = worldPosition.xyz;
		  gl_Position = vec4(1.0,1.0,1.0,1.0); // worldPosition;
    	}
	}
	`,
	fragmentShader: `
		//varying vec3 vWorldPosition;

		void main() {
		  // vec3 x = vWorldPosition;
		  gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
		}
	`
}

export default Skybox0