import Big_3D from "./BIG_3D/big3d.js";
import Camera from "./BIG_3D/camera3d.js";
import {vertices, indices} from "../../res/objects/cube.js";
import Mesh from "./BIG_3D/mesh3d.js";
import {cube_vert} from "../../res/shaders/glsl/cube.vert.js";
import {cube_frag} from "../../res/shaders/glsl/cube.frag.js";
import {loadShader} from "./BIG_3D/utils/gl_utils.js";



/// ---------------------------------------------------------- DEBUGING UTILITIES ------------------------------------- 
function throwOnGLError(err, funcName, args) {
    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
};
function logGLCall(functionName, args) {   
    console.log("gl." + functionName + "(" + 
    WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");   
} 
function validateNoneOfTheArgsAreUndefined(functionName, args) {
    for (var ii = 0; ii < args.length; ++ii) {
        if (args[ii] === undefined) {
            console.error("undefined passed to gl." + functionName + "(" + WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
        }
    }
} 
function logAndValidate(functionName, args) {
    logGLCall(functionName, args);
    validateNoneOfTheArgsAreUndefined (functionName, args);
 }



/// ---------------------------------------------------------- Main Program ------------------------------------- 
window.onload = () => {
    /** Get Context */
    const canvas = document.getElementById("background_3d");
    const gl =  canvas.getContext("webgl");     // WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
    // gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, logAndValidate);
    
    /** Create GL pipeline. */
    const cubeVert_s        = loadShader(gl, gl.VERTEX_SHADER, cube_vert);
    const cubeFrag_s        = loadShader(gl, gl.FRAGMENT_SHADER, cube_frag);
    const gl_pipeline       = gl.createProgram(); 
    gl.attachShader(gl_pipeline, cubeVert_s);
    gl.attachShader(gl_pipeline, cubeFrag_s);
    gl.linkProgram(gl_pipeline);
   
    
    /** Create Camera */
    const camera = new Camera(45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100, gl_pipeline, gl);
    
    /** Create Skymap */
    
    /** Create Mesh */
    const mesh = new Mesh(vertices, indices, gl_pipeline, gl);

    /** Create Big_3D */
    const big3d = new Big_3D(null, [mesh], camera, gl, null);

    const render = (now) => {
        big3d.render();
        //requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    /** Add events system or whatever. For this application I will add a simple button to rotate the meshes when it is clicked. */

};



//     /*Loading Shaders*/
//     
//     

//     /*Program Initialization (Pipeline)*/
//     const shaderProgram     = gl.createProgram(); 

//     /* Attaching shaders */
//     log(Severities.INFO_, "Attaching Cube vertex shader.");
//     gl.attachShader(shaderProgram, cubeVert_s);
//     log(Severities.INFO_, "Attaching Cube fragment shader.");
//     gl.attachShader(shaderProgram, cubeFrag_s);

//     /* Check if the program link correctly. */
//     gl.linkProgram(shaderProgram);
//     assert(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS), "Unable to create a shader program " + gl.getProgramInfoLog(shaderProgram)); 
//     log(Severities.INFO_, "Pipeline is initialized");

//     /** Pipeline data...*/
//     const programInfo = {
//         program: shaderProgram,
//         attribLocations: {
//           vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
//           vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
//         },
//         uniformLocations: {
//           projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
//           modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
//         },
//     };

//     /** plane buffer creation. */
//     const vertexBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_vs), gl.STATIC_DRAW);

//     const indexBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube_i), gl.STATIC_DRAW);

//     var colors = [];
//     for (var j = 0; j < cube_c.length; ++j) {
//       const c = cube_c[j];
//       colors = colors.concat(c, c, c, c);   // Repeat each color four times for the four vertices of the face
//     }
//     const colorBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//     /** Drawing the scene */
//     var then = 0;
//     var framesPerSecond = 0;
//     const render = (now) => {
//         now *= 0.001;  // convert to seconds
//         const deltaTime = now - then;
//         if(parseInt(then) != parseInt(now)){
//             if(data_viewer != null){
//                 data_viewer.innerHTML = `FPS: ${framesPerSecond}`;
//             }
//             framesPerSecond = 0;
//         }
//         then = now;

//         gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
//         gl.clearDepth(1.0);                 // Clear everything
//         gl.enable(gl.DEPTH_TEST);           // Enable depth testing
//         gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
//         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//         /** Creaating the camera and the model matrix */
//         const projectionMatrix = mat4.create();
//         mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);   // First argument is the distenation of the result

//         /** Setup the model view matrix */
//         const modelViewMatrix = mat4.create();
//         mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
//         const choice = Math.floor(Math.random()*3);
//         cubeRotation[choice] += deltaTime*10;
//         mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation[0] * .7, [1,0,0] );       // axis to rotate around
//         mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation[1] * .7, [0,1,0] );       // axis to rotate around
//         mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation[2] * .7, [0,0,1] );       // axis to rotate around

//         /** Passing vertex values to attributes */
//         {
//             gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);   // Bind the buffer
//             gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0); // Fill the attribute
//             gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition); 
//         }

//         /** Passing Color values to attributes */
//         {

//             gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//             gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
//             gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
//         }

//         /** Binding the pipeline */
//         gl.useProgram(programInfo.program);

//         /** Passing values to uniform buffers*/
//         gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
//         gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

//         /** Draw command. */
//         { 
//               // Tell WebGL which indices to use to index the vertices
//             gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//             const vertexCount = 36;
//             const type = gl.UNSIGNED_SHORT;
//             const offset = 0;
//             gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
//         }

//         framesPerSecond++;
//         requestAnimationFrame(render);
//     }

//     requestAnimationFrame(render);
// }
