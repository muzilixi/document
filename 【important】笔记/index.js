// 找到目标值
const propArray = [2, 3, 5, 7, 8, 9];
const findMatch = (array = propArray, target = 9) => {
  const map = new Map();
  let mathIndex = [];
  array.forEach((item) => {
    // 计算出和当前相差target的值
    const mathItem = target - item;
    if (map.has(mathItem)) {
      mathIndex = [map.get(mathItem), item];
    } else {
      map.set(item, item);
    }
  });
  return mathIndex;
};
console.log(findMatch());

class TaskScheduler {
  constructor(concurrentCount = 2, tasks = []) {
    // 并发上限
    this.concurrentCount = concurrentCount;
    // 运行中的任务数
    this.runningTaskCount = 0;
    // 任务列表
    this.tasks = tasks;
  }

  addTask(task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({
        task,
        resolve,
        reject,
      });
      this._run();
    });
  }

  _run() {
    // 当任务列表不为空 且 正在运行的任务不超过并发上限 则继续执行下一个任务
    while (
      this.tasks.length > 0 &&
      this.runningTaskCount < this.concurrentCount
    ) {
      const { task, resolve, reject } = this.tasks.shift();
      this.runningTaskCount++;
      const res = task();
      if (res instanceof Promise) {
        res.then(resolve, reject).finally(() => {
          this.runningTaskCount--;
          this._run();
        });
      } else {
        this.runningTaskCount--;
        this._run();
      }
    }
  }
}

// test
const ts = new TaskScheduler(3, [
  { task: () => console.log(`同步任务1执行完成`) },
  { task: () => console.log(`同步任务2执行完成`) },
]);
const timeout = (delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};
const addTask = (name, delay) => {
  ts.addTask(() => timeout(delay)).then(() =>
    console.log(`异步任务${name}执行完成`)
  );
};
addTask("1", 10000);
addTask("2", 2000);
addTask("3", 2000);
addTask("4", 2000);
addTask("5", 2000);
ts.addTask(() => console.log(`同步任务执行完成`));
