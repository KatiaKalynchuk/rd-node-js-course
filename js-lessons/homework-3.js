function createDelayedPromise(delay, message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(message);
    }, delay);
  });
}

const promise1 = createDelayedPromise(1000, 'First promise resolved after 1 second');
const promise2 = createDelayedPromise(2000, 'Second promise resolved after 2 seconds');
const promise3 = createDelayedPromise(3000, 'Third promise resolved after 3 seconds');


Promise.all([promise1, promise2, promise3]).then(results => {
  results.forEach(result => console.log(result));
});
