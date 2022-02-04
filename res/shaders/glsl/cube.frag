/** 
    This is actually a Javscript file that exports the fragment shader as a text 
*/
// out variables


const cube_frag = `
    layout(location = 0) out vec4 outColor;

    void main() {
        outColor = vec4(0.0, 0,0, 0.0, 1,0);
    }
`;

export {cube_frag};
