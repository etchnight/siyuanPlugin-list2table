# Convert a list to a 2D table

[English] (./README_en_US.md)

[Siyuan Notes] (https://b3log.org/siyuan/) plug-in, which converts the list into a two-dimensional table through certain rules. Different from the table view, this plugin will extract the 'concept' in the original list to form the upper header, extract the 'attribute' to form the left header, and fill the content corresponding to the 'concept' and 'attribute' into the corresponding cell. The results are displayed in a new table without changing the contents of the original note.

## Usage

When the plugin is enabled, a 'List to Table' menu item will be added to the menu of the list block (note that it is not a list item block), and clicking it will display the conversion result in a pop-up window.

The following options are available within the plugin settings:
- Separator between attribute name and attribute value: Separated symbol will be extracted as 'attribute name', separated symbol will be recognized as 'attribute value'
- The maximum length of the attribute name, 0 means unlimited, if the separator appears outside this length, it will not be divided

See the example for a more detailed conversion description.

❗❗ To copy the results elsewhere for use and ensure proper display, remove '<th class="fn__none">' and '<td class="fn__none">' from the converted table HTML code.

## Example

### Before conversion

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

### After conversion

<div data-node-id="20230809003400-b481hce" data-node-index="1" data-type="NodeTable" class="table"><div contenteditable="false"><table contenteditable="true" spellcheck="false"><colgroup><col><col><col><col><col><col><col><col><col></colgroup><thead><tr><th colspan="3" rowspan="2"></th></th></th><th colspan="2" rowspan="1">概念1</th></th><th colspan="1" rowspan="2">概念2</th><th colspan="1" rowspan="2">不规范的概念1</th><th colspan="1" rowspan="2">不规范的概念2（不同层级属性混在一级）</th><th>不规范的概念3（非叶子节点存在属性值）</th></tr><tr></th></th></th><th>概念1-1</th><th>概念1-2：非属性节点即使存在分隔符也不会被拆分</th></th></th></th><th>属性2：该属性不应该有属性值，会被判断为概念，且导致下层属性丢失父属性</th></tr></thead><tbody><tr><th colspan="1" rowspan="2">属性5</th><th colspan="2" rowspan="1">属性5-1</th></th><td>概念1-1-属性5-1</td><td></td><td></td><td></td><td></td><td></td></tr><tr></th><th colspan="2" rowspan="1">属性6-2</th></th><td></td><td></td><td></td><td>属性同名但路径不同，可处理（属性5-属性6-2）</td><td></td><td></td></tr><tr><th>属性2</th><th colspan="2" rowspan="1">属性2-1</th></th><td>概念1-1-属性2-1</td><td></td><td></td><td></td><td></td><td></td></tr><tr><th colspan="1" rowspan="3">属性3</th><th colspan="2" rowspan="1">属性3-1</th></th><td>因在概念1-2中，属性3与属性1同级，会被判断为属性</td><td>概念1-2-属性3-1</td><td colspan="1" rowspan="3">该属性应有下级但没有，会合并单元格</td><td></td><td></td><td></td></tr><tr></th><th colspan="2" rowspan="1">属性3-2</th></th><td>概念1-1-属性3-2</td><td></td><td></td><td></td><td></td><td></td></tr><tr></th><th colspan="2" rowspan="1">属性3-3</th></th><td></td><td>概念1-2-属性3-3</td><td></td><td></td><td></td><td></td></tr><tr><th colspan="1" rowspan="4">属性6</th><th colspan="2" rowspan="1">属性6-2</th></th><td>概念1-1-属性6-2</td><td></td><td></td><td></td><td></td><td></td></tr><tr></th><th colspan="1" rowspan="2">属性6-1</th><th>属性6-1-1</th><td>概念1-1-属性6-1-1</td><td></td><td></td><td></td><td></td><td></td></tr><tr></th></th><th>属性6-1-2</th><td></td><td></td><td>概念2-属性6-1-2</td><td></td><td></td><td></td></tr><tr></th><th colspan="2" rowspan="1">属性5-1</th></th><td></td><td></td><td></td><td>属性同名但路径不同，可处理（属性6-属性5-1）</td><td></td><td></td></tr><tr><th colspan="3" rowspan="1">属性1</th></th></th><td></td><td>概念1-2-属性1</td><td>概念2-属性1</td><td></td><td></td><td></td></tr><tr><th colspan="3" rowspan="1">属性4</th></th></th><td></td><td></td><td>概念2-属性4</td><td></td><td></td><td></td></tr><tr><th colspan="3" rowspan="1">属性2-1</th></th></th><td></td><td></td><td></td><td></td><td>与概念1-1的属性2-1不在同一层级，会被识别为不同属性</td><td>不规范的概念3-属性2-1</td></tr></tbody></table><div class="protyle-action__table"><div class="table__resize"></div><div class="table__select"></div></div></div><div class="protyle-attr" contenteditable="false">​</div></div>

## Thanks

- [Example of a Siyuan Note plugin using vite + svelte.](https://github.com/siyuan-note/plugin-sample-vite-svelte)

## Development related

❗❗❗ In order to unify project methods and types, the methods and types related to the Siyuan API are in the [siyuanPlugin-common](https://github.com/etchnight/siyuanPlugin-common) project