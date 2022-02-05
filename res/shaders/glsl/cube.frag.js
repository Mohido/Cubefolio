/** 
    This is actually a Javscript file that exports the fragment shader as a text 
*/
// out variables


const cube_frag = `
varying lowp vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
}
`;

export {cube_frag as cube_frag};
