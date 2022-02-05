/* Dependencies */
import {assert, log, Severities} from "./utils.js";
import { loadShader } from "./gl_utils.js";

/* Shaders Loading */
import {cube_vert} from "../../res/shaders/glsl/cube.vert.js";
import {cube_frag} from "../../res/shaders/glsl/cube.frag.js";

/** 2D plane vertices. */
var planeRotation = 0.0;
const plane_2d_vs = [
    1.0,  1.0,
   -1.0,  1.0,
    1.0, -1.0,
   -1.0, -1.0,
];

const plane_2d_c = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0,    // blue
];

/** Cube data */
const cube_vs = [
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
];

const cube_c = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
];

const cube_i = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
];



/**
 * Main background function
 */
window.onload = (e) => {
    // Get the canvas
    log(Severities.INFO_, "Rendering Background");

    // Loading WebGL context
    let data_viewer = document.getElementById("data_viewer_3d");
    let cvs = document.getElementById("background_3d");
    let gl = cvs.getContext("webgl");
    assert(gl == null, "Unable to load webgl context");

    /* Camera parameters */
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;


    /*Loading Shaders*/
    const cubeVert_s        = loadShader(gl, gl.VERTEX_SHADER, cube_vert);
    const cubeFrag_s        = loadShader(gl, gl.FRAGMENT_SHADER, cube_frag);

    /*Program Initialization (Pipeline)*/
    const shaderProgram     = gl.createProgram(); 

    /* Attaching shaders */
    log(Severities.INFO_, "Attaching Cube vertex shader.");
    gl.attachShader(shaderProgram, cubeVert_s);
    log(Severities.INFO_, "Attaching Cube fragment shader.");
    gl.attachShader(shaderProgram, cubeFrag_s);

    /* Check if the program link correctly. */
    gl.linkProgram(shaderProgram);
    assert(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS), "Unable to create a shader program " + gl.getProgramInfoLog(shaderProgram)); 
    log(Severities.INFO_, "Pipeline is initialized");

    /** Pipeline data...*/
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
          vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    /** plane buffer creation. */
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_vs), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube_i), gl.STATIC_DRAW);

    var colors = [];
    for (var j = 0; j < cube_c.length; ++j) {
      const c = cube_c[j];
      colors = colors.concat(c, c, c, c);   // Repeat each color four times for the four vertices of the face
    }
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    /** Drawing the scene */
    var then = 0;
    var framesPerSecond = 0;
    const render = (now) => {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        planeRotation += deltaTime;
        if(parseInt(then) != parseInt(now)){
            if(data_viewer != null){
                data_viewer.innerHTML = `FPS: ${framesPerSecond}`;
            }
            framesPerSecond = 0;
        }
        then = now;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        /** Creaating the camera and the model matrix */
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);   // First argument is the distenation of the result

        /** Setup the model view matrix */
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, planeRotation* .7, [1, 1, 1]);       // axis to rotate around

        /** Passing vertex values to attributes */
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);   // Bind the buffer
            gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0); // Fill the attribute
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition); 
        }

        /** Passing Color values to attributes */
        {

            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
        }

        /** Binding the pipeline */
        gl.useProgram(programInfo.program);

        /** Passing values to uniform buffers*/
        gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

        /** Draw command. */
        { 
              // Tell WebGL which indices to use to index the vertices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

        framesPerSecond++;
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}