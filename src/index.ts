import {
  Dialog,
  IMenuItemOption,
  Lute,
  Plugin,
  Setting,
  getFrontend,
  openTab,
} from "siyuan";
//@ts-ignore
import { stringify, parse } from "@ungap/structured-clone/json";
import { pushMsg } from "../../siyuanPlugin-common/siyuan-api";
const STORAGE_NAME = "siyuanPlugin-list2table";

export default class PluginList2table extends Plugin {
  private isMobile: boolean;
  private blockIconEventBindThis = this.onBlockIconEvent.bind(this);
  private lute: Lute;
  //private luteClass: any;
  private isdebug: boolean = true;
  private tableEle: HTMLDivElement;
  private dialog: Dialog;
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
        splitFlagElement.className =
          "b3-text-field fn__flex-center fn__size200";
        splitFlagElement.value = this.data[STORAGE_NAME].splitFlag;
        return splitFlagElement;
      },
    });
    this.setting.addItem({
      title: this.i18n.maxIndex,
      createActionElement: () => {
        maxIndexElement.className = "b3-text-field fn__flex-center fn__size200";
        maxIndexElement.type = "number";
        maxIndexElement.value = this.data[STORAGE_NAME].maxIndex;
        return maxIndexElement;
      },
    });
  }
  async onLayoutReady() {
    //@ts-ignore
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
   * 应当传入clone后的dom
   * 列表-列表项-段落等              -列表项
   *   |--列表项-列表 -列表项    =>    |-列表项-列表项
   *        |---段落等
   */
  static dom2json(
    dom: HTMLElement | Element,
    parent: conceptTree,
    splitFlag: string,
    maxIndex: number
  ): void {
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
          PluginList2table.dom2json(item, self, splitFlag, maxIndex);
          break;
        //进入下级节点
        case "NodeList":
          PluginList2table.dom2json(item, parent, splitFlag, maxIndex);
          break;
        //修改父节点
        default:
          //提取属性名
          if (
            count === 1 &&
            item.getAttribute("data-type") === "NodeParagraph"
          ) {
            let name: string = PluginList2table.buildJsonNodeName(
              item,
              splitFlag,
              maxIndex,
              false
            );
            if (name != item.textContent) {
              //?需要这个判断么
              parent.value.push(item);
            }
            parent.name = name;
            parent.path.push(parent.name);
          } else {
            parent.value.push(item);
          }
        //console.log(parent.name, "value增加", item.textContent);
      }
    }
  }
  /**
   * 用于处理标题组成的文档
   * 在生成时进行clone，因为需要寻找上下文，不能在传入clone后的dom
   */
  static dom2jsonForHead(
    dom: HTMLElement,
    json: conceptTree,
    splitFlag: string,
    maxIndex: number
  ): void {
    //查找自身所在位置
    const parent = dom.parentElement;
    const selfLevel = parseInt(dom.getAttribute("data-subtype").substring(1));
    let isDomFinded = false;
    let levelLast = selfLevel;
    //let jsonLast = json;
    let jsonParent = json;
    const getLevel = (brother: Element) => {
      let level = 0;
      if (brother.getAttribute("data-type") == "NodeHeading") {
        level = parseInt(brother.getAttribute("data-subtype").substring(1));
      } else {
        level = 50;
      }
      return level;
    };
    for (let brother of parent.children) {
      if (brother == dom) {
        isDomFinded = true;
      }
      if (!isDomFinded) {
        continue;
      }
      if (!brother.getAttribute("data-node-id")) {
        continue;
      }
      let level = getLevel(brother);
      if (level < selfLevel) {
        break;
      }
      //兄弟
      if (level === levelLast) {
        //jsonParent = jsonParent;
      }
      //下级
      if (level > levelLast) {
        jsonParent = jsonParent.children[jsonParent.children.length - 1];
      }
      //新级别
      if (level < levelLast) {
        while (jsonParent.parent && level <= getLevel(jsonParent.value[0])) {
          jsonParent = jsonParent.parent;
        }
      }
      if (brother.getAttribute("data-type") === "NodeList") {
        //处理列表
        this.dom2json(
          brother.cloneNode(true) as Element,
          jsonParent,
          splitFlag,
          maxIndex
        );
      } else {
        const brotherClone = brother.cloneNode(true) as HTMLElement;
        const name = this.buildJsonNodeName(
          brotherClone,
          splitFlag,
          maxIndex,
          true
        );
        //console.log(level, name);
        if (!name) {
          continue;
        }
        jsonParent.children.push({
          name: name,
          value: [brotherClone],
          parent: jsonParent,
          path: jsonParent.parent ? jsonParent.path.concat(name) : [name],
          children: [],
        });
      }
      //jsonLast = jsonParent.children[jsonParent.children.length - 1];
      levelLast = level;
    }
    //console.log(json);
  }
  /**
   * 该函数会改变输入的dom
   * @returns
   */
  static buildJsonNodeName(
    item: HTMLElement,
    splitFlag: string,
    maxIndex: number,
    isHead: boolean
  ) {
    let name: string; //HTMLElement;
    let text = item.textContent;
    const index = text.indexOf(splitFlag);
    if (index < 0 || (maxIndex > 0 && index + 1 > maxIndex)) {
      if (item.getAttribute("data-type") != "NodeHeading" && isHead) {
        return null;
      } else {
        return text;
      }
    } else {
      name = text.substring(0, index);
      //*删除name
      recursionDelName(item, splitFlag);
      //tem.textContent = item.textContent.replace(`${name}${splitFlag}`, "");
      return name;
    }
    function recursionDelName(item: Node, splitFlag: string) {
      for (let node of item.childNodes) {
        //console.log(node,node.textContent)
        if (node.nodeType == 3) {
          let valueList = node.textContent.split("");
          for (let i = 0; i < valueList.length; i++) {
            if (valueList[i] === splitFlag) {
              valueList[i] = "";
              node.textContent = valueList.join("");
              return;
            } else {
              valueList[i] = "";
            }
          }
          node.textContent = valueList.join("");
        } else {
          recursionDelName(node, splitFlag);
        }
      }
    }
  }
  static json2tableParts(json: conceptTree, splitFlag: string) {
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
    const propNameListUnique = [...new Set(propNameList)]; //去重
    const newpropNameList = determineProp(json, [], propNameListUnique);
    //console.log([...new Set(newpropNameList)]);//二次生成属性全列表
    //*第一步修正-合并非属性节点的`属性名`和`属性值`，以防止丢失信息，可选
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
        if (child.children.length === 0 && child.value.length > 0) {
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
          if (PluginList2table.isSameList(json.path, child.path)) {
            return child;
          } else {
            return findSameLevel(json, child);
          }
        }
      }
      function mergeProps(json: conceptTree, resInSameLevel: conceptTree) {
        //console.log(resInSameLevel)
        for (let child of json.children) {
          let childInSameLevel = resInSameLevel.children.find((item) => {
            return PluginList2table.isSameList(item.path, child.path);
          });
          if (!childInSameLevel) {
            //console.log(resInSameLevel);
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
          return PluginList2table.isSameList(item.prop, child.path);
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
  static tableParts2matrix(tableParts: {
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
    function fillHeadOrLeft(
      json: conceptTree,
      rowOrColNum: number,
      arr: cell[][],
      isLeft?: boolean
    ) {
      const length = isLeft ? arr.length : arr[rowOrColNum].length;
      for (const child of json.children) {
        for (let j = 0; j < length; j++) {
          let rowNum = isLeft ? j : rowOrColNum;
          let colNum = isLeft ? rowOrColNum : j;
          if (isUnfillCell(arr[rowNum][colNum])) {
            arr[rowNum][colNum] = {
              value: [nodeParagraph(child.name)], //!注意这里对value做了更改
              //attr: "",
              prop: child.isProp ? child.path : [],
              concept: !child.isProp ? child.path : [],
            };
            //*合并单元格
            mergeCell(child, rowNum, colNum, arr);
            break;
          }
        }
        fillHeadOrLeft(child, rowOrColNum + 1, arr, isLeft);
      }
    }
    function fillCells(
      cells: cell[],
      arr: cell[][],
      headRowNum: number,
      leftColNum: number
    ) {
      for (let cell of cells) {
        //*查找概念（上方表头）
        let colNum = leftColNum; //无上方表头会直接跳过
        let isFinded = false;
        for (let i = headRowNum - 1; i >= 0; i--) {
          for (let j = leftColNum - 1; j < arr[i].length; j++) {
            if (PluginList2table.isSameList(arr[i][j].concept, cell.concept)) {
              colNum = j;
              isFinded = true;
              break;
            }
          }
          if (isFinded) {
            break;
          }
        }

        //*查找属性（左侧表头）
        let rowNum = 0;
        for (let j = leftColNum - 1; j >= 0; j--) {
          //无上方表头i初始值为0
          for (let i = headRowNum ? headRowNum - 1 : 0; i < arr.length; i++) {
            if (PluginList2table.isSameList(arr[i][j].prop, cell.prop)) {
              rowNum = i;
              break;
            }
          }
          if (rowNum) {
            break;
          }
        }
        arr[rowNum][colNum].value = cell.value;
        //console.log(rowNum,colNum,cell.value[0].textContent)
        mergeCell(cell, rowNum, colNum, arr);
      }
    }
    const head = tableParts.head;
    const left = tableParts.left;
    const cells = tableParts.cells;
    //*构建矩阵
    const maxj = head.colspan + tableParts.maxLeftDepth;
    const maxi = left.rowspan + tableParts.maxHeadDepth;
    let arr: cell[][];
    if (tableParts.maxHeadDepth) {
      arr = buildArr(maxi, maxj, unfillCell);
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
      //*上方表头
      fillHeadOrLeft(head, 0, arr);
    } else {
      arr = buildArr(maxi, maxj + 1, unfillCell);
    }
    //*左侧表头
    fillHeadOrLeft(left, 0, arr, true);
    //*主体单元格
    fillCells(cells, arr, tableParts.maxHeadDepth, tableParts.maxLeftDepth);
    return {
      //?markdown: markdown,
      headRowNum: tableParts.maxHeadDepth,
      leftColNum: tableParts.maxLeftDepth,
      tableArr: arr,
    };
  }
  private list2table(obj: {
    kramdown: string;
    dom: HTMLElement;
    domNoClone: HTMLElement;
  }) {
    //PluginList2table.blockDom2htmlClear(obj.dom.innerHTML);
    //?const jsonList = this.markdown2jsonList(obj.kramdown);保留
    let json: conceptTree = {
      name: "root",
      children: [],
      parent: undefined,
      path: ["root"],
      value: [document.createElement("div")],
    };
    const blockType = obj.dom.getAttribute("data-type");
    const splitFlag = this.data[STORAGE_NAME].splitFlag;
    const maxIndex = this.data[STORAGE_NAME].maxIndex;
    if (blockType == "NodeHeading") {
      PluginList2table.dom2jsonForHead(
        obj.domNoClone,
        json,
        splitFlag,
        maxIndex
      );
    } else if (blockType == "NodeList") {
      PluginList2table.dom2json(obj.dom, json, splitFlag, maxIndex);
    }
    this.debugConsole("json", json);
    //const json = this.listJson2json(jsonList);保留
    const tableParts = PluginList2table.json2tableParts(json, splitFlag);
    this.debugConsole("tableParts", tableParts);
    const { headRowNum, tableArr, leftColNum } =
      PluginList2table.tableParts2matrix(tableParts);
    this.debugConsole("tableArr", tableArr);
    const ele = PluginList2table.matrix2table(
      headRowNum,
      leftColNum,
      tableArr,
      this.lute
    );
    this.tableEle = ele;
    this.debugConsole("ele", ele);
    this.showDialog();
  }
  static copyHtml(event: MouseEvent) {
    const ele = PluginList2table.getTableEle(event.target as HTMLElement);
    //@ts-ignore
    const lute = window.Lute.New() as Lute;
    const html = PluginList2table.blockDom2htmlClear(ele.outerHTML, lute);
    navigator.clipboard.writeText(html).then(() => {
      pushMsg(`已将转化后html复制至剪贴板`, 5000);
    });
  }
  static matrix2table(
    //?markdown: string,
    headRowNumber: number,
    leftColNumber: number,
    tableArr: cell[][],
    lute: Lute
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
    const eleHtml = lute.Md2BlockDOM(markdown);
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
    return ele;
  }
  private showDialog() {
    const dialog = new Dialog({
      title: "表格预览",
      transparent: false,
      width: this.isMobile ? "92vw" : "700px",
      content: `<div id='plugin-list2table-dialog'></div>`,
      height: "540px",
    });
    //const data: data = { matrixInfo: this.matrixInfo, tableEle: this.tableEle };
    //@ts-ignore
    //dialog.data = data;
    let UIele = PluginList2table.makeUIele(this.tableEle);
    //*切换到tab功能
    let tabButton = document.createElement("button");
    tabButton.className =
      "b3-button b3-button--outline fn__flex-center fn__size200";
    tabButton.setAttribute("data-type", "config");
    tabButton.innerText = "在标签页中显示";
    tabButton.onclick = this.showTab.bind(this);
    const divEle = UIele.querySelector("#plugin-list2table-function");
    divEle.appendChild(tabButton);
    document.getElementById("plugin-list2table-dialog").appendChild(UIele);
    PluginList2table.resizeTable(UIele);
    this.dialog = dialog;
  }
  static resizeTable(container: HTMLElement) {
    const table = container.querySelector("table");
    if (!table) {
      return;
    }
    const tableParent = table.parentElement;
    const width = window.getComputedStyle(tableParent).width;
    table.style.width = width;
  }
  static makeUIele(tableEle: HTMLElement) {
    const content = `
    <div id='plugin-list2table-function'>
    <button id='plugin-list2table-transpose' class="b3-button b3-button--outline fn__flex-center fn__size200" data-type="config">转置</button>
        <button id='plugin-list2table-copyHtml' class="b3-button b3-button--outline fn__flex-center fn__size200" data-type="config">
        复制Html代码
    </button>
    </div>
    <div id='plugin-list2table' class="protyle-wysiwyg protyle-wysiwyg--attr"">${tableEle.innerHTML}</div>`;
    const ele = document.createElement("div");
    ele.className = "b3-dialog__content";
    ele.innerHTML = content;
    //*功能
    //const transposeThis = this.transpose.bind(this);
    const transposeButton = ele.querySelector(
      "#plugin-list2table-transpose"
    ) as HTMLElement;
    transposeButton.onclick = this.transpose;
    //const copyHtml = this.copyHtml.bind(this);
    const copyHtmlButton = ele.querySelector(
      "#plugin-list2table-copyHtml"
    ) as HTMLElement;
    copyHtmlButton.onclick = this.copyHtml;
    //*拖动改变列宽
    //copy from siyuan\app\src\protyle\wysiwyg\index.ts
    ele.addEventListener("mousedown", (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // table col resize
      if (target.classList.contains("table__resize")) {
        //原 !protyle.disabled &&
        let nodeElement = target;
        while (nodeElement && nodeElement.parentElement) {
          if (nodeElement.hasAttribute("data-node-id")) {
            break;
          } else {
            nodeElement = nodeElement.parentElement;
          }
        }
        if (!nodeElement) {
          return;
        }
        //const html = nodeElement.outerHTML;
        // https://github.com/siyuan-note/siyuan/issues/4455
        if (getSelection().rangeCount > 0) {
          getSelection().getRangeAt(0).collapse(false);
        }
        // @ts-ignore
        nodeElement.firstElementChild.style.webkitUserModify = "read-only";
        nodeElement.style.cursor = "col-resize";
        target.removeAttribute("style");
        //const id = nodeElement.getAttribute("data-node-id");
        const x = event.clientX;
        const colIndex = parseInt(target.getAttribute("data-col-index"));
        const colElement = nodeElement.querySelectorAll("table col")[
          colIndex
        ] as HTMLElement;
        // 清空初始化 table 时的最小宽度
        if (colElement.style.minWidth) {
          colElement.style.width =
            (
              nodeElement.querySelectorAll("table td, table th")[
                colIndex
              ] as HTMLElement
            ).offsetWidth + "px";
          colElement.style.minWidth = "";
        }
        // 移除 cell 上的宽度限制 https://github.com/siyuan-note/siyuan/issues/7795
        nodeElement
          .querySelectorAll("tr")
          .forEach((trItem: HTMLTableRowElement) => {
            trItem.cells[colIndex].style.width = "";
          });
        const oldWidth = colElement.clientWidth;
        const hasScroll =
          nodeElement.firstElementChild.clientWidth <
          nodeElement.firstElementChild.scrollWidth;
        document.onmousemove = (moveEvent: MouseEvent) => {
          if (nodeElement.style.textAlign === "center" && !hasScroll) {
            colElement.style.width =
              oldWidth + (moveEvent.clientX - x) * 2 + "px";
          } else {
            colElement.style.width = oldWidth + (moveEvent.clientX - x) + "px";
          }
        };

        document.onmouseup = () => {
          // @ts-ignore
          nodeElement.firstElementChild.style.webkitUserModify = "";
          nodeElement.style.cursor = "";
          document.onmousemove = null;
          document.onmouseup = null;
          document.ondragstart = null;
          document.onselectstart = null;
          document.onselect = null;
          /*if (nodeElement) {
            updateTransaction(protyle, id, nodeElement.outerHTML, html);
          }*/
        };
        return;
      }
    });
    //this.UIele = ele;
    const resizeObserver = new ResizeObserver((entries) => {
      PluginList2table.resizeTable(ele);
    });
    resizeObserver.observe(ele);
    return ele;
  }
  private showTab() {
    const UIele = PluginList2table.makeUIele(this.tableEle);
    const tabType = "custom_tab";
    this.addTab({
      type: tabType,
      init() {
        this.element.appendChild(UIele);
        PluginList2table.resizeTable(this.element);
      },
      update() {
        PluginList2table.resizeTable(this.element);
      },
      resize() {},
      beforeDestroy() {},
      destroy() {},
    });
    const tab = openTab({
      app: this.app,
      custom: {
        icon: "iconFace",
        title: "表格预览",
        //@ts-ignore
        id: this.name + tabType,
      },
    });
    this.dialog.destroy();
  }
  private onBlockIconEvent({ detail }: any) {
    if (detail.blockElements.length !== 1) {
      return;
    }
    const selectDom = detail.blockElements[0] as HTMLElement;
    if (
      selectDom.getAttribute("data-type") !== "NodeList" &&
      selectDom.getAttribute("data-type") !== "NodeHeading"
    ) {
      return;
    }
    const list2table = this.list2table.bind(this);
    const lute = this.lute;
    const menuItem: IMenuItemOption = {
      label: "列表转表格",
      id: "siyuanPlugin-list2table",
      async click() {
        let kramdown = lute.BlockDOM2StdMd(selectDom.outerHTML);
        list2table({
          kramdown: kramdown,
          dom: selectDom.cloneNode(true),
          domNoClone: selectDom,
        });
      },
    };
    detail.menu.addItem(menuItem);
  }
  static blockDom2htmlClear(html: string, lute: Lute) {
    let result: string;
    //const lute = this.lute;
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
    //console.log(result);
    //navigator.clipboard.writeText(result);
    return result;
  }
  static getTableEle(node: HTMLElement) {
    let tableEle: HTMLElement = null;
    while (!tableEle && node.parentElement) {
      let tableEle = node.querySelector("table");
      if (!tableEle) {
        node = node.parentElement;
      } else {
        return tableEle;
      }
    }
  }

  static transpose(event: MouseEvent) {
    let node = event.target as HTMLElement;
    let tableEle = PluginList2table.getTableEle(node) as HTMLTableElement;
    if (!tableEle) {
      return;
    }
    const headRowNum = tableEle.rows[0].cells[0].colSpan;
    let tableClone = tableEle.cloneNode(true) as HTMLTableElement;
    tableEle.tHead.remove();
    for (let body of tableEle.tBodies) {
      body.remove();
    }
    let colgroup = tableEle.querySelector("colgroup");
    colgroup.innerHTML = "";
    let tHead = tableEle.createTHead();
    let tBody = tableEle.createTBody();
    let part = tHead;
    for (let i = 0; i < tableClone.rows.length; i++) {
      let row = tableClone.rows[i];
      if (i > colgroup.childElementCount - 1) {
        colgroup.appendChild(document.createElement("col"));
      }
      for (let j = 0; j < row.cells.length; j++) {
        if (j > headRowNum - 1) {
          part = tBody;
        } else {
          part = tHead;
        }
        let cell = row.cells[j];
        while (!tableEle.rows[j]) {
          part.insertRow();
        }
        let cellClone = cell.cloneNode(true) as HTMLTableCellElement;
        [cellClone.rowSpan, cellClone.colSpan] = [cell.colSpan, cell.rowSpan];
        tableEle.rows[j].appendChild(cellClone);
      }
    }
    /*
    let tableArr: cell[][] = [];
    for (let i = 0; i < orginTable.length; i++) {
      for (let j = 0; j < orginTable[0].length; j++) {
        if (tableArr.length < j + 1) {
          tableArr.push([]);
        }
        tableArr[j][i] = {
          concept: orginTable[i][j].concept,
          value: orginTable[i][j].value,
          prop: orginTable[i][j].prop,
          class: orginTable[i][j].class,
          colspan: orginTable[i][j].rowspan,
          rowspan: orginTable[i][j].colspan,
        };
      }
    }
    const ele = this.matrix2table(headRowNum, leftColNum, tableArr);
    return {
      matrixInfo: {
        headRowNum: headRowNum,
        leftColNum: leftColNum,
        tableArr: tableArr,
      },
      tableEle: ele,
    };*/
  }
  private debugConsole(...theArgs: any[]) {
    if (!this.isdebug) {
      return;
    }
    let newArgs = [];
    for (let arg of theArgs) {
      newArgs.push(parse(stringify(arg)));
    }
    console.log("列表转表格插件(引用)：", ...theArgs);
    console.log("列表转表格插件(克隆)：", ...newArgs);
  }
  static isSameList(item1: string[], item2: string[]) {
    let str1 = item1.toString().replace(/[\u0000-\u0020]/g, "");
    let str2 = item2.toString().replace(/[\u0000-\u0020]/g, "");
    str1 = str1.replace(/[\u200B-\u200D\uFEFF]/g, "");
    str2 = str2.replace(/[\u200B-\u200D\uFEFF]/g, "");
    return str1 === str2;
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
