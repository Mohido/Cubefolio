/**
 * Module discription...
 */

class Camera {
    m_fov; m_aspect; m_zNear; m_zFar;
    m_proj_M = mat4.create();       // Projection Matrix
    m_projectionMatrixLocation;
    
    m_gl_pipeline; m_gl_context;

    /**
     * 
     * @param {Float} fov : Field of view
     * @param {float} aspect : Aspect ratio
     * @param {float} zNear  : near clipping plane
     * @param {float} zFar  : far clipping plane
     */
    constructor(fov, aspect, zNear, zFar, gl_pipeline, gl_context){
        this.m_fov = fov;
        this.m_aspect = aspect;
        this.m_zNear = zNear;
        this.m_zFar = zFar;
        this.m_gl_context = gl_context;
        this.m_gl_pipeline = gl_pipeline;


        /* Creating the projection Matrix */
        mat4.perspective(this.m_proj_M, this.m_fov, this.m_aspect, this.m_zNear, this.m_zFar);
        this.m_projectionMatrixLocation = this.m_gl_context.getUniformLocation(this.m_gl_pipeline, 'projection_M');
    }


    // ------------------------------- Camera Movement system.
    /**
     * Rotate the camera over x and y axis
     * @param {[float, float]} polarCord : Polar coordinates of the camera rotation. 
     *      First parameter is the rotation over y-axis (left/right) 
     *      and second parameter is the rotation over the x-axis (up,down)
     *      Parameters are given in degrees ( 360 degrees, 180 degrees)
     */
    rotate(polarCord){}

    /**
     * Translate the camera to this point in space.
     * @param {[float,float,float]} spacePoint 
     */
    translate(spacePoint){}

    /**
     * Moves the camera forward.
     * @param {float} scaler 
     */
    forward(scaler){}

    /**
     * Moves the camera backwards.
     * @param {float} scaler 
     */
    backward(scaler){}

    /**
     * Moves the camera to the left.
     * @param {float} scaler 
     */
    left(scaler){}

    /**
     * Moves the camera to the right.
     * @param {float} scaler 
     */
    right(scaler){}

     /**
     * Moves the camera to the up.
     * @param {float} scaler 
     */
    up(scaler){}

    /**
     * Moves the camera to the down.
     * @param {float} scaler 
     */
    down(scaler){}



    /// -------------------------------------------- Getters area

    get projection_M(){
        return this.m_proj_M;
    }
    
    get projection_M_loc(){
        return this.m_projectionMatrixLocation;
    }
}


export default Camera;