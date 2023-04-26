#include <stdio.h>
#include <emscripten.h>

// A utility function to swap two elements
void swap(int* a, int* b)
{
	int t = *a;
	*a = *b;
	*b = t;
}

/* This function is same in both iterative and recursive*/
int partition(int arr[], int l, int h)
{
	int x = arr[h];
	int i = (l - 1);

	for (int j = l; j <= h - 1; j++) {
		if (arr[j] >= x) {
			i++;
			swap(&arr[i], &arr[j]);
		}
	}
	swap(&arr[i + 1], &arr[h]);
	return (i + 1);
}

/* A[] --> Array to be sorted,
l --> Starting index,
h --> Ending index */
void quickSort(int arr[], int l, int h)
{
	// Create an auxiliary stack
	int stack[h - l + 1];

	// initialize top of stack
	int top = -1;

	// push initial values of l and h to stack
	stack[++top] = l;
	stack[++top] = h;

	// Keep popping from stack while is not empty
	while (top >= 0) {
		// Pop h and l
		h = stack[top--];
		l = stack[top--];

		// Set pivot element at its correct position
		// in sorted array
		int p = partition(arr, l, h);

		// If there are elements on left side of pivot,
		// then push left side to stack
		if (p - 1 > l) {
			stack[++top] = l;
			stack[++top] = p - 1;
		}

		// If there are elements on right side of pivot,
		// then push right side to stack
		if (p + 1 < h) {
			stack[++top] = p + 1;
			stack[++top] = h;
		}
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