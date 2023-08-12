import {
  Dialog,
  IMenuItemOption,
  Lute,
  Plugin,
  Setting,
  getFrontend,
} from "siyuan";
const STORAGE_NAME = "siyuanPlugin-list2table";

export default class PluginList2table extends Plugin {
  private isMobile: boolean;
  private blockIconEventBindThis = this.onBlockIconEvent.bind(this);
  private lute: Lute;
  //private luteClass: any;
  onload() {
    const frontEnd = getFrontend();
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";
    //*setting
    this.data[STORAGE_NAME] = { splitFlag: "：", maxIndex: 0 };
    const splitFlagElement = document.createElement("input");
    const maxIndexElement = document.createElement("input");
    this.setting = new Setting({
      confirmCallback: () => {
        this.saveData(STORAGE_NAME, {
          splitFlag: splitFlagElement.value,
          maxIndex: maxIndexElement.valueAsNumber,
        });
      },
    });
    this.setting.addItem({
      title: this.i18n.splitFlag,
      createActionElement: () => {
        //splitFlagElement.className = "b3-text-field fn__block";
        splitFlagElement.value = this.data[STORAGE_NAME].splitFlag;
        return splitFlagElement;
      },
    });
    this.setting.addItem({
      title: this.i18n.maxIndex,
      createActionElement: () => {
        //maxIndexElement.className = "b3-text-field fn__block";
        maxIndexElement.type = "number";
        maxIndexElement.value = this.data[STORAGE_NAME].maxIndex;
        return maxIndexElement;
      },
    });
  }
  async onLayoutReady() {
    this.lute = window.Lute.New() as Lute;
    //this.luteClass = window.Lute;
    this.loadData(STORAGE_NAME);
    this.eventBus.on("click-blockicon", this.blockIconEventBindThis);

    //*测试用
    /*
    let tableMarkwon = (await getBlockKramdown("20230418104245-l0cygfa"))
      .kramdown;
    console.log(tableMarkwon);
    showKarkdownInDialog(tableMarkwon, {
      title: "表格预览",
      transparent: false,
      width: this.isMobile ? "92vw" : "560px",
      height: "540px",
    });*/
  }
  onunload() {
    this.eventBus.off("click-blockicon", this.blockIconEventBindThis);
  }
  /*
  private markdown2jsonList(kramdown: string): conceptTree[] {
    const splitFlag = this.data[STORAGE_NAME].splitFlag;
    const maxIndex = this.data[STORAGE_NAME].maxIndex;
    function buildJson(text: string): conceptTree {
      let depth = text.indexOf("*") / 2 + 1;
      text = text.replace("* ", "");
      text = text.trim();
      text = kramdown2markdown(text);
      const index = text.indexOf(splitFlag);
      if (index < 0 || (maxIndex > 0 && index + 1 > maxIndex)) {
        return { name: text, children: [], depth: depth };
      }
      const name = text.substring(0, index);
      const value = text.substring(index + 1);
      return { name: name, value: value, children: [], depth: depth };
    }
    let textList = kramdown.split("\n");
    //去除空行
    textList = textList.filter((item) => {
      return item.replace(/ /g, "") != "";
    });
    let jsonList: conceptTree[] = [];
    for (let item of textList) {
      jsonList.push(buildJson(item));
    }
    return jsonList;
  }


  private listJson2json(jsonList: conceptTree[]): conceptTree {
    let json: conceptTree = {
      name: "root",
      //type: undefined,
      children: [],
      depth: 0,
    };
    let parent = json;
    let lastObj = json;
    for (let obj of jsonList) {
      //*子级
      if (obj.depth > lastObj.depth) {
        parent = lastObj;
        parent.children.push(obj);
      }
      //*兄弟
      else if (obj.depth === lastObj.depth) {
        parent.children.push(obj);
      }
      //*另外一个分支（上级）
      else if (obj.depth < lastObj.depth) {
        let count = 0;
        parent = parent.parent;
        while (parent.depth != obj.depth - 1 && count < 100) {
          count++;
          parent = parent.parent;
        }
        parent.children.push(obj);
      }
      obj.parent = parent;
      lastObj = obj;
    }
    return json;
  }*/

