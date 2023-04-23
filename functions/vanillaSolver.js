// vanilla sort
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] < current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}

function vanilla_solver(jobs, n_clusters) {
  // sort jobs in descending order
  jobs = insertionSort(jobs);

  // initialize clusters with 0 seconds
  let clusters = Array.from({ length: n_clusters }, () => 0);

  // assign each job to the cluster with the least seconds
  for (let j = 0; j < jobs.length; j++) {
    let best_cluster = 0;
    for (let i = 1; i < clusters.length; i++) {
      if (clusters[i] < clusters[best_cluster]) {
        best_cluster = i;
      }
    }
    clusters[best_cluster] += jobs[j];
  }

  let max_seconds = 0;
  for (let i = 0; i < clusters.length; i++) {
    if (clusters[i] > max_seconds) {
      max_seconds = clusters[i];
    }
  }
  return max_seconds;
}

let van_jobs = [30, 50, 10, 20, 90];
let van_n_clusters = 2;
console.log(`Vanilla: Min Seconds: ${vanilla_solver(van_jobs, van_n_clusters)}`);
