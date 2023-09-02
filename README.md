# 将列表转化为二维表格

[English](./README_en_US.md)

[思源笔记](https://b3log.org/siyuan/)插件，将列表通过一定规则转换为二维表格。与表格视图不同的是，本插件将在原有列表中提取`概念`组成上方表头，提取`属性`组成左侧表头，将`概念`和`属性`对应的内容填入相应单元格。结果在新的表格中显示，**不更改原笔记内内容**。

## 使用方法

启用插件后，在列表块（注意不是列表项块）的菜单内会增加一个`列表转表格`的菜单项，点击将在弹出窗口中显示转换结果。

插件设置内有以下选项：

- 属性名与属性值之间的分隔符号：分隔符号前将提取为`属性名`，分隔符号后将识别为`属性值`
- 属性名最大长度，0 表示无限制，若分隔符号出现位置在此长度外，不会进行分割

更详细的转换说明请见示例。

## 重要更新

- v1.1.0  ❗由处理 markdown 改为处理 dom，支持功能更多，但转化后效果不同。
- v1.2.0  增加`转置功能`与`复制html到剪贴板`功能
- v1.2.1 🚀(实验性) 对标题块增加转表格支持，会将所选标题块之后的**同级**及其子级转化为二维表格。但目前与列表转表格不兼容，即标题下块除非带有分隔符合，其余块均会忽略。
- v1.2.2 生成的表格可调整列宽
- v1.2.3 增加`在标签页(tab)中显示`功能，将把生成的表格转移入标签页

## 示例

❗ 为在 markdown 中正确显示，以下示例中表格由笔记内生成 html 转化而来，最终显示效果略有不同

### 基础示例

<details>
<summary>点击展开</summary>
<h4>转化前</h4>

- 概念 1

  - 属性 1：属性名与属性值之间应有分隔符号（可在设置中自定义）
  - 属性 2：概念 1-属性 2

- 概念 2

  - 概念 2-1

    - 属性 1：概念、属性均可多级
    - 属性 3

      - 属性 3-1：概念 2-1-属性 3-1
      - 属性 3-2：概念 2-1-属性 3-2

<h4>转化后</h4>
<table border = '1'><colgroup><col></col><col></col><col></col><col></col></colgroup><thead><tr><th colspan="2" rowspan="2" ></th><th colspan="1" rowspan="2" ><p style="display: inline;">概念1</p></th><th colspan="1" rowspan="1" ><p style="display: inline;">概念2</p></th></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">概念2-1</p></th></tr></thead><tbody><tr><th colspan="2" rowspan="1" ><p style="display: inline;">属性1</p></th><td colspan="1" rowspan="1" ><p>属性名与属性值之间应有分隔符号（可在设置中自定义）<br /></p></td><td colspan="1" rowspan="1" ><p>概念、属性均可多级<br /></p></td></tr><tr><th colspan="2" rowspan="1" ><p style="display: inline;">属性2</p></th><td colspan="1" rowspan="1" ><p>概念1-属性2<br /></p></td><td colspan="1" rowspan="1" ></td></tr><tr><th colspan="1" rowspan="2" ><p style="display: inline;">属性3</p></th><th colspan="1" rowspan="1" ><p style="display: inline;">属性3-1</p></th><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>概念2-1-属性3-1<br /></p></td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性3-2</p></th><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>概念2-1-属性3-2<br /></p></td></tr></tbody></table>
</details>

### 支持单元格内放置多个块

<details>
<summary>点击展开</summary>
<h4>转化前</h4>

- 概念 2

  - 属性 1：注意，即使多行也需要分隔符号

    第一行

    第二行

  - 属性 2：

    ###### 这是一个六级标题

    ```ts
    //这是一段代码块
    ```

    $$
    \frac{1}{math}
    $$

<h4>转化后</h4>
<table border = '1'><colgroup><col></col><col></col></colgroup><thead><tr><th colspan="1" rowspan="1" ><p style="display: inline;"></p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">概念2</p>
</th></tr></thead><tbody><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性1</p>
</th><td colspan="1" rowspan="1" ><p>注意，即使多行也需要分隔符号<br />
</p>
<p>第一行<br />
</p>
<p>第二行<br />
</p>
</td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性2</p>
</th><td colspan="1" rowspan="1" ><p></p>
<h6>这是一个六级标题</h6>
<pre><code class="language-ts">//这是一段代码块
</code></pre>
<div class="language-math" id="20230812204926-mjh0pnh">\frac{1}{math}</div>
</td></tr></tbody></table>
</details>

### 属性判断

<details>
<summary>点击展开</summary>
<h4>转化前</h4>

- 概念 1

  - 属性 3

    - 属性 3-1：因在概念 2 中，属性 3 与属性 1 同级，会被判断为属性
    - 属性 3-2：概念 1-属性 3-2

- 概念 2

  - 属性 1：概念 2-属性 1
  - 属性 3

    - 属性 3-2：概念 2-属性 3-2

<h4>转化后</h4>

<table border = '1'><colgroup><col></col><col></col><col></col><col></col></colgroup><thead><tr><th colspan="2" rowspan="1" ><p style="display: inline;"></p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">概念1</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">概念2</p>
</th></tr></thead><tbody><tr><th colspan="1" rowspan="2" ><p style="display: inline;">属性3</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">属性3-1</p>
</th><td colspan="1" rowspan="1" ><p>因在概念2中，属性3与属性1同级，会被判断为属性<br />
</p>
</td><td colspan="1" rowspan="1" ></td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性3-2</p>
</th><td colspan="1" rowspan="1" ><p>概念1-属性3-2<br />
</p>
</td><td colspan="1" rowspan="1" ><p>概念2-属性3-2<br />
</p>
</td></tr><tr><th colspan="2" rowspan="1" ><p style="display: inline;">属性1</p>
</th><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>概念2-属性1<br />
</p>
</td></tr></tbody></table>
</details>

### 带有分隔符的非属性节点

<details>
<summary>点击展开</summary>
<h4>转化前</h4>

- 概念 1

  - 概念 1-1：非属性节点分隔符后文本不会放入表格

    - 属性 1：概念 1-属性 1

  - 概念 1-2

    - 属性 1：概念 1-2-属性 1

 <h4>转化后</h4>

<table border = '1'><colgroup><col></col><col></col><col></col></colgroup><thead><tr><th colspan="1" rowspan="2" ><p style="display: inline;"></p>
</th><th colspan="2" rowspan="1" ><p style="display: inline;">概念1</p>
</th></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">概念1-1</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">概念1-2</p>
</th></tr></thead><tbody><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性1</p>
</th><td colspan="1" rowspan="1" ><p>概念1-属性1<br />
</p>
</td><td colspan="1" rowspan="1" ><p>概念1-2-属性1<br />
</p>
</td></tr></tbody></table>

</details>

### 属性名相同但父级不同

<details>
<summary>点击展开</summary>
<h4>转化前</h4>

- 概念 1

  - 属性 1：概念 1-属性 1
  - 属性 5

    - 属性 6-2：属性同名但路径不同，可处理（属性 5-属性 6-2）

  - 属性 6

    - 属性 5-1：属性同名但路径不同，可处理（属性 6-属性 5-1）

- 概念 2

  - 属性 5

    - 属性 5-1：概念 2-属性 5-1

  - 属性 6

    - 属性 6-1：概念 2-属性 6-1

<h4>转化后</h4>
<table border = '1'><colgroup><col></col><col></col><col></col><col></col></colgroup><thead><tr><th colspan="2" rowspan="1" ><p style="display: inline;"></p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">概念1</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">概念2</p>
</th></tr></thead><tbody><tr><th colspan="2" rowspan="1" ><p style="display: inline;">属性1</p>
</th><td colspan="1" rowspan="1" ><p>概念1-属性1<br />
</p>
</td><td colspan="1" rowspan="1" ></td></tr><tr><th colspan="1" rowspan="2" ><p style="display: inline;">属性5</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">属性6-2</p>
</th><td colspan="1" rowspan="1" ><p>属性同名但路径不同，可处理（属性5-属性6-2）<br />
</p>
</td><td colspan="1" rowspan="1" ></td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性5-1</p>
</th><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>概念2-属性5-1<br />
</p>
</td></tr><tr><th colspan="1" rowspan="2" ><p style="display: inline;">属性6</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">属性5-1</p>
</th><td colspan="1" rowspan="1" ><p>属性同名但路径不同，可处理（属性6-属性5-1）<br />
</p>
</td><td colspan="1" rowspan="1" ></td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性6-1</p>
</th><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>概念2-属性6-1<br />
</p>
</td></tr></tbody></table>
</details>

### 更改分隔符号设置及文本存在多个分隔符

下例中分隔符改为了`-`

<details>
<summary>点击展开</summary>
<h4>转化前</h4>

* 概念1

  * 属性1-概念1-属性1
* 概念2

  * 属性1-概念2-属性2

<h4>转化后</h4>

<table border = '1'><colgroup><col></col><col></col><col></col></colgroup><thead><tr><th colspan="1" rowspan="1" ><p style="display: inline;"></p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">概念1</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">概念2</p>
</th></tr></thead><tbody><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性1</p>
</th><td colspan="1" rowspan="1" ><p>概念1-属性1<br />
</p>
</td><td colspan="1" rowspan="1" ><p>概念2-属性2<br />
</p>
</td></tr></tbody></table>
</details>

### 更改属性名/概念名最大长度限制

以下示例将属性名最大长度设为10

<details>
<summary>点击展开</summary>
<h4>转化前</h4>

* 概念1

  * 这是一个很长的概念名，包含分隔符：分隔符以后内容

    * 属性1：概念1-1-属性1
  * 概念1-2

    * 属性1：概念1-2-属性1

<h4>转化后</h4>

<table border = '1'><colgroup><col></col><col></col><col></col></colgroup><thead><tr><th colspan="1" rowspan="2" ><p style="display: inline;"></p>
</th><th colspan="2" rowspan="1" ><p style="display: inline;">概念1</p>
</th></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">这是一个很长的概念名，包含分隔符：分隔符以后内容</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">概念1-2</p>
</th></tr></thead><tbody><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性1</p>
</th><td colspan="1" rowspan="1" ><p>概念1-1-属性1<br />
</p>
</td><td colspan="1" rowspan="1" ><p>概念1-2-属性1<br />
</p>
</td></tr></tbody></table>
</details>

### 无概念不会添加表头

<details>
<summary>点击展开</summary>
<h4>转化前</h4>

* 属性1：属性1内容
* 属性2：属性2内容

<h4>转化后</h4>

<table border = '1'><colgroup><col></col><col></col></colgroup><thead><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性1</p>
</th><td colspan="1" rowspan="1" ><p>属性1内容<br />
</p>
</td></tr></thead><tbody><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性2</p>
</th><td colspan="1" rowspan="1" ><p>属性2内容<br />
</p>
</td></tr></tbody></table>
</details>

---
或者可以直接利用这一特性显示`表格视图`
<details>
<summary>点击展开</summary>
<h4>转化前</h4>

* 占位符，无子节点会被视为属性
* 1级

  * 1-1级：1-1级内容
  * 1-2级：1-2级内容

    * 1-2-3级：1-2-3级内容

<h4>转化后</h4>
<table border = '1'><colgroup><col></col><col></col><col></col><col></col></colgroup><thead><tr><th colspan="3" rowspan="1" ><p style="display: inline;">占位符，无子节点会被视为属性</p>
</th><td colspan="1" rowspan="1" ></td></tr></thead><tbody><tr><th colspan="1" rowspan="2" ><p style="display: inline;">1级</p>
</th><th colspan="2" rowspan="1" ><p style="display: inline;">1-1级</p>
</th><td colspan="1" rowspan="1" ><p>1-1级内容<br />
</p>
</td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">1-2级</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">1-2-3级</p>
</th><td colspan="1" rowspan="1" ><p>1-2-3级内容<br />
</p>
</td></tr></tbody></table>
</details>

### 注意，会清除概念名属性名所在段落的样式，与之对应，其部分样式不会影响表格生成

<details>
<summary>点击展开</summary>
<h4>转化前</h4>

* 概念1

  * *属性*1：

    概**<u>念1-属性</u>**2

    第*二行*
  * 属<u>性2</u>：概念1-属性2
  * ^属性^3：概念1-属性3
* 概念2

  * 概念2-1

    * 属==性1==：概念2-1-~~属性1~~
    * 属`性2`：概念<kbd>2-1-属性</kbd>2
    * 属**性3**：概念2-属性3

<h4>转化后</h4>

<table border = '1'><colgroup><col></col><col></col><col></col></colgroup><thead><tr><th colspan="1" rowspan="2" ><p style="display: inline;"></p>
</th><th colspan="1" rowspan="2" ><p style="display: inline;">概念1</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">概念2</p>
</th></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">概念2-1</p>
</th></tr></thead><tbody><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性1</p>
</th><td colspan="1" rowspan="1" ><p>​<br />
</p>
<p>概<span data-type="strong u">念1-属性</span>2<br />
</p>
<p>第<span data-type="em">二行</span><br />
</p>
</td><td colspan="1" rowspan="1" ><p>概念2-1-属性1​<br />
</p>
</td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性2</p>
</th><td colspan="1" rowspan="1" ><p>概念1-属性2​<br />
</p>
</td><td colspan="1" rowspan="1" ></td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性3</p>
</th><td colspan="1" rowspan="1" ><p>概念1-属性3​<br />
</p>
</td><td colspan="1" rowspan="1" ><p>概念2-属性3​<br />
</p>
</td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性2</p>
</th><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>概念​2-1-属性​2​<br />
</p>
</td></tr></tbody></table>
</details>

### 标题块转换示例

<details>
<summary>点击展开</summary>
<h4>转化前</h4>

---

#### 一级节点2

##### 二级节点2-1

属性1：二级节点2-1属性1内容

属性2：二级节点2-2属性2内容

##### 二级节点2-2

属性1：二级节点2-2属性1内容

二级节点中的一段不相关内容

#### 一级节点1

属性1：一级节点1属性1内容

属性2：一级节点2属性2内容

一级节点中的一段不相关的内容

### 遇到上一层级停止扫描

一段内容

---

<h4>转化后</h4>

<table border = '1'><colgroup><col></col><col></col><col></col><col></col></colgroup><thead><tr><th colspan="1" rowspan="2" ><p style="display: inline;"></p>
</th><th colspan="2" rowspan="1" ><p style="display: inline;">一级节点2</p>
</th><th colspan="1" rowspan="2" ><p style="display: inline;">一级节点1</p>
</th></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">二级节点2-1</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">二级节点2-2</p>
</th></tr></thead><tbody><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性1</p>
</th><td colspan="1" rowspan="1" ><p>二级节点2-1属性1内容​<br />
</p>
</td><td colspan="1" rowspan="1" ><p>二级节点2-2属性1内容​<br />
</p>
</td><td colspan="1" rowspan="1" ><p>一级节点1属性1内容​<br />
</p>
</td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性2</p>
</th><td colspan="1" rowspan="1" ><p>二级节点2-2属性2内容​<br />
</p>
</td><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>一级节点2属性2内容​<br />
</p>
</td></tr></tbody></table>
</details>

## 感谢

- [使用 vite + svelte 的思源笔记插件示例
  ](https://github.com/siyuan-note/plugin-sample-vite-svelte)

## 开发相关

为统一项目方法和类型，思源 api 相关方法和类型均在[siyuanPlugin-common](https://github.com/etchnight/siyuanPlugin-common)项目中
