import {log, Severities} from "./utils.js";

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        log(Severities.ERROR_, `An error occurred compiling the shader: ${source}`);
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}



/**
 * Creates a pipeline with the given vertex, fragment shaders.
 * @param {String} vertexShader 
 * @param {String} fragmentShader 
 * @param {WebGLRenderingContextBase} gl_context 
 * @returns {WebGLProgram} gl_pipeline
 */
function createPipeline(vertexShader, fragmentShader, gl_context){
    const gl_pipeline       = gl_context.createProgram(); 
    const cubeVert_s        = loadShader(gl_context, gl_context.VERTEX_SHADER, vertexShader);
    const cubeFrag_s        = loadShader(gl_context, gl_context.FRAGMENT_SHADER, fragmentShader);
    gl_context.attachShader(gl_pipeline, cubeVert_s);
    gl_context.attachShader(gl_pipeline, cubeFrag_s);
    gl_context.linkProgram(gl_pipeline);

    return gl_pipeline;
}



// class Program {
//     pipeline; attributes; uniforms;



//     programInfo = {
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

//     constructor(gl_pipeline, ){

//     }
// }



export {loadShader, createPipeline};