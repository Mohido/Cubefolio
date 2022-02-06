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



export {loadShader};