  /**
   * 列表-列表项-段落等              -列表项
   *   |--列表项-列表 -列表项    =>    |-列表项-列表项
   *        |---段落等
   */
  private dom2json(dom: HTMLElement, parent: conceptTree): void {
    let count = 0;
    for (let item2 of dom.children) {
      let item = item2 as HTMLElement;
      if (!item.hasAttribute("data-node-id")) {
        continue;
      }
      count++;
      switch (item.getAttribute("data-type")) {
        //兄弟节点
        case "NodeListItem":
          let self: conceptTree = {
            name: "",
            value: [],
            children: [],
            parent: parent,
            path: structuredClone(parent.path),
          };
          parent.children.push(self);
          this.dom2json(item, self);
          break;
        //进入下级节点
        case "NodeList":
          this.dom2json(item, parent);
          break;
        //修改父节点
        default:
          let name: string; //HTMLElement;
          //提取属性名
          if (
            count === 1 &&
            item.getAttribute("data-type") === "NodeParagraph"
          ) {
            let text = item.textContent;
            const splitFlag = this.data[STORAGE_NAME].splitFlag;
            const maxIndex = this.data[STORAGE_NAME].maxIndex;
            const index = text.indexOf(splitFlag);
            if (index < 0 || (maxIndex > 0 && index + 1 > maxIndex)) {
              name = text;
              //item.remove();
            } else {
              name = text.substring(0, index);
              //*删除name
              let re = new RegExp(`${name}${splitFlag}`.split("").join(".*?"));
              //console.log(re);
              item.innerHTML = item.innerHTML.replace(re, "");
              //console.log(item.textContent);
            }
            parent.name = name;
            parent.path.push(parent.name);
          }
          parent.value.push(item);
        //console.log(parent.name, "value增加", item.textContent);
      }
    }
  }

