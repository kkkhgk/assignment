<template>
  <div id="app">
    <div class="container">
      <div class="searchbox">
        <el-form :inline="true"
                 :model="filterParams"
                 class="demo-form-inline">
          <span class="searchkey">
            <el-form-item label="市场">
              <el-select v-model="filterParams.market"
                         placeholder="请选择">
                <el-option value="">---请选择---</el-option>
                <el-option value="银行间市场"></el-option>
                <el-option value="深交所"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="债券子类型">
              <el-select v-model="filterParams.debttype"
                         placeholder="请选择">
                <el-option value="">---请选择---</el-option>
                <el-option value="国债"></el-option>
                <el-option value="可转债"></el-option>
                <el-option value="非公开发行公司债券"></el-option>
                <el-option value="其他"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="买卖方向">
              <el-select v-model="filterParams.trade"
                         placeholder="请选择">
                <el-option value="">---请选择---</el-option>
                <el-option value="买入"></el-option>
                <el-option value="卖出"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收费类型">
              <el-select v-model="filterParams.chargetype"
                         placeholder="请选择">
                <el-option value="">---请选择---</el-option>
                <el-option value="印花税"></el-option>
                <el-option value="风险结算金"></el-option>
                <el-option value="经手费"></el-option>
                <el-option value="清算费"></el-option>
              </el-select>
            </el-form-item>
          </span>
          <div class="buttons">
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-plus"
                         @click="additem">新增</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-edit"
                         @click="edititem">修改</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger"
                         icon="el-icon-delete"
                         @click="deleteitem">删除</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>


      <div class="table">
        <el-table ref="multipleTable"
                  :data="showtableData"
                  :row-key="getRowKeys"
                  tooltip-effect="dark"
                  style="width:100%"
                  height="40.625rem"
                  @selection-change="handleSelectionChange">
          <el-table-column fixed
                          :reserve-selection="true"
                           type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="customerID"
                           label="客户编号"
                           width="100">
          </el-table-column>
          <el-table-column prop="market"
                           label="市场"
                           width="100">
          </el-table-column>
          <el-table-column prop="debtcood"
                           label="债券代码"
                           width="100">
          </el-table-column>
          <el-table-column prop="debttype"
                           label="债券子类型"
                           width="150">
          </el-table-column>
          <el-table-column prop="trade"
                           label="买卖方向"
                           width="100">
          </el-table-column>
          <el-table-column prop="chargetype"
                           label="收费类型"
                           width="100">
          </el-table-column>
          <el-table-column prop="yiju"
                           label="收费依据"
                           width="150">
          </el-table-column>
          <el-table-column prop="rate"
                           label="收费费率"
                           width="150">
          </el-table-column>
          <el-table-column prop="amount"
                           label="收费金额"
                           width="150">
          </el-table-column>
          <el-table-column prop="isjiju"
                           label="是否按级距收费"
                           width="150">
          </el-table-column>
          <el-table-column prop="minjiju"
                           label="收费级距下限"
                           width="150">
          </el-table-column>
          <el-table-column prop="maxjiju"
                           label="收费级距上限"
                           width="150">
          </el-table-column>
          <el-table-column prop="maxamount"
                           label="收费金额上限"
                           width="150">
          </el-table-column>
          <el-table-column prop="minamount"
                           label="收费金额下限"
                           width="150">
          </el-table-column>
          <el-table-column prop="modify"
                           label="修改时间"
                           width="150">
          </el-table-column>
          <el-table-column prop="tips"
                           label="备注"
                           width="150">
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[10, 15, 20]"
                       :page-size="15"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>

      <!-- 模态框 -->
      <el-dialog :title="isAddOrEdit == 'add' ? '新增' : '修改'"
                 :visible.sync="dialogVisible"
                 width="40%"
                 :before-close="handleClose">
        <!-- 内容 -->
        <div class="content">
          <div class="content-item">
            <label class="label-x">市场</label>
            <div>
              <el-select v-model="selectionOptions[0].market"
                         placeholder="请选择">
                <el-option value="">---请选择---</el-option>
                <el-option value="银行间市场"></el-option>
                <el-option value="深交所"></el-option>
              </el-select>
              <!-- <el-input v-model="selectionOptions[0].date" placeholder="请输入内容"></el-input> -->
            </div>
          </div>

          <div class="content-item">
            <label class="label-x">债券代码</label>
            <div>
              <el-input v-model="selectionOptions[0].debtcood"
                        placeholder="请输入"></el-input>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="content-item">
            <label class="label-x">买卖方向</label>
            <div>
              <el-select v-model="selectionOptions[0].trade"
                         placeholder="请选择">
                <el-option value="">---请选择---</el-option>
                <el-option value="买入"></el-option>
                <el-option value="卖出"></el-option>
              </el-select>
            </div>
          </div>

          <div class="content-item">
            <label class="label-x">收费类型</label>
            <div>
              <el-select v-model="selectionOptions[0].chargetype"
                         placeholder="请选择">
                <el-option value="">---请选择---</el-option>
                <el-option value="印花税"></el-option>
                <el-option value="风险结算金"></el-option>
                <el-option value="经手费"></el-option>
                <el-option value="清算费"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="content-item">
            <label class="label-x">收费依据</label>
            <div>
              <el-select v-model="selectionOptions[0].yiju"
                         placeholder="请选择">
                <el-option value="">---请选择---</el-option>
                <el-option value="按成交金额"></el-option>
                <el-option value="按申报笔数"></el-option>
              </el-select>
            </div>
          </div>

          <div class="content-item">
            <label class="label-x">费率(%)</label>
            <div>
              <el-input v-model="selectionOptions[0].rate"
                        placeholder="请输入"></el-input>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="content-item">
            <label class="label-x">费用金额(元)<span style="color: red;font-size:.75rem">(仅输入数字)</span></label>
            <div>
              <el-input v-model="selectionOptions[0].amount"
                        placeholder="请输入"></el-input>
            </div>
          </div>

          <div class="content-item">
            <label class="label-x">债券子类别</label>
            <div>
              <el-select v-model="selectionOptions[0].debttype"
                         placeholder="请选择">
                <el-option value="">---请选择---</el-option>
                <el-option value="国债"></el-option>
                <el-option value="可转债"></el-option>
                <el-option value="非公开发行公司债券"></el-option>
                <el-option value="其他"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="content-item">
            <label class="label-x">备注</label>
            <div>
              <el-input v-model="selectionOptions[0].tips"
                        placeholder="请输入"></el-input>
            </div>
          </div>

          <div class="content-item">
            <label class="label-x">是否按级距收费</label>
            <div>
              <el-select v-model="selectionOptions[0].isjiju"
                         placeholder="请选择">
                <el-option value="">---请选择---</el-option>
                <el-option value="是"></el-option>
                <el-option value="否"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <span slot="footer"
              class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="comfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterParams: {
        market: '',
        debttype: '',
        trade: '',
        chargetype: '',
      },
      tableData: [{
        id: '1',
        customerID: "admin",
        market: "银行间市场",
        debtcood: "-",
        debttype: "国债",
        trade: "买入",
        chargetype: "印花税",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "是",
        minjiju: "1",
        maxjiju: "1,336",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "-"
      },
      {
        id: '2',
        customerID: "admin",
        market: "银行间市场",
        debtcood: "-",
        debttype: "国债",
        trade: "买入",
        chargetype: "风险结算金",
        yiju: "按申报笔数",
        rate: "-",
        amount: "150",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2022-04-13 18:23",
        tips: "-"
      },
      {
        id: '3',
        customerID: "admin",
        market: "银行间市场",
        debtcood: "-",
        debttype: "国债",
        trade: "买入",
        chargetype: "印花税",
        yiju: "按申报笔数",
        rate: "-",
        amount: "150",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2022-04-12 16:14",
        tips: "-"
      },
      {
        id: '4',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "其他",
        trade: "买入",
        chargetype: "经手费",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "免收"
      },
      {
        id: '5',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "其他",
        trade: "买入",
        chargetype: "经手费",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "是",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "免收"
      },
      {
        id: '6',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "可转债",
        trade: "卖出",
        chargetype: "经手费",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "免收"
      },
      {
        id: '7',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "可转债",
        trade: "买入",
        chargetype: "经手费",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "免收"
      },
      {
        id: '8',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "非公开发行公司债券",
        trade: "卖出",
        chargetype: "清算费",
        yiju: "按成交金额",
        rate: "0.0015",
        amount: "-",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "-"
      },
      {
        id: '9',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "非公开发行公司债券",
        trade: "卖出",
        chargetype: "经手费",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "是",
        minjiju: "1,000,001",
        maxjiju: "99,999,999,999",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "免收"
      },
      {
        id: '10',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "非公开发行公司债券",
        trade: "卖出",
        chargetype: "经手费",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "是",
        minjiju: "1",
        maxjiju: "1,000,000",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "免收"
      },
      {
        id: '11',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "非公开发行公司债券",
        trade: "买入",
        chargetype: "清算费",
        yiju: "按成交金额",
        rate: "0.0015",
        amount: "-",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "-"
      },
      {
        id: '12',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "非公开发行公司债券",
        trade: "买入",
        chargetype: "经手费",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "是",
        minjiju: "1,000,001",
        maxjiju: "9,999,999,999,999",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "免收"
      },
      {
        id: '13',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "非公开发行公司债券",
        trade: "买入",
        chargetype: "经手费",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "是",
        minjiju: "1",
        maxjiju: "1,000,000",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "免收"
      },
      {
        id: '14',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "可交换债",
        trade: "卖出",
        chargetype: "经手费",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "免收"
      },
      {
        id: '15',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "可交换债",
        trade: "卖出",
        chargetype: "清算费",
        yiju: "按成交金额",
        rate: "0.0015",
        amount: "-",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "-"
      },
      {
        id: '16',
        customerID: "admin",
        market: "深交所",
        debtcood: "-",
        debttype: "可交换债",
        trade: "买入",
        chargetype: "经手费",
        yiju: "按成交金额",
        rate: "-",
        amount: "-",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2023-01-12 15:22",
        tips: "免收"
      },
      {
        id: '17',
        customerID: "admin",
        market: "银行间市场",
        debtcood: "-",
        debttype: "国债",
        trade: "买入",
        chargetype: "印花税",
        yiju: "按申报笔数",
        rate: "-",
        amount: "150",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2022-04-13 18:23",
        tips: "-"
      },
      {
        id: '18',
        customerID: "admin",
        market: "银行间市场",
        debtcood: "-",
        debttype: "国债",
        trade: "卖出",
        chargetype: "印花税",
        yiju: "按申报笔数",
        rate: "-",
        amount: "150",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2022-01-13 18:33",
        tips: "-"
      },
      {
        id: '19',
        customerID: "admin",
        market: "银行间市场",
        debtcood: "-",
        debttype: "可转债",
        trade: "买入",
        chargetype: "风险结算金",
        yiju: "按申报笔数",
        rate: "-",
        amount: "150",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2022-06-03 18:23",
        tips: "-"
      },
      {
        id: '20',
        customerID: "admin",
        market: "银行间市场",
        debtcood: "-",
        debttype: "其他",
        trade: "买入",
        chargetype: "风险结算金",
        yiju: "按申报笔数",
        rate: "-",
        amount: "1000",
        isjiju: "否",
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: "2022-04-13 13:23",
        tips: "-"
      },
      ],

      showtableData: [],
      tableDataPer: '',
      filterTableDataEnd: [],
      issearch: 'false',
      currentPage: 1, // 当前页码
      // total: '', // 总条数
      pageSize: 15,// 每页的数据条数
      dialogVisible: false,
      selectionOptions: [{
        id: '',
        customerID: "admin",
        market: '',
        debtcood: '-',
        trade: '',
        chargetype: '',
        yiju: '',
        rate: '-',
        amount: '-',
        debttype: '',
        tips: '',
        isjiju: '',
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: ''
      }],
      isAddOrEdit: 'add',
    }
  },
  methods: {


    search() {
      this.showtableData = []
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = []
      this.filterTableDataEnd = this.tableData.filter(item => (item.market == this.filterParams.market || !this.filterParams.market)
        && (item.debttype == this.filterParams.debttype || !this.filterParams.debttype)
        && (item.trade == this.filterParams.trade || !this.filterParams.trade)
        && (item.chargetype == this.filterParams.chargetype || !this.filterParams.chargetype))

      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1
      this.total = this.filterTableDataEnd.length
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd)
      //页面初始化数据需要判断是否检索过
      this.flag = true
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        //tableData不能写成showtableData，不然在没有进行搜索功能的时候，不能进行分页操作，数据丢失
        this.currentChangePage(this.tableData)
      } else {
        this.currentChangePage(this.filterTableDataEnd)
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.showtableData = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.showtableData.push(list[from]);
        }
      }
    },


    additem() {
      this.isAddOrEdit = 'add';
      this.dialogVisible = true;
    },
    edititem() {
      if (!this.selectionOptions[0].id) {
        this.$message({
          type: 'warning',
          message: '请选择要修改的条目!'
        })

        return
      }

      if (this.selectionOptions.length > 1) {
        this.$message({
          type: 'warning',
          message: '请单选要修改的条目!'
        })

        return
      }

      this.isAddOrEdit = 'edit';
      this.dialogVisible = true;
    },
    deleteitem() {

      if (!this.selectionOptions[0].id) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的条目!'
        })

        return
      }

      // if (this.selectionOptions.length > 1) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请单选要删除的条目!'
      //   })

      //   return
      // }
      this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.selectionOptions.length; i++) {
          const delIndex = this.tableData.findIndex(item => item.id == this.selectionOptions[i].id);
          this.tableData.splice(delIndex, 1);
        }
        this.showtableData = this.tableData
        this.total = this.tableData.length

        this.$message({
          type: 'success',
          message: '删除数据成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });



    },
    comfirm() {
      const now = new Date();

      const year = now.getFullYear(); // 获取年份
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 获取月份，并补零
      const day = String(now.getDate()).padStart(2, '0'); // 获取日期，并补零
      const hour = String(now.getHours()).padStart(2, '0'); // 获取小时，并补零
      const minute = String(now.getMinutes()).padStart(2, '0'); // 获取分钟，并补零

      const formattedDateTime = `${year}-${month}-${day} ${hour}:${minute}`;



      if (this.isAddOrEdit == 'add') {

        if (!this.selectionOptions[0].market) {
          this.$message.error('交易市场不能为空');
          return;
        }
        if (!this.selectionOptions[0].trade) {
          this.$message.error('买卖方向不能为空');
          return;
        }
        if (!this.selectionOptions[0].chargetype) {
          this.$message.error('收费依据不能为空');
          return;
        }
        this.selectionOptions[0].id = Math.max(...this.tableData.map(item => item.id)) + 1;

        this.tableData.unshift(this.selectionOptions[0]);

        this.showtableData = this.tableData

        this.dialogVisible = false

        this.$message({
          type: 'success',
          message: '新增成功!'
        })

      }

      if (this.isAddOrEdit == 'edit') {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })

        const editIndex = this.tableData.findIndex(item => item.id == this.selectionOptions[0].id);
        this.tableData[editIndex] = this.selectionOptions[0]
        console.log(this.selectionOptions[0]);
        console.log(this.tableData);
        this.showtableData = this.tableData
        console.log(this.showtableData);

      }

      this.selectionOptions[0].modify = `${formattedDateTime}`; // 更新修改时间
      this.total = this.tableData.length
      this.dialogVisible = false
      this.$refs.multipleTable.clearSelection();//取消选择

      this.selectionOptions = [{
        id: '',
        customerID: "admin",
        market: '',
        debtcood: '-',
        trade: '',
        chargetype: '',
        yiju: '',
        rate: '-',
        amount: '-',
        debttype: '',
        tips: '',
        isjiju: '',
        minjiju: "-",
        maxjiju: "-",
        maxamount: "-",
        minamount: "-",
        modify: ''
      }]
    },
    handleClose() {
      this.dialogVisible = false;
    },
    getRowKeys(row) {
      return row.id;
    },

    handleSelectionChange(selection) {
      if (!selection.length) {
        this.selectionOptions = [{
          id: '',
          customerID: "admin",
          market: '',
          debtcood: '-',
          trade: '',
          chargetype: '',
          yiju: '',
          rate: '-',
          amount: '-',
          debttype: '',
          tips: '',
          isjiju: '',
          minjiju: "-",
          maxjiju: "-",
          maxamount: "-",
          minamount: "-",
          modify: ''
        }]
      } else {
        this.selectionOptions = JSON.parse(JSON.stringify(selection));
      }
    }

  },
  // computed:{
  //   total(){
  //     return this.tableData.length
  //   }
  // },

  beforeCreate() {

    document.querySelector('body').setAttribute('style', 'background-color:#212531;')

  },
  created() {
    this.total = this.tableData.length;
    if (this.total > this.pageSize) {
      for (let index = 0; index < this.pageSize; index++) {
        this.showtableData.push(this.tableData[index]);
      }
    } else {
      this.showtableData = this.tableData;
    }
  },
}
</script>

