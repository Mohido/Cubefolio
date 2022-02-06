

const cube_vert = `
attribute vec4 position;
//attribute vec4 aVertexColor;

uniform mat4 model_M;
uniform mat4 projection_M;

varying lowp vec4 vColor;

void main(void) {
    gl_Position = projection_M * model_M * position;
    vColor = position;
}
`;

export {cube_vert};