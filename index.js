var runningTimers = {
  js_time: {
    running: false,
    round: 1,
  },
  vanilla_time: {
    running: false,
    round: 1,
  },
  wasm_cpp_insertion_time: {
    running: false,
    round: 2,
  },
  wasm_cpp_quick_time: {
    running: false,
    round: 2,
  },
  // wasm_c_time: {
  //   running: false,
  //   round: 3,
  // },
  // wasm_c_qs_time: {
  //   running: false,
  //   round: 3,
  // },
};

var wasmWorkers = {
  wasm_c_time: "wasm_c_insertion",
  wasm_c_qs_time: "wasm_c_quicksort",
  wasm_cpp_insertion_time: "wasm_cpp_insertion",
  wasm_cpp_quick_time: "wasm_cpp_quick",
};

function solveWithWASMWorker(path_name, array_args, callback) {
  let args = { jobs: array_args[0], n_clusters: array_args[1] };
  const worker = new Worker(`functions/${path_name}/wasmWorker.js`);
  worker.onmessage = (event) => {
    callback(event.data);
  };
  worker.postMessage(args);
}

function problemGen() {
  let n_jobs = document.getElementById("n_jobs").value;
  let max_time = document.getElementById("max_time").value;
  let jobs = Array.from(
    { length: n_jobs },
    () => Math.floor(Math.random() * max_time) + 1
  );
  document.getElementById("jobs_array").value = jobs;
}

const toggleRunningDiv = (idDocument) => {
  document.getElementById(`${idDocument}-div`).classList.toggle("running");
};

const toggleStandByDiv = (idDocument) => {
  document.getElementById(`${idDocument}-div`).classList.toggle("standby");
};

function solve() {
  const resultInput = document.getElementById("result");
  const [jobs, n_clusters] = getArgs();
  const button = document.getElementById("button-solve");
  button.disabled = true;
  button.classList.toggle("off");

  for (const [idDocument, running] of Object.entries(runningTimers)) {
    toggleStandByDiv(idDocument);
    document.getElementById(idDocument).innerHTML = "0.000 s";
  }

  runTimers(["js_time", "vanilla_time"]);

  solveWithWorker(js_solver, [jobs, n_clusters], function (result) {
    resultInput.value = result;
    runningTimers["js_time"].running = false;
    toggleRunningDiv("js_time");
  });

  solveWithWorker(vanilla_solver, [jobs, n_clusters], function (result) {
    runningTimers["vanilla_time"].running = false;
    toggleRunningDiv("vanilla_time");
  });
}

function getArgs() {
  const jobs = document
    .getElementById("jobs_array")
    .value.split(",")
    .map((x) => parseInt(x.trim()));
  const n_clusters = parseInt(
    document.getElementById("n_clusters").value.trim()
  );
  return [jobs, n_clusters];
}

function runTimers(array_ids) {
  const start = performance.now();
  for (const idDocument of array_ids) {
    runningTimers[idDocument].running = true;
    toggleRunningDiv(idDocument);
    toggleStandByDiv(idDocument);
  }
  const interval = setInterval(function () {
    for (const [idDocument, running] of Object.entries(runningTimers)) {
      if (running.running) {
        changeTime(idDocument, start);
      }
    }
    if (
      Object.values(runningTimers).every((val) => val.running === false) &&
      Object.values(runningTimers).length > 0
    ) {
      clearInterval(interval);
      let round = runningTimers[array_ids[0]].round;
      document.dispatchEvent(new Event(`round${round}Finished`));
    }
  }, 1);
}

function runAllTimers() {
  // update every 1 ms all documents where the timer is running
  // then clear the interval when all timers are stopped
  const start = performance.now();
  const interval = setInterval(function () {
    for (const [idDocument, running] of Object.entries(runningTimers)) {
      if (running) {
        changeTime(idDocument, start);
      }
    }
    if (
      Object.values(runningTimers).every((val) => val === false) &&
      Object.values(runningTimers).length > 0
    ) {
      clearInterval(interval);
      const button = document.getElementById("button-solve");
      button.disabled = false;
      button.classList.toggle("off");
    }
  }, 1);
}

function changeTime(idDocument, start) {
  let end = performance.now();
  let time = (end - start) / 1000;
  // round to 3 decimals
  time = Math.round(time * 1000) / 1000;
  time = time.toString().padEnd(5, "0");
  document.getElementById(idDocument).innerHTML = time + " s";
}

function inputSort(type) {
  let jobs = document.getElementById("jobs_array").value;
  jobs = jobs.split(",").map((x) => parseInt(x));
  if (type == "asc") {
    jobs.sort((a, b) => a - b);
  } else if (type == "desc") {
    jobs.sort((a, b) => b - a);
  } else if (type == "rand") {
    jobs.sort(() => Math.random() - 0.5);
  }
  document.getElementById("jobs_array").value = jobs;
}

function switchButton() {
  const switchButton = document.getElementById("switch");
  const nJobsInput = document.getElementById("n_jobs");
  const maxTimeInput = document.getElementById("max_time");
  const genContainer = document.querySelector(".jobs-generator");
  nJobsInput.disabled = !switchButton.checked;
  maxTimeInput.disabled = !switchButton.checked;
  genContainer.classList.toggle("off");
}

document.addEventListener("round1Finished", function () {
  const currentRound = ["wasm_cpp_insertion_time", "wasm_cpp_quick_time"];
  runTimers(currentRound);
  const [jobs, n_clusters] = getArgs();
  for (const idDocument of currentRound) {
    solveWithWASMWorker(
      wasmWorkers[idDocument],
      [jobs, n_clusters],
      function (result) {
        runningTimers[idDocument].running = false;
        toggleRunningDiv(idDocument);
      }
    );
  }
});

// document.addEventListener("round2Finished", function () {
//   const currentRound = ["wasm_c_time", "wasm_c_qs_time"];
//   runTimers(currentRound);
//   const [jobs, n_clusters] = getArgs();

//   for (const idDocument of currentRound) {
//     solveWithWASMWorker(
//       wasmWorkers[idDocument],
//       [jobs, n_clusters],
//       function (result) {
//         runningTimers[idDocument].running = false;
//         toggleRunningDiv(idDocument);
//       }
//     );
//   }
// });

// document.addEventListener("round3Finished", function () {
document.addEventListener("round2Finished", function () {
  console.log("All rounds finished");
  const button = document.getElementById("button-solve");
  if (button.disabled) {
    button.disabled = false;
    button.classList.toggle("off");
  }
});
