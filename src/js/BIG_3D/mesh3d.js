import { log, Severities} from "./utils/utils.js";

class Object_3D {
    m_positions; m_texcords; m_colors; m_normals;

    constructor(positions, colors, normals, texcords){
        this.m_positions = positions;
        this.m_texcords = texcords;
        this.m_normals = normals;
        this.m_colors = colors;
    }
}


/**
 * Holds the Mesh data (Textures, Models, Material, Vertex buffers, )
 */
class Mesh {
    m_object; m_indices;
    m_model_M;
    m_texture;
    m_gl_pipeline; m_gl_context;
    m_vertexBuffer; m_indexBuffer; m_colorBuffer; m_normalBuffer;       // GL buffers that will be used. 
    m_vertexLocation; m_colorLocation; m_normalLocation;                // Attributes locations.
    m_modelMatrixLocation;

    /**
     * 
     * @param {[float]} vertices            : Array of float that determines the mesh vertices position.
     * @param {[Int]} indices               : Array of the indices. Index is used to specify the location of the next vertex to render in the vertiices array.
     * @param {GL Program} gl_pipeline      : gl pipeline, or what so called gl program. This program holds the pipeline that will be used during this object rednering.
     * @param {[float]} colors              : array off colours that correspond to the vertices. It should have the same size as the vertices.
     * @param {[Vectors]} normals           : Array of Normals that corresponds to the vertix.
     * @param {[2D Vectoro]} texcords       : Array of 2d vectors that specify the coordinate of the textures corresponding to a vertex.
     * @param {GL Texture} texture          : A texture loaded earlier by Web GL.
     * @param {4x4 Matrix} model_M          : Matrix that determines the mesh transformation in the world space.
     */
    constructor(vertices, indices, gl_pipeline, gl_context, colors = null, normals = null, texcords = null, texture = null, model_M = mat4.create()){
        this.m_model_M = model_M;
        this.m_object = new Object_3D(vertices, colors, normals, texcords);
        this.m_indices = indices;
        this.m_gl_context = gl_context;
        this.m_gl_pipeline = gl_pipeline;


        /** Buffer creations */
        this.m_vertexBuffer     = gl_context.createBuffer();
        this.m_colorBuffer      = gl_context.createBuffer();
        this.m_normalBuffer     = gl_context.createBuffer();
        this.m_indexBuffer      = gl_context.createBuffer();

        /** Filling the buffers with data */
        gl_context.bindBuffer(gl_context.ARRAY_BUFFER, this.m_vertexBuffer);
        gl_context.bufferData(gl_context.ARRAY_BUFFER, new Float32Array(this.m_object.m_positions), gl_context.STATIC_DRAW);

        gl_context.bindBuffer(gl_context.ELEMENT_ARRAY_BUFFER, this.m_indexBuffer);
        gl_context.bufferData(gl_context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl_context.STATIC_DRAW);

        /** Finding the attributes in the vertex shader in the pipeline */
        this.m_vertexLocation        = gl_context.getAttribLocation(this.m_gl_pipeline, 'position');
        //m_colorLocation         = gl.getAttribLocation(gl_pipeline, 'color');
        //m_normalLocation        = gl.getAttribLocation(gl_pipeline, 'normal'); 
        
        this.m_modelMatrixLocation = gl_context.getUniformLocation(this.m_gl_pipeline, 'model_M');
        mat4.translate(this.m_model_M, this.m_model_M, [-0.0, 0.0, -6.0]);
        
    }


    /**
     * Binds the mesh data. to the program. and use the program.
     */
    bind(){
        /** Binding the pipeline */
        this.m_gl_context.useProgram(this.m_gl_pipeline);

        /** Passing vertex values to attributes */
        {
            this.m_gl_context.bindBuffer(this.m_gl_context.ARRAY_BUFFER, this.m_vertexBuffer);                     // Bind the buffer
            this.m_gl_context.vertexAttribPointer(this.m_vertexLocation, 3, this.m_gl_context.FLOAT, false, 0, 0); // Fill the attribute
            this.m_gl_context.enableVertexAttribArray(this.m_vertexLocation); 
        }

        /** Passing Color values to attributes */
        {
            //this.m_gl_context.bindBuffer(gl.ARRAY_BUFFER, m_colorBuffer);
            //this.m_gl_context.vertexAttribPointer(this.m_colorLocation, 4, gl.FLOAT, false, 0, 0);
            //this.m_gl_context.enableVertexAttribArray(this.m_colorLocation);
        }

        /** Binding the mesh model matrix */
        this.m_gl_context.uniformMatrix4fv(this.m_modelMatrixLocation , false, this.m_model_M);
    }


    /** Renders the mesh to the assigned pipeline. */
    render(){
        this.m_gl_context.bindBuffer(this.m_gl_context.ELEMENT_ARRAY_BUFFER, this.m_indexBuffer);
        this.m_gl_context.drawElements(this.m_gl_context.TRIANGLES, this.m_indices.length, this.m_gl_context.UNSIGNED_SHORT, 0);
    }


    /**
     * A rotation interpolation of the rotation matrix. It interpolates and changes the current mesh matrix with the destination matrix.
     * @param {*} dst_M - Distination matrix
     * @param {*} ratio - Ratio of rotation. It is the ratio between the current object matrix and the next matrix.
     */
    rotateSync(dst_M, ratio){

    }


    /**
     * A rotation interpolation of the rotation matrix. It interpolates and changes the current mesh matrix with the destination matrix.
     * @param {*} dst_M - Distination matrix
     * @param {*} ratio - Ratio of rotation. It is the ratio between the current object matrix and the next matrix.
     */
     rotateAsync(dst_M, ratio, ms){

    }

    // ------------------------------------ SETTERS AREA -----------------------------
    /** Sets the object pipeline */
    set pipeline(newPipeline){}
}


export default Mesh;