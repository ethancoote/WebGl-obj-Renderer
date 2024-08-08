
/* -the functions which return the 3D vertices, normals, indices to
   the WebGL program
   -image array structure and variables
*/


// flag indicating that data has been loaded
let loaded = false;

// global variables for image data, size, and depth
// you may not need all of these variables
let imageData = [];
let imageHeight = 0;
let imageWidth = 0;
let imageDepth = 0;

// global geometry arrays
let vertices = [];
let indices = [];
let normals = [];
let vertexCount = 0;
let textureCoords = [];
let finalTextureCoords = [];
let coords = [];
let vt = [];
let vn = [];
let findNormals = 0;
let texture = [];
let width = 0;
let height = 0;
let ppm = 0;
let temp = [0,0,255,255,
255,0,0,255,
0,255,0,255,
255,255,255,255];

function calcNorms() {
	let Nx = 0.0;
	let Ny = 0.0;
	let Nz = 0.0;

	for (i=0; i<indices.length;i++) {

		// vert 1
		index = (indices[i]) * 3;
		x1 = vertices[index];
		y1 = vertices[index + 1];
		z1 = vertices[index + 2];

		// vert 2
		i+= 1;
		index = (indices[i]) * 3;
		x2 = vertices[index];
		y2 = vertices[index + 1];
		z2 = vertices[index + 2];

		// vert 3
		i+= 1;
		index = (indices[i]) * 3;
		x3 = vertices[index];
		y3 = vertices[index + 1];
		z3 = vertices[index + 2];

		// vectors
		vectA = [(x2-x1), (y2-y1), (z2-z1)];
		vectB = [(x3-x1), (y3-y1), (z3-z1)];

		// cross product
		Nx = (vectA[1]*vectB[2]) - (vectA[2]*vectB[1]);
		Ny = (vectA[2]*vectB[0]) - (vectA[0]*vectB[2]);
		Nz = (vectA[0]*vectB[1]) - (vectA[1]*vectB[0]);

		// turning to unit vector
		len = Math.sqrt(Nx**2 + Ny**2 + Nz**2);
		
		Nx = Nx/len;
		Ny = Ny/len;
		Nz = Nz/len;

		// populate array
		index = indices[i-2] * 3;
		normals[index] = Nx;
		normals[index+1] = Ny;
		normals[index+2] = Nz;
		index = indices[i-1] * 3;
		normals[index] = Nx;
		normals[index+1] = Ny;
		normals[index+2] = Nz;
		index = indices[i] * 3;
		normals[index] = Nx;
		normals[index+1] = Ny;
		normals[index+2] = Nz;
		
	}
}

function setTextureCoord() {
	for (i=0; i<vt.length;i++) {

		// vert 1
		index = (vt[i]) * 2;
		val1 = textureCoords[index];
		val2 = textureCoords[index + 1];
		val2 = 1-val2;

		finalTextureCoords.push(val1);
		finalTextureCoords.push(val2);
	}
}

function changeNorms() {
	tempNorms = [];
	for (i=0; i<vn.length;i++) {
		index = (vn[i])*3;
		val1 = normals[index];
		val2 = normals[index+1];
		val3 = normals[index+2];

		tempNorms.push(val1);
		tempNorms.push(val2);
		tempNorms.push(val3);
	}
	normals = tempNorms;
}

function changeVertexOrder() {
	tempVertices = [];
	for (i=0;i<indices.length;i++) {
		index = (indices[i])*3;
		val1 = vertices[index];
		val2 = vertices[index+1];
		val3 = vertices[index+2];

		tempVertices.push(val1);
		tempVertices.push(val2);
		tempVertices.push(val3);
		indices[i] = i;
	}
	vertices = tempVertices;

}

// create geometry which will be drawn by WebGL
// create vertex, normal, texture, and index information
function initGeometry() {

	if (ppm == 0) {
		vertexCount = indices.length;
		// setting incides to base 0 index
		for (i=0; i<indices.length; i++) {
			indices[i] -=1;
		}
		changeVertexOrder();
		// checking if program needs to calculate normals
		if (findNormals == 1) {
			calcNorms();
		} else {
			changeNorms();
		}
		
		console.log("In initGeometry");
	}
	
	if (ppm == 1){
		initTexture();
	}

}

function changeTextCoords() {
	for (i=0;i<indices.length;i++) {
		index = indices[i] * 2;
		val1 = textureCoords[index];
		val2 = textureCoords[index+1];

		coords.push(val1);
		coords.push(val2);
	}
}

function initTexture() {

	// setting texture indexes to 0 base
	for (i=0; i<vt.length; i++) {
		vt[i] -= 1;
	}

	setTextureCoord();
	textureCoords = finalTextureCoords;

	//changeTextCoords();
	console.log(textureCoords);	
	
}

// return the number of indices in the object
// this should match the number of values in the indices[] array
function getVertexCount() {
	return (vertexCount);
}

// vertex positions (x,y,z values)
function loadvertices() {
	return (vertices);
}

// normals array
function loadnormals() {
	return (normals);
}

// texture coordinates
function loadtextcoords() {
	return (textureCoords);
}

// load vertex indices
function loadvertexindices() {
	return (indices);
}

// texture array size and data
// these should return the size of the image in the .ppm file
function loadwidth() {
	if (texture.length == 0){
		return 2;
	} else {
		return width;
		
	}
}

function loadheight() {
	if (texture.length == 0){
		return 2;
	} else {
		return height;
	}
}

// using a fixed texture map to colour object
// this should be changed to return the data from the .ppm file
function loadtexture() {
	if (texture.length == 0){
		return (new Uint8Array(temp));
	} else {
		return (new Uint8Array(texture));
		
	}

}

