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

- v1.1.0  
  - 支持单元格内显示多个块。
  - 由处理 markdown 改为处理 dom，支持功能更多，但转化后效果不同。
- v1.2.0  增加`转置功能`与`复制html到剪贴板`功能
- v1.3.0 
    - 增加`在标签页(tab)中显示`功能，将把生成的表格转移入标签页
    - 自适应列宽
    - 生成的表格可调整列宽
    - 大多数方法改为静态方法
- v1.3.1 🚀(实验性) 对标题块增加转表格支持，会将所选标题块之后的**同级**及其子级转化为二维表格。
  - 标题下块除非带有分隔符号，其余块均会忽略。
  - 标题下列表块会按照列表转表格逻辑进行处理，并作为当前标题节点的子节点。

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

### 标题块与列表块混合内容


<details>
<summary>点击展开</summary>
<h4>转化前</h4>

---

#### 社团法人

* 成立基础：必须有社员，社员是其成立的基础
* 设立目的：可以为了营利，也可以为了公益。前者称为营利社团法人，后者称为公益社团法人。
* 设立程序：一般符合法定条件即可，大多不需要经过行政机关的批准，但需要登记。
* 设立人地位：在设立以后，其设立人将取得社员资格，如公司股东享有股东权，并能够行使自益权和共益权。

#### 财团法人

* 成立基础：以财产为基础，如基金会等。

  财团法人虽然也有管理人，但管理人员的变更不影响财团法人的存在。财团法人制度使一定财产集合，成为独立主体从而其管理具有永续性。
* 设立目的：只能为了公益。
* 设立程序：一般要经过主管机关的许可，且进行登记。
* 设立人地位：在设立以后，其设立人便与法人脱离关系，因为财团法人没有成员，其设立人不作为法人成员，也不直接参与或决定法人事务，而且其设立人也并不当然成为财团法人的管理人员。

---

<h4>转化后</h4>
<table border = '1'><colgroup><col></col><col></col><col></col></colgroup><thead><tr><th colspan="1" rowspan="1" ><p style="display: inline;"></p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">社团法人</p>
</th><th colspan="1" rowspan="1" ><p style="display: inline;">财团法人</p>
</th></tr></thead><tbody><tr><th colspan="1" rowspan="1" ><p style="display: inline;">成立基础</p>
</th><td colspan="1" rowspan="1" ><p>必须有社员，社员是其成立的基础​<br />
</p>
</td><td colspan="1" rowspan="1" ><p>以财产为基础，如基金会等。​<br />
</p>
<p>财团法人虽然也有管理人，但管理人员的变更不影响财团法人的存在。财团法人制度使一定财产集合，成为独立主体从而其管理具有永续性。<br />
</p>
</td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">设立目的</p>
</th><td colspan="1" rowspan="1" ><p>可以为了营利，也可以为了公益。前者称为营利社团法人，后者称为公益社团法人。​<br />
</p>
</td><td colspan="1" rowspan="1" ><p>只能为了公益。​<br />
</p>
</td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">设立程序</p>
</th><td colspan="1" rowspan="1" ><p>一般符合法定条件即可，大多不需要经过行政机关的批准，但需要登记。​<br />
</p>
</td><td colspan="1" rowspan="1" ><p>一般要经过主管机关的许可，且进行登记。​<br />
</p>
</td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">设立人地位</p>
</th><td colspan="1" rowspan="1" ><p>在设立以后，其设立人将取得社员资格，如公司股东享有股东权，并能够行使自益权和共益权。​<br />
</p>
</td><td colspan="1" rowspan="1" ><p>在设立以后，其设立人便与法人脱离关系，因为财团法人没有成员，其设立人不作为法人成员，也不直接参与或决定法人事务，而且其设立人也并不当然成为财团法人的管理人员。​<br />
</p>
</td></tr></tbody></table>
</details>

## 感谢

- [使用 vite + svelte 的思源笔记插件示例
  ](https://github.com/siyuan-note/plugin-sample-vite-svelte)

## 开发相关

为统一项目方法和类型，思源 api 相关方法和类型均在[siyuanPlugin-common](https://github.com/etchnight/siyuanPlugin-common)项目中

## 写在最后的一些废话

本人讨厌表格，原因有以下几点：
- 单元格不支持多个块，甚至一个单元格不是一个块，引用就必须引用整个表格，细粒度不够。
- Markdown对表格的支持太差，思源的表格粘贴到其他地方总是显示不正确，甚至很多大纲笔记根本不支持表格。
- 编辑不够丝滑，无法实现全键盘操作，总是要用到鼠标。

本人比较依赖表格，原因有以下几点：
- 方便对比，一目了然
- 是二维结构，很适合某些知识点的表示

本人讨厌也对比，什么叫做`A与B的区别`，那`A与C的区别`、`B与C的区别`、`A,B,C的区别`呢?对比的内容不就应该在A,B,C下面么？为什么还要再复制一遍？

但是不得不承认，很多时候对比是需要有的。如果能自动生成就好了。

于是有了这个插件，用大纲或文档去写，用表格去看，成为了我的常态。本来还有计划写一个表格转大纲的“姊妹”插件，但是现在我的笔记中很少出现表格了，缺少这方面的动力。
