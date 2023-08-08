import { Dialog, IMenuItemOption, Plugin, Setting, getFrontend } from "siyuan";
import {
  addMenuItemOnExist,
  getBlockKramdown,
  getSelectDom,
  kramdown2markdown,
} from "../../siyuanPlugin-common/siyuan-api";
const STORAGE_NAME = "siyuanPlugin-list2table";

export default class PluginList2table extends Plugin {
  private isMobile: boolean;
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
    this.loadData(STORAGE_NAME);
    const list2table = this.list2table.bind(this);
    const menuItem: IMenuItemOption = {
      label: "列表转表格",
      id: "siyuanPlugin-list2table",
      async click() {
        const selectDom = getSelectDom();
        if (!selectDom) {
          return;
        }
        const blockId = selectDom.getAttribute("data-node-id");
        const data = await getBlockKramdown(blockId);
        let kramdown = data.kramdown;
        //console.log(kramdown)
        kramdown = kramdown.replace(/\{:.*?\}/g, "");
        list2table(kramdown);
      },
    };
    addMenuItemOnExist(menuItem, () => {
      const selectDom = getSelectDom();
      if (!selectDom) {
        return false;
      }
      if (selectDom.getAttribute("data-type") === "NodeList") {
        return true;
      }
      //return true
      return false;
    });
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
  onunload() {}
  private list2json(kramdown: string): conceptTree {
    const splitFlag = this.data[STORAGE_NAME].splitFlag;
    const maxIndex = this.data[STORAGE_NAME].maxIndex;
    function buildJson(text: string): conceptTree {
      text = text.replace("* ", "");
      text = text.trim();
      text = kramdown2markdown(text);
      const index = text.indexOf(splitFlag);
      if (index < 0 || (maxIndex > 0 && index + 1 > maxIndex)) {
        return { name: text, children: [] };
      }
      const name = text.substring(0, index);
      const value = text.substring(index + 1);
      return { name: name, value: value, children: [] };
    }
    let textList = kramdown.split("\n");
    //去除空行
    textList = textList.filter((item) => {
      return item.replace(/ /g, "") != "";
    });
    let json: conceptTree = {
      name: "root",
      //type: undefined,
      children: [],
      depth: 0,
    };
    let parent = json;
    let lastObj = json;
    for (let item of textList) {
      let depth = item.indexOf("*") / 2 + 1;
      let obj = buildJson(item);
      obj.depth = depth;
      //*子级
      if (depth > lastObj.depth) {
        parent = lastObj;
        parent.children.push(obj);
      }
      //*兄弟
      else if (depth === lastObj.depth) {
        parent.children.push(obj);
      }
      //*另外一个分支（上级）
      else if (depth < lastObj.depth) {
        let count = 0;
        parent = parent.parent;
        while (parent.depth != depth - 1 && count < 100) {
          count++;
          parent = parent.parent;
        }
        parent.children.push(obj);
      }
      obj.parent = parent;
      lastObj = obj;
    }
    return json;
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
        } else if (!child.children || child.children.length === 0) {
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
    const propNameListUnique = [...new Set(propNameList)];
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
    concatNameValue(json);
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
            value: child.value || "",
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
        conceptJsonChild.parent = undefined;
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
      depth: 0,
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
  private tableParts2markdown(tableParts: {
    cells: cell[];
    head: conceptTree;
    left: conceptTree;
    maxHeadDepth: number;
    maxLeftDepth: number;
  }) {
    function buildSpan(json: conceptTree | cell) {
      //@ts-ignore
      const colspan = json.colspan || 1;
      const rowspan = json.rowspan || 1;
      if (colspan > 1 || rowspan > 1) {
        return `colspan="${colspan}" rowspan="${rowspan}"`;
      }
      return ``;
    }
    function realRowspan(json: conceptTree | cell, isTranspose: boolean) {
      return isTranspose ? json.colspan : json.rowspan;
    }
    function realColspan(json: conceptTree | cell, isTranspose: boolean) {
      return isTranspose ? json.rowspan : json.colspan;
    }
    function mergeCell(
      child: conceptTree | cell,
      rowNum: number,
      colNum: number,
      isTranspose: boolean,
      arr: cell[][]
    ) {
      //*合并单元格
      if (child.colspan > 1 || child.rowspan > 1) {
        arr[rowNum][colNum].attr = buildSpan(child);
        let colspan: number = realRowspan(child, isTranspose);
        let rowspan: number = realColspan(child, isTranspose);
        for (let i = 0; i < colspan; i++) {
          for (let j = 0; j < rowspan; j++) {
            if (!i && !j) {
              continue;
            }
            arr[rowNum + i][colNum + j] = emptyCell();
          }
        }
      }
    }
    //*kramdown无法解析，仅做占位符,空单元格
    function emptyCell(): cell {
      return {
        value: "",
        concept: [],
        prop: [],
        attr: `class="fn__none"`,
      };
    }
    //*尚未填充的单元格
    function unfillCell(): cell {
      return {
        value: "",
        concept: [],
        prop: [],
        attr: "",
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
    function fillLeftTop() {
      for (let i = 0; i < tableParts.maxHeadDepth; i++) {
        for (let j = 0; j < tableParts.maxLeftDepth; j++) {
          arr[i][j] = emptyCell();
        }
      }
      arr[0][0].attr = `colspan="${tableParts.maxLeftDepth}" rowspan="${tableParts.maxHeadDepth}"`;
    }
    fillLeftTop();
    //console.log("左上", structuredClone(arr));
    //*上方表头
    function fillHead(
      json: conceptTree,
      rowNum: number,
      arr: cell[][],
      isTranspose: boolean
    ) {
      for (const child of json.children) {
        for (let colNum = 0; colNum < arr[rowNum].length; colNum++) {
          if (!arr[rowNum][colNum].value && !arr[rowNum][colNum].attr) {
            arr[rowNum][colNum] = {
              value: child.name,
              attr: "",
              prop: child.isProp ? child.path : [],
              concept: !child.isProp ? child.path : [],
            };
            //*合并单元格
            mergeCell(child, rowNum, colNum, isTranspose, arr);
            break;
          }
        }
        fillHead(child, rowNum + 1, arr, isTranspose);
      }
    }
    //let headArr=buildArr()
    fillHead(head, 0, arr, false);
    //console.log("上方表头", structuredClone(arr));
    //*左侧表头
    const leftArr = buildArr(tableParts.maxLeftDepth, left.rowspan, unfillCell);
    fillHead(left, 0, leftArr, true);
    //console.log("leftArr", structuredClone(leftArr));
    const leftArrTrans = transpose(leftArr);
    fill2Arr(arr, leftArrTrans, tableParts.maxHeadDepth);
    //*转置
    function transpose(arr: any[][]) {
      let newArr = buildArr(arr[0].length, arr.length, unfillCell);
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          newArr[j][i] = arr[i][j];
        }
      }
      return newArr;
    }
    function fill2Arr(arr: any[][], arrFrom: any[][], startRow: number) {
      for (let i = 0; i < arrFrom.length; i++) {
        for (let j = 0; j < arrFrom[i].length; j++) {
          arr[i + startRow][j] = arrFrom[i][j];
        }
      }
    }
    //console.log("左侧", structuredClone(arr));
    //*主体单元格
    function fillCells(
      cells: cell[],
      arr: cell[][],
      rowIndexArr: cell[][],
      rowOffset: number,
      colIndexArr: cell[][],
      colOffset: number
    ) {
      for (let cell of cells) {
        let colNum = 0;
        for (let i = colIndexArr.length - 1; i >= 0; i--) {
          for (let j = 0; j < colIndexArr[i].length; j++) {
            if (
              colIndexArr[i][j].concept.toString() === cell.concept.toString()
            ) {
              colNum = j + colOffset;
              break;
            }
          }
        }
        let rowNum = 0;
        for (let i = rowIndexArr.length - 1; i >= 0; i--) {
          for (let j = 0; j < rowIndexArr[i].length; j++) {
            if (rowIndexArr[i][j].prop.toString() === cell.prop.toString()) {
              rowNum = j + rowOffset;
              //console.log(rowIndexArr[i][j], i, j);
              break;
            }
          }
        }
        arr[rowNum][colNum].value = cell.value;
        mergeCell(cell, rowNum, colNum, false, arr);
      }
    }
    fillCells(
      cells,
      arr,
      leftArr,
      tableParts.maxHeadDepth,
      arr.slice(0, tableParts.maxHeadDepth),
      0
    );
    //console.log("主体", structuredClone(arr));
    function buildMarkdown(arr: cell[][]) {
      let markdown: string = "";
      for (let i = 0; i < arr.length; i++) {
        markdown += "|";
        for (let j = 0; j < arr[i].length; j++) {
          markdown += arr[i][j].value; //|| "emptyCell";
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
      //*加尾注
      //const lute = window.Lute;
      //const id = lute.NewNodeID();
      //markdown += `{: id="${id}" updated="20230418104702" colgroup="||||"}`;
      return markdown;
    }
    let markdown = buildMarkdown(arr);
    //markdown = buildMarkdown(leftArr);
    return {
      markdown: markdown,
      headRowNumber: tableParts.maxHeadDepth,
      leftColNumber: tableParts.maxLeftDepth,
      tableArr: arr,
    };
  }
  private list2table(kramdown: string) {
    const json = this.list2json(kramdown);
    const tableParts = this.json2tableParts(json);
    //console.log(tableParts);
    const { markdown, headRowNumber, tableArr, leftColNumber } =
      this.tableParts2markdown(tableParts);
    //console.log(markdown);
    //console.log(tableArr);
    const ele = this.markdown2table(
      markdown,
      headRowNumber,
      leftColNumber,
      tableArr
    );
    //console.log(ele);
  }
  private markdown2table(
    markdown: string,
    headRowNumber: number,
    leftColNumber: number,
    tableArr: cell[][]
  ) {
    //*转html
    //@ts-ignore
    const lute = window.Lute.New();
    const eleHtml = lute.Md2BlockDOM(markdown);
    let ele = document.createElement("div");
    ele.innerHTML = eleHtml;
    let table = ele.querySelector("table");
    //*将部分body的tr移入head
    let tbody = table.querySelector("tbody");
    for (let i = 0; i < headRowNumber - 1; i++) {
      let tr = tbody.children[i];
      table.querySelector("thead").appendChild(tr.cloneNode(true));
      tr.remove();
    }
    //*写入属性
    let i = 0;
    for (let tr of table.rows) {
      let j = 0;
      for (let td of tr.cells) {
        let attr = tableArr[i][j].attr;
        const tagName = j < leftColNumber || i < headRowNumber ? "th" : "td";
        td.outerHTML = `<${tagName} ${attr ? attr : ""}>${
          td.innerText
        }</${tagName}>`;
        j++;
      }
      i++;
    }
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
}

interface conceptTree {
  name: string; //属性或概念名
  value?: string; //属性值
  isProp?: boolean;
  children: conceptTree[];
  colspan?: number;
  rowspan?: number;
  depth?: number; //用于便于构建
  parent?: conceptTree; //用于便于构建
  path?: string[]; //便于判断单元格位置
}

interface cell {
  concept: string[]; //概念名路径
  prop: string[]; //属性名路径
  value: string; //单元格值
  rowspan?: number;
  colspan?: number;
  attr?: string; //
}
