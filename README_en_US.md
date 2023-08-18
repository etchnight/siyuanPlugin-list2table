# Convert a list to a 2D table

[中文](./README.md)

[Siyuan Notes](https://b3log.org/siyuan/) plug-in, which converts the list into a two-dimensional table through certain rules. Different from the table view, this plugin will extract the 'concept' in the original list to form the upper header, extract the 'attribute' to form the left header, and fill the content corresponding to the 'concept' and 'attribute' into the corresponding cell. The results are displayed in a new table without changing the contents of the original note.

## Usage

When the plugin is enabled, a 'List to Table' menu item will be added to the menu of the list block (note that it is not a list item block), and clicking it will display the conversion result in a pop-up window.

The following options are available within the plugin settings:
- Separator between attribute name and attribute value: Separated symbol will be extracted as 'attribute name', separated symbol will be recognized as 'attribute value'
- The maximum length of the attribute name, 0 means unlimited, if the separator appears outside this length, it will not be divided

See the example for a more detailed conversion description.

❗ After version 1.1, the processing of Markdown was changed to the processing DOM, which supported more functions, but the effect after conversion was different.

## Example

❗ To display correctly in markdown, the table in the following example is converted from the HTML generated in the note, and the final display is slightly different

### Basic example

<details>
<summary>Click to expand</summary>
<h4>List</h4>

- 概念 1

  - 属性 1：属性名与属性值之间应有分隔符号（可在设置中自定义）
  - 属性 2：概念 1-属性 2

- 概念 2

  - 概念 2-1

    - 属性 1：概念、属性均可多级
    - 属性 3

      - 属性 3-1：概念 2-1-属性 3-1
      - 属性 3-2：概念 2-1-属性 3-2

<h4>Table</h4>
<table border = '1'><colgroup><col></col><col></col><col></col><col></col></colgroup><thead><tr><th colspan="2" rowspan="2" ></th><th colspan="1" rowspan="2" ><p style="display: inline;">概念1</p></th><th colspan="1" rowspan="1" ><p style="display: inline;">概念2</p></th></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">概念2-1</p></th></tr></thead><tbody><tr><th colspan="2" rowspan="1" ><p style="display: inline;">属性1</p></th><td colspan="1" rowspan="1" ><p>属性名与属性值之间应有分隔符号（可在设置中自定义）<br /></p></td><td colspan="1" rowspan="1" ><p>概念、属性均可多级<br /></p></td></tr><tr><th colspan="2" rowspan="1" ><p style="display: inline;">属性2</p></th><td colspan="1" rowspan="1" ><p>概念1-属性2<br /></p></td><td colspan="1" rowspan="1" ></td></tr><tr><th colspan="1" rowspan="2" ><p style="display: inline;">属性3</p></th><th colspan="1" rowspan="1" ><p style="display: inline;">属性3-1</p></th><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>概念2-1-属性3-1<br /></p></td></tr><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性3-2</p></th><td colspan="1" rowspan="1" ></td><td colspan="1" rowspan="1" ><p>概念2-1-属性3-2<br /></p></td></tr></tbody></table>
</details>

### Support for placing multiple blocks within a cell

<details>
<summary>Click to expand</summary>
<h4>List</h4>

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

<h4>Table</h4>
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

### Property judgment

<details>
<summary>Click to expand</summary>
<h4>List</h4>

- 概念 1

  - 属性 3

    - 属性 3-1：因在概念 2 中，属性 3 与属性 1 同级，会被判断为属性
    - 属性 3-2：概念 1-属性 3-2

- 概念 2

  - 属性 1：概念 2-属性 1
  - 属性 3

    - 属性 3-2：概念 2-属性 3-2

<h4>Table</h4>

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
<summary>Click to expand</summary>
<h4>List</h4>

- 概念 1

  - 概念 1-1：非属性节点分隔符后文本不会放入表格

    - 属性 1：概念 1-属性 1

  - 概念 1-2

    - 属性 1：概念 1-2-属性 1

 <h4>Table</h4>

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

### The property names are the same but the parents are different

<details>
<summary>Click to expand</summary>
<h4>List</h4>

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

<h4>Table</h4>
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

### Change the separator setting and the presence of multiple separators in the text

In the following example, the separator is changed to `-`

<details>
<summary>Click to expand</summary>
<h4>List</h4>

* 概念1

  * 属性1-概念1-属性1
* 概念2

  * 属性1-概念2-属性2

<h4>Table</h4>

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

### Change the maximum length limit for property names/concept names

The following example sets the maximum length of a property name to 10

<details>
<summary>Click to expand</summary>
<h4>List</h4>

* 概念1

  * 这是一个很长的概念名，包含分隔符：分隔符以后内容

    * 属性1：概念1-1-属性1
  * 概念1-2

    * 属性1：概念1-2-属性1

<h4>Table</h4>

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

### No concept does not add a header

<details>
<summary>Click to expand</summary>
<h4>List</h4>

* 属性1：属性1内容
* 属性2：属性2内容

<h4>Table</h4>

<table border = '1'><colgroup><col></col><col></col></colgroup><thead><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性1</p>
</th><td colspan="1" rowspan="1" ><p>属性1内容<br />
</p>
</td></tr></thead><tbody><tr><th colspan="1" rowspan="1" ><p style="display: inline;">属性2</p>
</th><td colspan="1" rowspan="1" ><p>属性2内容<br />
</p>
</td></tr></tbody></table>
</details>

---
Or you can use this feature directly to display as 'table view'

<details>
<summary>Click to expand</summary>
<h4>List</h4>

* 占位符，无子节点会被视为属性
* 1级

  * 1-1级：1-1级内容
  * 1-2级：1-2级内容

    * 1-2-3级：1-2-3级内容

<h4>Table</h4>
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

### Note that the style of the paragraph in which the conceptual name attribute name is located is cleared, and correspondingly, some of its styles do not affect table generation

<details>
<summary>Click to expand</summary>
<h4>List</h4>

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

<h4>Table</h4>

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

## Known issues and plans

### Other

- [x] Transpose
- [x] Copy HTML to clipboard

## Thanks

- [Example of a Siyuan Note plugin using vite + svelte.](https://github.com/siyuan-note/plugin-sample-vite-svelte)

## Development related

❗❗❗ In order to unify project methods and types, the methods and types related to the Siyuan API are in the [siyuanPlugin-common](https://github.com/etchnight/siyuanPlugin-common) project