function bestFit(jobs, n_clusters) {
  // sort jobs in descending order
  jobs.sort((a, b) => b - a);

  // initialize clusters with 0 seconds
  let clusters = Array.from({ length: n_clusters }, () => 0);

  // assign each job to the cluster with the least seconds
  for (let j = 0; j < jobs.length; j++) {
    let best_cluster = 0;
    for (let c = 0; c < n_clusters; c++) {
      if (clusters[c] < clusters[best_cluster]) {
        best_cluster = c;
      }
    }
    clusters[best_cluster] += jobs[j];
  }

  return Math.max(...clusters);
}

let jobs = [30, 50, 10, 20, 90];
let n_clusters = 2;
console.log(`Min Seconds: ${bestFit(jobs, n_clusters)}`);
