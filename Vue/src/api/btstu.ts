import { Request } from "./request1";

const bt = new Request("https://api.btstu.cn");

export default {
  getYan() {
    return bt.get("/yan/api.php", { charset: "utf-8", encode: "json" });
  },
};
