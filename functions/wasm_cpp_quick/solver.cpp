#include <iostream>
#include <stack>
#include <vector>
#include <algorithm>
using namespace std;
 
int partition(int a[], int start, int end)
{
    // Elija el elemento más a la derecha como un pivote de la array
    int pivot = a[end];
 
    // los elementos menores que el pivote van a la izquierda de `pIndex`
    // los elementos más que el pivote van a la derecha de `pIndex`
    // elementos iguales pueden ir en cualquier dirección
    int pIndex = start;
 
    // cada vez que encontramos un elemento menor o igual que el pivote, `pIndex`
    // se incrementa, y ese elemento se colocaría antes del pivote.
    for (int i = start; i < end; i++)
    {
        if (a[i] >= pivot)
        {
            swap(a[i], a[pIndex]);
            pIndex++;
        }
    }
 
    // intercambiar `pIndex` con pivote
    swap (a[pIndex], a[end]);
 
    // devuelve `pIndex` (índice del elemento pivote)
    return pIndex;
}
 
// Rutina iterativa Quicksort
void quickSort(int a[], int n)
{
    // crea una stack de `std::pairs` para almacenar el índice inicial y final del subarray
    stack<pair<int, int>> s;
 
    // obtener el índice inicial y final de la array dada
    int start = 0;
    int end = n - 1;
 
    // inserta el índice inicial y final de la array en la stack
    s.push(make_pair(start, end));
 
    // bucle hasta que la stack esté vacía
    while (!s.empty())
    {
        // elimina el par superior de la lista y comienza el subarray
        // y los índices finales
        start = s.top().first, end = s.top().second;
        s.pop();
 
        // reorganizar los elementos a través del pivote
        int pivot = partition(a, start, end);
 
        // inserta índices de subarray que contienen elementos que son
        // menos que el pivote actual para stack
        if (pivot - 1 > start) {
            s.push(make_pair(start, pivot - 1));
        }
 
        // inserta índices de subarray que contienen elementos que son
        // más que el pivote actual para stack
        if (pivot + 1 < end) {
            s.push(make_pair(pivot + 1, end));
        }
    }
}


extern "C" int cpp_solver(int jobs[], int n_jobs, int n_clusters)
{
    // sort jobs in descending order
    quickSort(jobs, n_jobs);

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
