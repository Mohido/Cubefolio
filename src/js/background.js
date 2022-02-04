/* Dependencies */
import {assert, log, Severities} from "./utils.js";
import { loadShader } from "./gl_utils.js";

/* Shaders Loading */
import {cube_vert} from "../../res/shaders/glsl/cube.vert";
import {cube_frag} from "../../res/shaders/glsl/cube.frag";


/**
 * Main background function
 */
window.onload = (e) => {
    // Get the canvas
    log(Severities.INFO_, "Rendering Background");

    // Loading WebGL context
    let cvs = document.getElementById("background");
    let gl = cvs.getContext("webgl");
    assert(gl == null, "Unable to load webgl context");

    /* */
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    
    log(Severities.INFO_, "Cleared canvas");

    /*Loading Shaders*/
    const cubeVert_s        = loadShader(gl, gl.VERTEX_SHADER, cube_vert);
    const cubeFrag_s        = loadShader(gl, gl.FRAGMENT_SHADER, cube_frag);

    /*Program Initialization (Pipeline)*/
    const shaderProgram     = gl.createProgram(); 

    /* Attaching shaders */
    gl.attachShader(shaderProgram, cubeVert_s);
    gl.attachShader(shaderProgram, cubeFrag_s);

    /* Check if the program link correctly. */
    gl.linkProgram(shaderProgram);
    assert(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS), "Unable to create a shader program " + gl.getProgramInfoLog(shaderProgram)); 





}