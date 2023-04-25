importScripts("cSolver.js");

this.onmessage = (m) => {
  Module.onRuntimeInitialized = () => {
    const c_solver = Module.cwrap("c_solver", "number", [
      "number",
      "number",
      "number",
    ]);
    let typedArray = new Int32Array(m.data.jobs);
    let pointer = Module._malloc(
      typedArray.length * typedArray.BYTES_PER_ELEMENT
    );
    Module.HEAP32.set(typedArray, pointer / typedArray.BYTES_PER_ELEMENT);

    const result = c_solver(pointer, typedArray.length, m.data.n_clusters);
    Module._free(pointer);
    this.postMessage(result);
  };
};
