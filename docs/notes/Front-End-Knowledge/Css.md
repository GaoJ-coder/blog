---
title: Flex布局
author: GaoJ
createTime: 2024/08/29 16:30:34
permalink: /Front-End-Knowledge/v6zlrfv5/
---


## Flex
CSS 中的 Flexbox 是一种强大的布局模式，用于设计响应式布局和对齐元素。它能够有效地控制元素在容器中的排列方式。下面是 Flexbox 的基本使用方法： 
### 基本概念
   •    Flex 容器：包含 Flex 子项的父元素，设置 display: flex。
   •    Flex 子项：直接属于 Flex 容器的子元素。 
### 基本用法
```css
.container {
  display: flex; /* 将容器设置为 Flex 容器 */
}
```

### 常用属性

#### 容器属性
1. flex-direction：定义主轴的方向（子项排列方向）。
- row（默认）：水平从左到右排列。
- row-reverse：水平从右到左排列。
- column：垂直从上到下排列。
- column-reverse：垂直从下到上排列。

```css
.container {
  flex-direction: row; /* 子项水平排列 */
}
```

2. justify-content：沿着主轴对齐子项。
- flex-start（默认）：子项靠主轴起点对齐。
- flex-end：子项靠主轴终点对齐。
- center：子项居中对齐。
- space-between：子项在主轴方向上均匀分布，第一个子项与起点对齐，最后一个与终点对齐。
- space-around：子项在主轴方向上均匀分布，但两端留有空白。
```css
.container {
  justify-content: space-between; /* 子项均匀分布 */
}
```

3.	align-items：沿着交叉轴（垂直于主轴）对齐子项。
- stretch（默认）：子项被拉伸以适应容器。
- flex-start：子项靠交叉轴的起点对齐。
- flex-end：子项靠交叉轴的终点对齐。
- center：子项在交叉轴居中对齐。
- baseline：子项的基线对齐。

```css
.container {
  align-items: center; /* 子项在交叉轴居中 */
}
```

4.	flex-wrap：控制子项是否换行。
- nowrap（默认）：不换行，子项被压缩到一行中。
- wrap：子项换行，超出容器宽度的子项会移动到新行。
- wrap-reverse：换行但行的顺序颠倒。
```css
.container {
  flex-wrap: wrap; /* 子项换行 */
}
```

5.	align-content：定义多行的对齐方式，仅在 flex-wrap 为 wrap 或 wrap-reverse 时使用。
- flex-start：各行靠起点对齐。
- flex-end：各行靠终点对齐。
- center：各行在交叉轴居中对齐。
- space-between：各行在交叉轴方向上均匀分布。
- space-around：各行在交叉轴方向上均匀分布，但两端留有空白。
- stretch（默认）：各行被拉伸以填充容器。
```css
.container {
  align-content: space-around; /* 各行均匀分布 */
}
```

#### 子项属性
- order：定义子项的排列顺序，数值越小越靠前，默认值为 0。
```css
.item {
  order: 1; /* 设置子项顺序 */
}
```
- flex-grow：定义子项如何增长以填充可用空间，默认为 0，即不增长。
```css
.item {
  flex-grow: 1; /* 子项将均匀增长 */
}
```
- flex-shrink：定义子项如何缩小以适应容器，默认为 1，即允许缩小。
```css
.item {
  flex-shrink: 0; /* 子项不会缩小 */
}
```
- flex-basis：定义子项的默认大小，即主轴上的初始尺寸。
```css
.item {
  flex-basis: 200px; /* 子项的初始大小 */
}
```
- align-self：允许单个子项在交叉轴上与其他子项不同的对齐方式，覆盖align-items的设置。
```css
.item {
    align-self: flex-end; /* 单个子项靠交叉轴的终点对齐 */
}
```