importScripts("cSolver.js");

this.onmessage = (m) => {
  Module.onRuntimeInitialized = () => {
    const solver = Module.cwrap("c_solver", "number", ["array", "number"]);
    const typedArray = new Int32Array(m.data.jobs);

    const result = solver(typedArray, m.data.n_clusters);
    this.postMessage(result);
  };
};
