// 对象求和
const propObj = {
  one: 11,
  two: 2,
  three: 9,
};
const getObjTotal = (obj = propObj) => {
  const keys = Object.keys(obj);
  const num = keys.reduce((pre, next) => {
    const currentTotal = obj[next] - 0;
    const total = pre + currentTotal;
    return total;
  }, 0);
  return num;
};
console.log(getObjTotal());

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

// 打印出z字

const propDeepArray = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 2, 1, 5],
  [9, 1, 2, 8],
];

const print = (array = propDeepArray) => {
  let singleArray = [];
  propDeepArray.forEach((item, index) => {
    if (index) {
      singleArray = [...singleArray, item[item.length - 1]];
    } else {
      singleArray = [...singleArray, ...item];
    }
  });
};

const doPromise = (index = 1, time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`执行成功${index}`);
      resolve(`执行成功${index}`);
    }, time);
  });
};

const maxRequest = (array = [1, 5, 3, 4, 2, 6, 7], maxNum = 3) => {
  return new Promise((resolve) => {
    let index = 0; // 下一次的请求
    let count;
    const result = [];
    async function request() {
      const i = index;
      index++;
      try {
        const res = await doPromise(array[i]);
        result[i] = res;
      } catch (error) {
        result[i] = error;
      } finally {
        count++;
        if (count == array.length) {
          resolve(result);
        }
        if (index < array.length) request();
      }
    }
    for (let i = 0; i < maxNum; i++) {
      request();
    }
  });
};
maxRequest();

class MyPromise {
  static PENDING = "pending"; // 待定
  static FULFILLED = "fulfilled"; // 成功
  static REJECTED = "rejected"; // 失败
  constructor(func) {
    this.state = MyPromise.PENDING;
    this.result = null;
    this.fulFilledCallbacks = [];
    this.rejectedCallbacks = [];
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  resolve(res) {
    if ((this.state = MyPromise.PENDING)) {
      this.state = MyPromise.FULFILLED;
      this.result = res;
      this.fulFilledCallbacks.forEach((callback) => {
        callback(res);
      });
    }
  }
  reject(error) {
    if ((this.state = MyPromise.PENDING)) {
      this.state = MyPromise.REJECTED;
      this.result = error;
      this.fulFilledCallbacks.forEach((callback) => {
        callback(error);
      });
    }
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((_resolve, _reject) => {
      onFulfilled = typeof onFulfilled == "function" ? onFulfilled : () => {};
      onRejected = typeof onRejected == "function" ? onRejected : () => {};
      if (this.state == MyPromise.PENDING) {
        this.fulFilledCallbacks.push(onFulfilled);
        this.rejectedCallbacks.push(onRejected);
      }
      if (this.state == MyPromise.FULFILLED) {
        onFulfilled(this.result);
      }
      if (this.state == MyPromise.REJECTED) {
        onRejected(this.result);
      }
    });
  }
}

const p = new MyPromise((resole) => {
  setTimeout(() => {
    resole("好的");
  }, 5000);
});
p.then((res) => {
  console.log(res);
});

const myObj = {
  name: "object",
  printArrow: () => {
    return console.log("arrow this", this);
  },
  printThis: function () {
    return console.log("this", this);
  },
};
myObj.printArrow(); // 1.vscode中指向{} 2.浏览指向window
myObj.printThis(); // 指向myObj
function createCounter() {
  let count = 0;
  return function () {
    return ++count;
  };
}
const counter = createCounter();
console.log(counter()); // 输出：1
console.log(counter()); // 输出：2
console.log(counter()); // 输出：3