<style lang="less">
@media screen and (max-width:1450px) {
  // html {
  //    font-size: 16px;
  // }
  // .container .searchkey{

  // }
  .container .searchkey {
    display: flex;
    justify-content: center;
  }

  .container .buttons {
    margin: 0 auto;
    float: none !important;
    ;
    display: flex;
    justify-content: center;
  }
}

@media screen and (min-width:1200px) {
  html {
    font-size: 16px;
  }
}

@media screen and (max-width:1200px) {
  html {
    font-size: 12px;
  }
}

//当屏幕最大宽度为767px 



.container {
  padding: .625rem;
}

.container .buttons {
  float: right;
}

.demo-form-inline .el-form-item__label {
  font-size: .875rem;
  color: #f4f5f0;
}

.demo-form-inline .el-input__inner {
  width: 12vw;
  background-color: #212531;
  color: #f4f5f0;
  font-size: .875rem
}

div.cell {
  text-align: center;
}

.table .el-table thead {
  font-size: .875rem;
  color: #ecf9f2;
}

.table .el-table th.el-table__cell {
  border-right: .3125rem solid #21262c;
  background-color: #28303d;
}

.table .el-table tr,
.table .el-table {
  background-color: #21262c;
}

.table .el-table td.el-table__cell {
  border-color: #414850;
  font-size: .875rem;
  color: #ecf9f2;
}

