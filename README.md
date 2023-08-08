# 将列表转化为二维表格

[English](./README.md)

## 使用方法

❗❗若要将转化后html复制至其他地方，`<th class="fn__none">`及`<td class="fn__none">`全部删除。

## 示例

### 转化前

- 概念 1

  - 概念 1-1

    - 属性 5

      - 属性 5-1：概念 1-1-属性 5-1

    - 属性 2

      - 属性 2-1：概念 1-1-属性 2-1

    - 属性 3

      - 属性 3-1：因在概念 1-2 中，属性 3 与属性 1 同级，会被判断为属性
      - 属性 3-2：概念 1-1-属性 3-2

    - 属性 6

      - 属性 6-2：概念 1-1-属性 6-2
      - 属性 6-1

        - 属性 6-1-1：概念 1-1-属性 6-1-1

  - 概念 1-2：非属性节点即使存在分隔符也不会被拆分

    - 属性 1：概念 1-2-属性 1
    - 属性 3

      - 属性 3-1：概念 1-2-属性 3-1
      - 属性 3-3：概念 1-2-属性 3-3

- 概念 2

  - 属性 1：概念 2-属性 1
  - 属性 3：该属性应有下级但没有，会合并单元格
  - 属性 4：概念 2-属性 4
  - 属性 6

    - 属性 6-1

      - 属性 6-1-2：概念 2-属性 6-1-2

- 不规范的概念 1

  - 属性 5

    - 属性 6-2：属性同名但路径不同，可处理

  - 属性 6

    - 属性 5-1：属性同名但路径不同，可处理

- 不规范的概念 2（不同层级属性混在一级）

  - 属性 2-1：与((20230417003249-5ahw5qp "概念 1-1 的属性 2-1"))不在同一层级，会被识别为不同属性

- 不规范的概念 3（非叶子节点存在属性值）

  - 属性 2：该属性不应该有属性值，属性值会丢失

    - 属性 2-1：不规范的概念 3-属性 2-1

### 转化后

<div data-node-id="20230808230146-tlbfnyq" data-node-index="1" data-type="NodeTable" class="table"><div contenteditable="false"><table contenteditable="true" spellcheck="false"><colgroup><col><col><col><col><col><col><col><col><col></colgroup><thead><tr><th colspan="3" rowspan="2"></th></th></th><th {:="" colspan="2" rowspan="1" }="">概念1</th></th><th {:="" colspan="1" rowspan="2" }="">概念2</th><th {:="" colspan="1" rowspan="2" }="">不规范的概念1</th><th {:="" colspan="1" rowspan="2" }="">不规范的概念2（不同层级属性混在一级）</th><th>不规范的概念3（非叶子节点存在属性值）</th></tr><tr></td></td></td><td>概念1-1</td><td>概念1-2：非属性节点即使存在分隔符也不会被拆分</td></td></td></td><td>属性2：该属性不应该有属性值，属性值会丢失</td></tr></thead><tbody><tr><td {:="" colspan="1" rowspan="2" }="">属性5</td><td {:="" colspan="2" rowspan="1" }="">属性5-1</td></td><td>概念1-1-属性5-1</td><td></td><td></td><td></td><td></td><td></td></tr><tr></td><td {:="" colspan="2" rowspan="1" }="">属性6-2</td></td><td></td><td></td><td></td><td>属性同名但路径不同，可处理</td><td></td><td></td></tr><tr><td>属性2</td><td {:="" colspan="2" rowspan="1" }="">属性2-1</td></td><td>概念1-1-属性2-1</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td {:="" colspan="1" rowspan="3" }="">属性3</td><td {:="" colspan="2" rowspan="1" }="">属性3-1</td></td><td>因在概念1-2中，属性3与属性1同级，会被判断为属性</td><td>概念1-2-属性3-1</td><td {:="" colspan="1" rowspan="3" }="">该属性应有下级但没有，会合并单元格</td><td></td><td></td><td></td></tr><tr></td><td {:="" colspan="2" rowspan="1" }="">属性3-2</td></td><td>概念1-1-属性3-2</td><td></td><td></td><td></td><td></td><td></td></tr><tr></td><td {:="" colspan="2" rowspan="1" }="">属性3-3</td></td><td></td><td>概念1-2-属性3-3</td><td></td><td></td><td></td><td></td></tr><tr><td {:="" colspan="1" rowspan="4" }="">属性6</td><td {:="" colspan="2" rowspan="1" }="">属性6-2</td></td><td>概念1-1-属性6-2</td><td></td><td></td><td></td><td></td><td></td></tr><tr></td><td {:="" colspan="1" rowspan="2" }="">属性6-1</td><td>属性6-1-1</td><td>概念1-1-属性6-1-1</td><td></td><td></td><td></td><td></td><td></td></tr><tr></td></td><td>属性6-1-2</td><td></td><td></td><td>概念2-属性6-1-2</td><td></td><td></td><td></td></tr><tr></td><td {:="" colspan="2" rowspan="1" }="">属性5-1</td></td><td></td><td></td><td></td><td>属性同名但路径不同，可处理</td><td></td><td></td></tr><tr><td {:="" colspan="3" rowspan="1" }="">属性1</td></td></td><td></td><td>概念1-2-属性1</td><td>概念2-属性1</td><td></td><td></td><td></td></tr><tr><td {:="" colspan="3" rowspan="1" }="">属性4</td></td></td><td></td><td></td><td>概念2-属性4</td><td></td><td></td><td></td></tr><tr><td {:="" colspan="3" rowspan="1" }="">属性2-1</td></td></td><td></td><td></td><td></td><td></td><td>与((20230417003249-5ahw5qp "概念1-1的属性2-1"))不在同一层级，会被识别为不同属性</td><td>不规范的概念3-属性2-1</td></tr></tbody></table><div class="protyle-action__table"><div class="table__resize" data-col-index="0" style="height:572px;left: 61px;display:block"></div><div class="table__select"></div></div></div><div class="protyle-attr" contenteditable="false">​</div></div>

