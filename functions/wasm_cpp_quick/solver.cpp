#include <iostream>
using namespace std;

int partition(int arr[], int start, int end)
{

    int pivot = arr[start];

    int count = 0;
    for (int i = start + 1; i <= end; i++) {
        if (arr[i] >= pivot)
            count++;
    }

    // Giving pivot element its correct position
    int pivotIndex = start + count;
    swap(arr[pivotIndex], arr[start]);

    // Sorting left and right parts of the pivot element
    int i = start, j = end;

    while (i < pivotIndex && j > pivotIndex) {

        while (arr[i] >= pivot) {
            i++;
        }

        while (arr[j] < pivot) {
            j--;
        }

        if (i < pivotIndex && j > pivotIndex) {
            swap(arr[i++], arr[j--]);
        }
    }

    return pivotIndex;
}

void quickSort(int arr[], int start, int end)
{

    // base case
    if (start >= end)
        return;

    // partitioning the array
    int p = partition(arr, start, end);

    // Sorting the right part
    quickSort(arr, start, p - 1);

    // Sorting the left part
    quickSort(arr, p + 1, end);
}


extern "C" int cpp_solver(int jobs[], int n_jobs, int n_clusters)
{
    // sort jobs in descending order
    quickSort(jobs, 0, n_jobs-1);
    
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

