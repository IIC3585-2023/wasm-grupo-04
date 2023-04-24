#include <stdio.h>
#include <emscripten.h>


// insertion sort descending

void insertionSort(int jobs[], int n_jobs)
{
    int i, key, j;
    for (i = 1; i < n_jobs; i++) {
        key = jobs[i];
        j = i - 1;
        while (j >= 0 && jobs[j] < key) {
            jobs[j + 1] = jobs[j];
            j = j - 1;
        }
        jobs[j + 1] = key;
    }
}
EMSCRIPTEN_KEEPALIVE
int c_solver(int jobs[], int n_jobs, int n_clusters)
{
    // sort jobs in descending order
    insertionSort(jobs, n_jobs);
 
    int clusters[n_clusters];
    // initialize all clusters to 0
    for (int c = 0; c < n_clusters; c++) {
        clusters[c] = 0;
    }
 
    // assign each job to the cluster with the least seconds
    for (int j = 0; j < n_jobs; j++) {
        int best_cluster = 0;
        for (int c = 0; c < n_clusters; c++) {
            if (clusters[c] < clusters[best_cluster]) {
                best_cluster = c;
            }
        }
        clusters[best_cluster] += jobs[j];
    }

    int total_seconds = 0;

    // look for the cluster with the most seconds
    for (int c = 0; c < n_clusters; c++) {
        if (clusters[c] > total_seconds) {
            total_seconds = clusters[c];
        }
    }

    return total_seconds;

}



// gcc solver.c -o solver
// ./solver