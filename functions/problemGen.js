function problemGen(n_jobs, max_time) {
  let jobs = Array.from(
    { length: n_jobs },
    () => Math.floor(Math.random() * max_time) + 1
  );
  return jobs;
}
