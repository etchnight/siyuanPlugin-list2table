# 将列表转化为二维表格

[English](./README_en_US.md)

[思源笔记](https://b3log.org/siyuan/)插件，将列表通过一定规则转换为二维表格。与表格视图不同的是，本插件将在原有列表中提取`概念`组成上方表头，提取`属性`组成左侧表头，将`概念`和`属性`对应的内容填入相应单元格。结果在新的表格中显示，**不更改原笔记内内容**。

## 使用方法

启用插件后，在列表块（注意不是列表项块）的菜单内会增加一个`列表转表格`的菜单项，点击将在弹出窗口中显示转换结果。

插件设置内有以下选项：
- 属性名与属性值之间的分隔符号：分隔符号前将提取为`属性名`，分隔符号后将识别为`属性值`
- 属性名最大长度，0表示无限制，若分隔符号出现位置在此长度外，不会进行分割

更详细的转换说明请见示例。

❗❗ 若要将结果复制至其他地方使用并保证正常显示，请将转换后表格 html 代码中`<th class="fn__none">`及`<td class="fn__none">`全部删除。

## 示例

### 转化前

* 概念1

  * 概念1-1

    * 属性5

      * 属性5-1：概念1-1-属性5-1
    * 属性2

      * 属性2-1：概念1-1-属性2-1
    * 属性3

      * 属性3-1：因在概念1-2中，属性3与属性1同级，会被判断为属性
      * 属性3-2：概念1-1-属性3-2
    * 属性6

      * 属性6-2：概念1-1-属性6-2
      * 属性6-1

        * 属性6-1-1：概念1-1-属性6-1-1
  * 概念1-2：非属性节点即使存在分隔符也不会被拆分

    * 属性1：概念1-2-属性1
    * 属性3

      * 属性3-1：概念1-2-属性3-1
      * 属性3-3：概念1-2-属性3-3
* 概念2

  * 属性1：概念2-属性1
  * 属性3：该属性应有下级但没有，会合并单元格
  * 属性4：概念2-属性4
  * 属性6

    * 属性6-1

      * 属性6-1-2：概念2-属性6-1-2
* 不规范的概念1

  * 属性5

    * 属性6-2：属性同名但路径不同，可处理（属性5-属性6-2）
  * 属性6

    * 属性5-1：属性同名但路径不同，可处理（属性6-属性5-1）
* 不规范的概念2（不同层级属性混在一级）

  * 属性2-1：与((20230417003249-5ahw5qp "概念1-1的属性2-1"))不在同一层级，会被识别为不同属性
* 不规范的概念3（非叶子节点存在属性值）

  * 属性2：该属性不应该有属性值，会被判断为概念，且导致下层属性丢失父属性

    * 属性2-1：不规范的概念3-属性2-1

### 转化后

<div data-node-id="20230809003400-b481hce" data-node-index="1" data-type="NodeTable" class="table"><div contenteditable="false"><table contenteditable="true" spellcheck="false"><colgroup><col><col><col><col><col><col><col><col><col></colgroup><thead><tr><th colspan="3" rowspan="2"></th></th></th><th colspan="2" rowspan="1">概念1</th></th><th colspan="1" rowspan="2">概念2</th><th colspan="1" rowspan="2">不规范的概念1</th><th colspan="1" rowspan="2">不规范的概念2（不同层级属性混在一级）</th><th>不规范的概念3（非叶子节点存在属性值）</th></tr><tr></th></th></th><th>概念1-1</th><th>概念1-2：非属性节点即使存在分隔符也不会被拆分</th></th></th></th><th>属性2：该属性不应该有属性值，会被判断为概念，且导致下层属性丢失父属性</th></tr></thead><tbody><tr><th colspan="1" rowspan="2">属性5</th><th colspan="2" rowspan="1">属性5-1</th></th><td>概念1-1-属性5-1</td><td></td><td></td><td></td><td></td><td></td></tr><tr></th><th colspan="2" rowspan="1">属性6-2</th></th><td></td><td></td><td></td><td>属性同名但路径不同，可处理（属性5-属性6-2）</td><td></td><td></td></tr><tr><th>属性2</th><th colspan="2" rowspan="1">属性2-1</th></th><td>概念1-1-属性2-1</td><td></td><td></td><td></td><td></td><td></td></tr><tr><th colspan="1" rowspan="3">属性3</th><th colspan="2" rowspan="1">属性3-1</th></th><td>因在概念1-2中，属性3与属性1同级，会被判断为属性</td><td>概念1-2-属性3-1</td><td colspan="1" rowspan="3">该属性应有下级但没有，会合并单元格</td><td></td><td></td><td></td></tr><tr></th><th colspan="2" rowspan="1">属性3-2</th></th><td>概念1-1-属性3-2</td><td></td><td></td><td></td><td></td><td></td></tr><tr></th><th colspan="2" rowspan="1">属性3-3</th></th><td></td><td>概念1-2-属性3-3</td><td></td><td></td><td></td><td></td></tr><tr><th colspan="1" rowspan="4">属性6</th><th colspan="2" rowspan="1">属性6-2</th></th><td>概念1-1-属性6-2</td><td></td><td></td><td></td><td></td><td></td></tr><tr></th><th colspan="1" rowspan="2">属性6-1</th><th>属性6-1-1</th><td>概念1-1-属性6-1-1</td><td></td><td></td><td></td><td></td><td></td></tr><tr></th></th><th>属性6-1-2</th><td></td><td></td><td>概念2-属性6-1-2</td><td></td><td></td><td></td></tr><tr></th><th colspan="2" rowspan="1">属性5-1</th></th><td></td><td></td><td></td><td>属性同名但路径不同，可处理（属性6-属性5-1）</td><td></td><td></td></tr><tr><th colspan="3" rowspan="1">属性1</th></th></th><td></td><td>概念1-2-属性1</td><td>概念2-属性1</td><td></td><td></td><td></td></tr><tr><th colspan="3" rowspan="1">属性4</th></th></th><td></td><td></td><td>概念2-属性4</td><td></td><td></td><td></td></tr><tr><th colspan="3" rowspan="1">属性2-1</th></th></th><td></td><td></td><td></td><td></td><td>与概念1-1的属性2-1不在同一层级，会被识别为不同属性</td><td>不规范的概念3-属性2-1</td></tr></tbody></table><div class="protyle-action__table"><div class="table__resize"></div><div class="table__select"></div></div></div><div class="protyle-attr" contenteditable="false">​</div></div>

## 感谢

- [使用 vite + svelte 的思源笔记插件示例
  ](https://github.com/siyuan-note/plugin-sample-vite-svelte)

## 开发相关

 ❗❗❗ 为统一项目方法和类型，思源 api 相关方法和类型均在[siyuanPlugin-common](https://github.com/etchnight/siyuanPlugin-common)项目中