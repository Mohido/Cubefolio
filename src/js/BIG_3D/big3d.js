/* Dependencies */
import {assert, log, Severities} from "./utils/utils.js";
import { loadShader } from "./utils/gl_utils.js";

/* Shaders Loading */
import {cube_vert} from "../../../res/shaders/glsl/cube.vert.js";
import {cube_frag} from "../../../res/shaders/glsl/cube.frag.js";

/** 2D plane vertices. */
// Holds the rotation comulations over x,y,z axies.
var cubeRotation = [0.0, 0.0, 0.0];


const cube_c = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
];


/**
 * A class that holds the interactive background data. It updates and render it when needed.
 */
class Big_3D {

    // Private variables: 
    m_skymap; m_meshes; m_camera;       // Scene objects.
    m_gl; m_dataviewer;                 // Viewer and webgl
    m_projectionMatrixLocation;         


    /**
     * Constructs an interactive background scene from the given references of objects. Since they are references.
     * @param {Skymap} big_skymap : Holds the skymap object and its texture.
     * @param {[Mesh]} big_meshes : Holds an array of meshes that will be found in the scene.
     * @param {Camera} big_camera : Holds the camera object and its data.
     * @param {webgl} gl_context  : Holds the webgl context of the canvas.
     * @param {HTMLElement} dataviewer : Holds the HTML element that you want to view some debuging data on. By default it is null.
     */
    constructor(big_skymap, big_meshes, big_camera, gl_context, dataviewer = null){
        log(Severities.INFO_, "Constructing the 3DBIG object");
        this.m_skymap       = big_skymap;
        this.m_meshes       = big_meshes;
        this.m_camera       = big_camera;
        this.m_dataviewer   = dataviewer;
        this.m_gl           = gl_context;
        assert(this.m_gl == null, "Failed to construct 3DBIG: gl_context is null or undefined.");
        log(Severities.INFO_, "Successfull construction of the 3DBIG object");
    }



    /**
     * Renders the background scene. It is called whenever you want to render the scene. 
     */
    render(){
        this.m_gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        this.m_gl.clearDepth(1.0);                 // Clear everything
        this.m_gl.enable(this.m_gl.DEPTH_TEST);           // Enable depth testing
        this.m_gl.depthFunc(this.m_gl.LEQUAL);            // Near things obscure far things
        this.m_gl.clear(this.m_gl.COLOR_BUFFER_BIT | this.m_gl.DEPTH_BUFFER_BIT);

        for(const mesh of this.m_meshes){
            mesh.bind();        // Binds the program as well (The pipeline of the mesh.)

            /** Passing values to uniform buffers*/
            this.m_gl.uniformMatrix4fv( this.m_camera.projection_M_loc, false, this.m_camera.projection_M);

            /** Mesh render */
            mesh.render();
        }
    }
}



export default Big_3D;