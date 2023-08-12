# 将列表转化为二维表格

[English](./README_en_US.md)

[思源笔记](https://b3log.org/siyuan/)插件，将列表通过一定规则转换为二维表格。与表格视图不同的是，本插件将在原有列表中提取`概念`组成上方表头，提取`属性`组成左侧表头，将`概念`和`属性`对应的内容填入相应单元格。结果在新的表格中显示，**不更改原笔记内内容**。

## 使用方法

启用插件后，在列表块（注意不是列表项块）的菜单内会增加一个`列表转表格`的菜单项，点击将在弹出窗口中显示转换结果。

插件设置内有以下选项：

- 属性名与属性值之间的分隔符号：分隔符号前将提取为`属性名`，分隔符号后将识别为`属性值`
- 属性名最大长度，0 表示无限制，若分隔符号出现位置在此长度外，不会进行分割

❗ 1.1 版本后，由处理 markdown 改为处理 dom，支持功能更多，但转化后效果不同。

更详细的转换说明请见示例。

## 已知问题与计划

- [ ] ❗❗ 目前表格不支持一个单元格内有多个块，转换列表项下含有多个块的列表会出现错误（包含段落，软换行）

- [ ] ❗❗ 若要将结果复制至其他地方使用并保证正常显示，请将转换后表格 html 代码中`<th class="fn__none">`及`<td class="fn__none">`全部删除，计划后续增加表格导出功能
- [ ] 计划增加行列转换功能

## 示例

❗为在markdown中正确显示，以下示例由笔记内html转化而来，最终显示效果略有不同

### 基础示例
<details>
<summary>基础示例</summary>
<h4>转化前</h4>
<ul><li><p>概念1<br /></p><ul><li>属性1：属性名与属性值之间应有分隔符号（可在设置中自定义）<br /></li><li>属性2：概念1-属性2<br /><br /></li></ul></li><li><p>概念2<br /></p><ul><li><p>概念2-1<br /></p><ul><li><p>属性1：概念、属性均可多级<br /></p></li><li><p>属性3<br /></p><ul><li>属性3-1：概念2-1-属性3-1<br /></li><li>属性3-2：概念2-1-属性3-2<br /><br /><br /><br /></li></ul></li></ul></li></ul></li></ul>
<h4>转化后</h4>
<table border = '1'><colgroup><col></col><col></col><col></col><col></col></colgroup><thead><tr><th colspan="2" rowspan="2" ></th><th colspan="1" rowspan="2" ><p style="display: inline;">概念1</p></th><th colspan="1" rowspan="1" ><p style="display: inline;">概念2</p></th></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">概念2-1</p></th></tr></thead><tbody><tr><th colspan="2" rowspan="1" ><p style="display: inline;">属性1</p></th><td colspan="1" rowspan="1" ><p>属性名与属性值之间应有分隔符号（可在设置中自定义）<br /></p></td><td colspan="1" rowspan="1" ><p>概念、属性均可多级<br /></p></td></tr><tr><th colspan="2" rowspan="1" ><p style="display: inline;">属性2</p></th><td colspan="1" rowspan="1" ><p>概念1-属性2<br /></p></td><td colspan="1" rowspan="1" ></td></tr><tr><th colspan="1" rowspan="2" ><p style="display: inline;">属性3</p></th><th colspan="1" rowspan="1" ><p style="display: inline;">属性3-1</p></th><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>概念2-1-属性3-1<br /></p></td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性3-2</p></th><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>概念2-1-属性3-2<br /></p></td></tr></tbody></table>
</details>

## 感谢

- [使用 vite + svelte 的思源笔记插件示例
  ](https://github.com/siyuan-note/plugin-sample-vite-svelte)

## 开发相关

为统一项目方法和类型，思源 api 相关方法和类型均在[siyuanPlugin-common](https://github.com/etchnight/siyuanPlugin-common)项目中