  private json2tableParts(json: conceptTree) {
    //*判断是否为属性并直接处理
    function determineProp(
      json: conceptTree,
      propNameList: string[],
      propNameListUnique?: string[]
    ) {
      for (let child of json.children) {
        let isProp = false;
        if (propNameListUnique) {
          //*二次循环用
          if (
            propNameListUnique.find((item) => {
              return child.name === item;
            })
          ) {
            isProp = true;
          }
        } else if (
          (!child.children || child.children.length === 0) &&
          child.value.length > 0
        ) {
          //原为 !child.children || child.children.length === 0
          isProp = true;
        }
        if (isProp) {
          //*兄弟节点为属性(发现属性，终止循环，对json再次进行循环)
          for (let brother of json.children) {
            brother.isProp = true;
            propNameList.push(brother.name);
            propNameList = defineProp(brother, propNameList);
          }
          break;
        } else if (propNameListUnique) {
          propNameList = determineProp(child, propNameList, propNameListUnique);
        } else {
          propNameList = determineProp(child, propNameList);
        }
      }
      return propNameList;
    }
    /**
     * 子级直接定义为属性
     * @param propNameList 若有将把属性名加入数组propNameList
     */
    function defineProp(json: conceptTree, propNameList?: string[]) {
      for (let child of json.children) {
        child.isProp = true;
        if (propNameList) {
          propNameList.push(child.name);
        }
        propNameList = defineProp(child, propNameList);
      }
      return propNameList;
    }
    //*第一步-判断上方表头和左侧表头的分隔位置
    let propNameList: string[] = determineProp(json, []);
    const propNameListUnique = [...new Set(propNameList)]; //去重
    const newpropNameList = determineProp(json, [], propNameListUnique);
    //console.log([...new Set(newpropNameList)]);//二次生成属性全列表
    //*第一步修正-合并非属性节点的`属性名`和`属性值`，以防止丢失信息，可选
    const splitFlag = this.data[STORAGE_NAME].splitFlag;
    function concatNameValue(json: conceptTree) {
      for (let child of json.children) {
        if (!child.isProp) {
          child.name = child.value
            ? `${child.name}${splitFlag}${child.value}`
            : child.name;
        }
        concatNameValue(child);
      }
    }
    //concatNameValue(json);
    //*第二步-构建表的主体部分列表（单元格）,同时为树的节点添加path属性
    function buildcells(
      json: conceptTree,
      cells: cell[],
      concept: string[],
      prop: string[]
    ) {
      for (let child of json.children) {
        //*不得改变原有列表
        let conceptForSelf = structuredClone(concept);
        let propForSelf = structuredClone(prop);
        if (!child.isProp) {
          conceptForSelf.push(child.name);
          child.path = conceptForSelf;
        } else {
          propForSelf.push(child.name);
          child.path = propForSelf;
        }
        if (child.children.length === 0) {
          let cell: cell = {
            concept: conceptForSelf,
            prop: propForSelf,
            value: child.value,
          };
          cells.push(cell);
          continue;
        }
        cells = buildcells(child, cells, conceptForSelf, propForSelf);
      }
      return cells;
    }
    let cells = buildcells(json, [], [], []);
    //*第三步-构建左侧表头
    function collectProps(json: conceptTree, props: conceptTree[]) {
      for (let child of json.children) {
        if (child.isProp) {
          props.push(json);
          break;
        } else {
          props = collectProps(child, props);
        }
      }
      return props;
    }
    let props = collectProps(json, []);
    //*合并属性分支
    function mergePropArray(props: conceptTree[]) {
      function findSameLevel(json: conceptTree, mergeResult: conceptTree) {
        for (let child of mergeResult.children) {
          if (json.path.toString() === child.path.toString()) {
            return child;
          } else {
            return findSameLevel(json, child);
          }
        }
      }
      function mergeProps(json: conceptTree, resInSameLevel: conceptTree) {
        for (let child of json.children) {
          let childInSameLevel = resInSameLevel.children.find((item) => {
            return item.path.toString() === child.path.toString();
          });
          if (!childInSameLevel) {
            resInSameLevel.children.push(child);
          } else {
            mergeProps(child, childInSameLevel);
          }
        }
      }
      let propJson: conceptTree = {
        name: "root",
        children: [],
        value: [],
        parent: undefined,
        path: ["root"],
      };
      for (let prop of props) {
        let propInSameLevel = findSameLevel(prop, propJson) || propJson;
        mergeProps(prop, propInSameLevel);
      }
      return propJson;
    }
    let propJson = mergePropArray(props);
    //*计算`rowspan`和`colspan`
    function sumChildAttr(json: conceptTree, attr: `colspan` | `rowspan`) {
      for (let child of json.children) {
        if (child.children.length === 0) {
          child[attr] = 1;
        } else {
          sumChildAttr(child, attr);
        }
      }
      //*后序遍历，根据child计算结果计算本级结果
      let colspan = 0;
      for (let child of json.children) {
        colspan += child[attr];
      }
      json[attr] = colspan;
    }
    function computeMaxDepth(
      json: conceptTree,
      maxDepth: number,
      depth: number
    ) {
      if (maxDepth < depth) {
        maxDepth = depth;
      }
      for (let child of json.children) {
        maxDepth = computeMaxDepth(child, maxDepth, depth + 1);
      }
      return maxDepth;
    }
    sumChildAttr(propJson, "rowspan");
    const maxDepthOfProp = computeMaxDepth(propJson, 0, 0);
    function leavesDepth(
      json: conceptTree,
      attr: `colspan` | `rowspan`,
      depth: number,
      maxDepth: number
    ) {
      for (let child of json.children) {
        if (child.children.length === 0) {
          child[attr] = maxDepth - depth;
          //console.log(child.name, child[attr]);
        } else {
          child[attr] = 1;
        }
        leavesDepth(child, attr, depth + 1, maxDepth);
      }
    }
    leavesDepth(propJson, "colspan", 0, maxDepthOfProp);
    //*第三步-构建上方表头
    function buildConceptJson(json: conceptTree, conceptJson: conceptTree) {
      clone(json, conceptJson);
      return conceptJson;
      function clone(jsonChild: conceptTree, conceptJsonChild: conceptTree) {
        //conceptJsonChild.parent = undefined;
        for (const child of jsonChild.children) {
          if (child.isProp) {
            conceptJsonChild.children = [];
            break;
          } else {
            //?conceptJsonChild.children.push(child);//这种写法会改变child，导致无限循环
            conceptJsonChild.children.push({
              name: child.name,
              children: [],
              path: child.path,
              parent: child.parent,
              value: [],
            });
            clone(
              child,
              conceptJsonChild.children[conceptJsonChild.children.length - 1]
            );
          }
        }
      }
    }
    const conceptJson = buildConceptJson(json, {
      name: "root",
      children: [],
      //depth: 0,
      parent: undefined,
      path: [],
      value: [],
    });
    sumChildAttr(conceptJson, "colspan");
    const maxDepthOfConcept = computeMaxDepth(conceptJson, 0, 0);
    leavesDepth(conceptJson, "rowspan", 0, maxDepthOfConcept);
    //*确定单元格行合并
    function setCellRowspan(cells: cell[], propJson: conceptTree) {
      for (let child of propJson.children) {
        let cellList = cells.filter((item) => {
          return item.prop.toString() === child.path.toString();
        });
        cellList.forEach((item) => {
          item.rowspan = child.rowspan;
        });
        setCellRowspan(cells, child);
      }
    }
    setCellRowspan(cells, propJson);
    //console.log("json", json);
    return {
      cells: cells,
      left: propJson,
      head: conceptJson,
      maxLeftDepth: maxDepthOfProp,
      maxHeadDepth: maxDepthOfConcept,
    };
  }
  private tableParts2matrix(tableParts: {
    cells: cell[];
    head: conceptTree;
    left: conceptTree;
    maxHeadDepth: number;
    maxLeftDepth: number;
  }) {
    //const lute = this.lute;
    function buildSpan(json: conceptTree | cell) {
      //@ts-ignore
      const colspan = json.colspan || 1;
      const rowspan = json.rowspan || 1;
      if (colspan > 1 || rowspan > 1) {
        return `colspan="${colspan}" rowspan="${rowspan}"`;
      }
      return ``;
    }

    function mergeCell(
      child: conceptTree | cell,
      rowNum: number,
      colNum: number,
      arr: cell[][]
    ) {
      //*合并单元格
      if (child.colspan > 1 || child.rowspan > 1) {
        //arr[rowNum][colNum].attr = buildSpan(child);
        arr[rowNum][colNum].colspan = child.colspan;
        arr[rowNum][colNum].rowspan = child.rowspan;
        for (let i = 0; i < child.rowspan; i++) {
          for (let j = 0; j < child.colspan; j++) {
            if (!i && !j) {
              continue;
            }
            arr[rowNum + i][colNum + j] = emptyCell();
          }
        }
      }
    }
    //*做占位符,空单元格
    function emptyCell(): cell {
      return {
        value: [],
        concept: [],
        prop: [],
        class: `fn__none`,
      };
    }
    //*尚未填充的单元格
    function unfillCell(): cell {
      return {
        value: [],
        concept: [],
        prop: [],
        class: "",
      };
    }
    const head = tableParts.head;
    const left = tableParts.left;
    const cells = tableParts.cells;
    //*构建矩阵
    const maxj = head.colspan + tableParts.maxLeftDepth;
    const maxi = left.rowspan + tableParts.maxHeadDepth;
    function buildArr(
      maxi: number,
      maxj: number,
      cellToFill: () => any
    ): cell[][] {
      let arr = [];
      for (let i = 0; i < maxi; i++) {
        let arr2: cell[] = [];
        for (let j = 0; j < maxj; j++) {
          const cell = cellToFill();
          arr2.push(cell);
        }
        arr.push(arr2);
      }
      return arr;
    }
    let arr = buildArr(maxi, maxj, unfillCell);
    //*左上空白区域
    let leftHead: cell = {
      concept: [],
      prop: [],
      value: [nodeParagraph("")],
      colspan: tableParts.maxLeftDepth,
      rowspan: tableParts.maxHeadDepth,
    };
    arr[0][0] = leftHead;
    mergeCell(leftHead, 0, 0, arr);
    function isUnfillCell(cell: cell) {
      if (cell.class) {
        return false;
      }
      if (cell.value.length > 0) {
        return false;
      }
      if (cell.colspan > 1 || cell.rowspan > 1) {
        return false;
      }
      return true;
    }
    function nodeParagraph(md: string) {
      /*
      let div = document.createElement("div");
      let div2 = document.createElement("div");
      div.appendChild(div2);
      div2.outerHTML = lute.Md2BlockDOM(md);*/
      let div2 = document.createElement("p");
      div2.textContent = md;
      div2.style.display = "inline";
      //let div2 = document.createTextNode(md);
      return div2;
    }
    //*上方表头
    function fillHead(json: conceptTree, rowNum: number, arr: cell[][]) {
      for (const child of json.children) {
        for (let colNum = 0; colNum < arr[rowNum].length; colNum++) {
          if (isUnfillCell(arr[rowNum][colNum])) {
            arr[rowNum][colNum] = {
              value: [nodeParagraph(child.name)],
              //attr: "",
              prop: child.isProp ? child.path : [],
              concept: !child.isProp ? child.path : [],
            };
            //*合并单元格
            mergeCell(child, rowNum, colNum, arr);
            break;
          }
        }
        fillHead(child, rowNum + 1, arr);
      }
    }
    //let headArr=buildArr()
    fillHead(head, 0, arr);
    //console.log("上方表头", structuredClone(arr));
    //*左侧表头
    //const leftArr = buildArr(tableParts.maxLeftDepth, left.rowspan, unfillCell);
    //fillHead(left, 0, leftArr);
    //const leftArrTrans = transpose(leftArr);
    //fillLeft(arr, leftArrTrans, tableParts.maxHeadDepth);
    fillLeft(left, 0, arr);
    function fillLeft(json: conceptTree, colNum: number, arr: cell[][]) {
      for (const child of json.children) {
        for (let rowNum = 0; rowNum < arr.length; rowNum++) {
          if (isUnfillCell(arr[rowNum][colNum])) {
            arr[rowNum][colNum] = {
              value: [nodeParagraph(child.name)],
              //attr: "",
              prop: child.isProp ? child.path : [],
              concept: !child.isProp ? child.path : [],
            };
            //*合并单元格
            mergeCell(child, rowNum, colNum, arr);
            break;
          }
        }
        fillLeft(child, colNum + 1, arr);
      }
    }
    /*
    function fillLeft(arr: any[][], arrFrom: any[][], startRow: number) {
      for (let i = 0; i < arrFrom.length; i++) {
        for (let j = 0; j < arrFrom[i].length; j++) {
          arr[i + startRow][j] = arrFrom[i][j];
        }
      }
    }*/
    //console.log("左侧", arr);
    //*主体单元格
    function fillCells(
      cells: cell[],
      arr: cell[][],
      headRowNum: number,
      leftColNum: number
    ) {
      for (let cell of cells) {
        //*查找概念（上方表头）
        let colNum = 0;
        for (let i = headRowNum - 1; i >= 0; i--) {
          for (let j = leftColNum - 1; j < arr[i].length; j++) {
            if (arr[i][j].concept.toString() === cell.concept.toString()) {
              colNum = j;
              break;
            }
          }
          if (colNum) {
            break;
          }
        }
        //*查找属性（左侧表头）
        let rowNum = 0;
        for (let j = leftColNum - 1; j >= 0; j--) {
          for (let i = headRowNum - 1; i < arr.length; i++) {
            if (arr[i][j].prop.toString() === cell.prop.toString()) {
              rowNum = i;
              break;
            }
          }
          if (rowNum) {
            break;
          }
        }
        arr[rowNum][colNum].value = cell.value;
        mergeCell(cell, rowNum, colNum, arr);
      }
    }
    fillCells(cells, arr, tableParts.maxHeadDepth, tableParts.maxLeftDepth);
    return {
      //?markdown: markdown,
      headRowNum: tableParts.maxHeadDepth,
      leftColNum: tableParts.maxLeftDepth,
      tableArr: arr,
    };
  }
  private list2table(obj: { kramdown: string; dom: HTMLElement }) {
    this.blockDom2htmlClear(obj.dom.innerHTML);
    //?const jsonList = this.markdown2jsonList(obj.kramdown);保留
    let json: conceptTree = {
      name: "root",
      children: [],
      parent: undefined,
      path: ["root"],
      value: [document.createElement("div")],
    };
    this.dom2json(obj.dom, json);
    console.log("json", json);
    //const json = this.listJson2json(jsonList);保留
    const tableParts = this.json2tableParts(json);
    console.log("tableParts", tableParts);
    const { headRowNum, tableArr, leftColNum } =
      this.tableParts2matrix(tableParts);
    console.log("tableArr", tableArr);
    const ele = this.matrix2table(headRowNum, leftColNum, tableArr);
    //console.log("ele", ele);
    this.blockDom2htmlClear(ele.innerHTML);
  }
  private matrix2table(
    //?markdown: string,
    headRowNumber: number,
    leftColNumber: number,
    tableArr: cell[][]
  ) {
    //*转html
    function buildMarkdown(arr: cell[][]) {
      let markdown: string = "";
      for (let i = 0; i < arr.length; i++) {
        markdown += "|";
        for (let j = 0; j < arr[i].length; j++) {
          //markdown += arr[i][j].value; //|| "emptyCell";
          markdown += "|";
        }
        //*加表头
        if (i === 0) {
          //i === tableParts.maxHeadDepth - 1
          markdown += "\n";
          markdown += "|";
          for (let j = 0; j < arr[i].length; j++) {
            markdown += ` --- `;
            markdown += "|";
          }
        }
        markdown += "\n";
      }
      return markdown;
    }
    let markdown = buildMarkdown(tableArr);
    const eleHtml = this.lute.Md2BlockDOM(markdown);
    let ele = document.createElement("div");
    ele.innerHTML = eleHtml;
    let table = ele.querySelector("table");
    /*写入属性和内容(html文档写法)
    let tabelHtml = `<thead>`;
    for (let i = 0; i < tableArr.length; i++) {
      tabelHtml += `<tr>`;
      for (let j = 0; j < tableArr[i].length; j++) {
        const tagName = j < leftColNumber || i < headRowNumber ? "th" : "td";
        tabelHtml += `<${tagName} colSpan=${
          tableArr[i][j].colspan || 1
        } rowspan=${tableArr[i][j].rowspan || 1} class=${
          tableArr[i][j].class || ""
        }>`;
        for (let value of tableArr[i][j].value) {
          //td.appendChild(value);
          tabelHtml += value.outerHTML;
        }
        tabelHtml += `</${tagName}>`;
      }
      tabelHtml += `</tr>`;
      if (i == headRowNumber) {
        tabelHtml += `</thead>`;
        tabelHtml += `<tbody>`;
      }
    }
    tabelHtml += `</tbody>`;
    table.innerHTML = tabelHtml;
    */
    //*写入属性和内容 dom操作
    //*将部分body的tr移入head
    let tbody = table.querySelector("tbody");
    for (let i = 0; i < headRowNumber - 1; i++) {
      let tr = tbody.children[i];
      table.querySelector("thead").appendChild(tr.cloneNode(true));
      tr.remove(); //使用了remove导致不能用let tr of tbody.rows循环
    }
    const lute = this.lute;
    //*写入属性、内容
    let i = 0;
    for (let tr of table.rows) {
      let j = 0;
      for (let td of tr.cells) {
        let childHtml = ``;
        for (let value of tableArr[i][j].value) {
          childHtml += value.outerHTML; //?outerHTML
        }
        const tagName = j < leftColNumber || i < headRowNumber ? "th" : "td";
        td.outerHTML = `<${tagName} colSpan=${
          tableArr[i][j].colspan || 1
        } rowspan=${tableArr[i][j].rowspan || 1} class=${
          tableArr[i][j].class || ""
        }>${childHtml}
        </${tagName}>`;
        //console.log(td);
        j++;
      }
      i++;
    }
    //let html = ele.innerHTML;
    //html = lute.BlockDOM2HTML(html);
    //*输出
    const content = ` <div class="b3-dialog__content">
    <div class="protyle-wysiwyg protyle-wysiwyg--attr" style="height: 360px;">${ele.innerHTML}</div>
  </div>`;
    new Dialog({
      title: "表格预览",
      transparent: false,
      width: this.isMobile ? "92vw" : "700px",
      content: content,
      height: "540px",
    });
    return ele;
  }

