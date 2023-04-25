#include <stdio.h>
#include <emscripten.h>

void swap(int* a, int* b)
{
    int t = *a;
    *a = *b;
    *b = t;
}
 
int partition(int arr[], int low, int high)
{
    int pivot = arr[high];
    int i = (low - 1);
 
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] > pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}
 
void quickSort(int jobs[], int low, int high)
{
    if (low < high) {
        int pi = partition(jobs, low, high);
        quickSort(jobs, low, pi - 1);
        quickSort(jobs, pi + 1, high);
    }
}
EMSCRIPTEN_KEEPALIVE
int c_solver(int jobs[], int n_jobs, int n_clusters)
{
    // sort jobs in descending order
    quickSort(jobs, 0, n_jobs - 1);
 
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

int main()
{
    int jobs[] = { 30, 50, 10, 20, 90};
    int n_jobs = sizeof(jobs) / sizeof(jobs[0]);
    int n_clusters = 2;
    printf("Min Seconds: %d\n", c_solver(jobs, n_jobs, n_clusters));
    return 0;
}

//Reference for quicksort: https://www.geeksforgeeks.org/quick-sort/