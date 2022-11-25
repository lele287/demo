import { defineStore } from "pinia";

// 对外部暴露一个 main 方法，该方法会导出我们定义的 state
const mainStore = defineStore({
  // 每个 store 的 id 必须唯一
  id: "mian",
  // state 表示数据源
  state: () => ({
    count: 0,
    name: "lele",
  }),
  // 持久化
  persist: {
    storage: sessionStorage,
    paths: ["count"],
  },
  // getters 类似于 computed，可对 state 的值进行二次计算
  getters: {
    // getter 中的 this 指向👉 state
    double(): number {
      return this.count * 2;
    },
    // 如果使用箭头函数会导致 this 指向有问题
    // 可以在函数的第一个参数中拿到 state
    // double: (state) => {
    //     return state.count * 2
    //   }
  },
  // actions 用来修改 state
  actions: {
    increment() {
      // action 中的 this 指向👉 state
      this.count++;
    },
  },
});

export default mainStore;