  private onBlockIconEvent({ detail }: any) {
    if (detail.blockElements.length !== 1) {
      return;
    }
    const selectDom = detail.blockElements[0] as HTMLElement;
    if (selectDom.getAttribute("data-type") !== "NodeList") {
      return;
    }
    //console.log(lute.BlockDOM2HTML(selectDom.outerHTML));
    const list2table = this.list2table.bind(this);
    const lute = this.lute;
    const menuItem: IMenuItemOption = {
      label: "列表转表格",
      id: "siyuanPlugin-list2table",
      async click() {
        let kramdown = lute.BlockDOM2StdMd(selectDom.outerHTML);
        list2table({ kramdown: kramdown, dom: selectDom.cloneNode(true) });
      },
    };
    detail.menu.addItem(menuItem);
  }
  //todo 转置
  /*private transpose(arr: any[][]) {
        let newArr = buildArr(arr[0].length, arr.length, unfillCell);
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].length; j++) {
            newArr[j][i] = arr[i][j];
            newArr[j][i].colspan = arr[i][j].rowspan;
            newArr[j][i].rowspan = arr[i][j].colspan;
          }
        }
        return newArr;
      }*/
  private blockDom2htmlClear(html: string) {
    let result: string;
    const lute = this.lute;
    let ele = document.createElement("div");
    ele.innerHTML = html;
    let table = ele.querySelector("table");
    if (table) {
      //console.log(table)
      result = "<table border = '1'>";
      //*逐个单元格转化
      for (let body of table.children) {
        result += `<${body.tagName.toLowerCase()}>`;
        for (let tr of body.children) {
          result += `<${tr.tagName.toLowerCase()}>`;
          for (let td2 of tr.children) {
            let td = td2 as HTMLTableCellElement;
            if (td.className === "fn__none") {
              continue;
            }
            result += `<${td.tagName.toLowerCase()} colspan="${
              td.colSpan || 1
            }" rowspan="${td.rowSpan || 1}" >`;
            for (let value of td.children) {
              result += lute.BlockDOM2HTML(value.outerHTML);
              //console.log("转化前", value.outerHTML);
              //console.log("转化后", lute.BlockDOM2HTML(value.outerHTML));
            }
            result += `</${td.tagName.toLowerCase()}>`;
          }
          result += `</${tr.tagName.toLowerCase()}>`;
        }
        result += `</${body.tagName.toLowerCase()}>`;
      }
      result += `</table>`;
      //table.border = "1";
      //result = table.outerHTML;
    } else {
      result = lute.BlockDOM2HTML(html);
    }
    result = result.replace(/\{: .*?\}/g, "");
    console.log(result);
    navigator.clipboard.writeText(result);
    return result;
  }
}

interface conceptTree {
  name: string; //属性或概念名
  value: HTMLElement[]; //属性值
  isProp?: boolean;
  children: conceptTree[];
  colspan?: number;
  rowspan?: number;
  //depth?: number; //用于便于构建
  parent: conceptTree; //用于便于构建
  path: string[]; //便于判断单元格位置
}

interface cell {
  concept: string[]; //概念名路径
  prop: string[]; //属性名路径
  value: HTMLElement[]; //单元格值
  rowspan?: number;
  colspan?: number;
  class?: string; //
}