.table .el-table th.el-table__cell.is-leaf {
  border-bottom: none;
}


.el-table__body .el-table__row.hover-row td {
  background-color: #2cce34 !important;
}

.table .el-table .cell {
  padding: 0;
  height: 1.875rem;
  line-height: 1.875rem;
}


.el-dialog__header {
  background-color: #333b4e;
}

.el-dialog .el-dialog__title,
.el-dialog .el-dialog__body {
  font-size: .875rem;
  color: #ecf9f2;
}

.el-dialog__body,
.el-dialog__footer,
.el-dialog__body .el-input__inner {
  font-size: .875rem;
  background-color: #28303d;
  color: #ecf9f2;
}

.content {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: .5rem;
}

.content-item {
  width: 13.125rem;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.dialog-footer .el-button {
  width: 6.25rem;
  border-radius: 1.25rem;
}

label.label-x {
  min-width: 2rem;
}


.block {
  margin-top: 1.25rem;
  float: right;
}

.block .el-input__inner,
.block .el-pagination__total,
.block .el-pagination__jump {
  background-color: #21262c;
  color: #ecf9f2;
  font-size: .875rem;
}

// .searchbox .el-form{
//   display: flex;
//   flex-wrap: no-wrap;
// }
// .searchbox .el-form--inline .el-form-item{
//   display: flex;
//   flex-wrap: no-wrao;
// }</style>
