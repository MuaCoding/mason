export class Pagination {
    /** 当前页码 */
    current = 1;
  
    /** 总页数 */
    page  = 1;
  
    /** 加载更多? */
    get more() {
      return (this.current > 0 && this.page > 1 && this.current <= this.page);
    };
  
    /** 第一页? */
     get first() {
      return (this.current == 1);
    }
  
    /** 加载提示 */
    tips = "正在加载中...";
  
    /** 数据列表 */
    data = [];
  
    /** 加载完成 */
    completed = false;
  
    /** 装载数据 */
    loading(result) {
      let data = result.data;
  
      this.page = data.page;
  
      if (this.first) {
        this.data = data.data;
      }
      else {
        this.data = this.data.concat(data.data);
      }
  
      this.completed = true;
  
      this.current++;
      return this.data;
    }
  
    /** 重置/刷新 */
    reset(clear) {
      this.current = 1;
      this.page = 1;
      if (!!clear) {
        this.data = null;
      }
    }
  }