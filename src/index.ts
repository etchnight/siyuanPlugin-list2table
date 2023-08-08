import { Plugin } from "siyuan";

const STORAGE_NAME = "menu-config";

export default class PluginSample extends Plugin {
  async onload() {}
  onLayoutReady() {}
  onunload() {}
}

interface conceptTree {
  name: string; //属性或概念名
  value?: string; //属性值
  type: "concept" | "prop" | "cell" | undefined;
  children?: conceptTree[];
  colspan?: number;
  rowspan?: number;
}
