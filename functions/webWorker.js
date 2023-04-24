function solveWithWorker(func, params, callback) {
  // Create a new web worker
  const funcString = func.toString();

  // Create a new web worker
  const worker = new Worker(
    URL.createObjectURL(
      new Blob(
        [
          `onmessage = function (event) {
      // Parse the function and its parameters from the message
      const { funcString, params } = event.data;
      const func = eval('(' + funcString + ')');
      
      // Call the function with its parameters
      const result = func(...params);

      // Send the result back to the main thread
      postMessage(result);
    }`,
        ],
        { type: "text/javascript" }
      )
    )
  );

  // Send the function and its parameters to the worker
  worker.postMessage({ funcString, params });

  // Listen for messages from the worker
  worker.onmessage = function (event) {
    // Get the result from the worker
    const result = event.data;

    // Call the callback function with the result
    callback(result);

    // Terminate the worker
    worker.terminate();
  };

  // Handle errors from the worker
  worker.onerror = function (error) {
    console.error(error);
  };
}
