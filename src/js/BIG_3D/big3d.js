/* Dependencies */
import {assert, log, Severities} from "./utils/utils.js";
import { loadShader } from "./utils/gl_utils.js";

/* Shaders Loading */
import {cube_vert} from "../../../res/shaders/glsl/cube.vert.js";
import {cube_frag} from "../../../res/shaders/glsl/cube.frag.js";

/** 2D plane vertices. */


/**
 * A class that holds the interactive background data. It updates and render it when needed.
 */
class Big_3D {

    // Private variables: 
    m_skymap; m_meshes; m_camera;       // Scene objects.
    m_gl; m_dataviewer;                 // Viewer and webgl
    m_projectionMatrixLocation;         
    m_running = true;
    m_eventCaller = null;               // 1 time update caller. It is called only once whenever it is set.


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
        /**Update before rendering if there is an updating waiting */
        if(this.m_eventCaller != null){
            const scene = {
                camera: this.m_camera, 
                meshes: this.m_meshes
            };
            const newScene = this.m_eventCaller(scene);
            this.m_camera = newScene.camera;
            this.m_meshes = newScene.meshes;
            
            this.m_eventCaller = null;
        }

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


    /**
     * 
     */
    init(){
        const loop = (now) => {
            if(!this.m_running) {
                log(Severities.INFO_, "Engine Stopped!");
                return;
            }
            this.render();
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }


    /**
     * Call this funciton to raise a BIG_3D Imediate event. It requires a callback event function with the definition below. 
     *      The current Big_3D objects will be passed to that callback function. You can do whatever you like with this update function. 
     * @param {Event Caller} eventCaller - function({camera, meshes}) - A function that will be called during the next frame only. It takes a scene json object.
     *      Takes:      scene = {
     *                          camera, 
     *                          meshes,
     *                  }
     * 
     */
    update(eventCaller = null){
        this.m_eventCaller = eventCaller;
    }
}



export default Big_3D;