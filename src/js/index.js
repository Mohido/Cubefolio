import Big_3D from "./BIG_3D/big3d.js";
import Camera from "./BIG_3D/camera3d.js";
import {vertices, indices} from "../../res/objects/cube.js";
import Mesh from "./BIG_3D/mesh3d.js";
import {cube_vert} from "../../res/shaders/glsl/cube.vert.js";
import {cube_frag} from "../../res/shaders/glsl/cube.frag.js";
import {loadShader, createPipeline} from "./BIG_3D/utils/gl_utils.js";
import { Severities } from "./BIG_3D/utils/utils.js";


/// ---------------------------------------------------------- Main Program ------------------------------------- 
window.onload = async () => {

    var indices2 = indices.map(e => e - 1 );

    /** Get Context */
    const canvas = document.getElementById("background_3d");
    const gl = canvas.getContext("webgl");     
                                               
    /** Create GL pipeline. */
    const testPipeline = createPipeline(cube_vert,cube_frag, gl);
    
    /** Create Camera */
    const camera = new Camera(45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100, testPipeline, gl);
    
    /** Create Skymap */
    /** Create Mesh/s */
    const mesh = new Mesh(vertices, indices2, testPipeline, gl);

    /** Create Big_3D */
    const big3d = new Big_3D(null, [mesh], camera, gl, null);
    big3d.init();


    /** Add events system or whatever. For this application I will add a simple button to rotate the meshes when it is clicked. */
    window.onwheel = (e) => {
        big3d.update((scene)=>{
            const f =  ( e.deltaY * 0.01 * Math.PI / 180) ;
            return {
                camera : new Camera( scene.camera.m_fov + f, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100, testPipeline, gl),
                meshes : scene.meshes
            }
        });
    };



     /** Add events system or whatever. For this application I will add a simple button to rotate the meshes when it is clicked. */
     window.onclick = (e) => {
        big3d.update((scene)=>{
            for (var mesh of scene.meshes){  mat4.rotate(mesh.m_model_M, mesh.m_model_M, -.5,  [-1.0, 1.0, 0.0]); }
            return {camera : scene.camera, meshes : scene.meshes}
        });
    };
};