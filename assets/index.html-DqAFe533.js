import{_ as i,c as a,a as e,o as l}from"./app-BNTEi0NL.js";const n={};function t(h,s){return l(),a("div",null,s[0]||(s[0]=[e(`<h2 id="flex" tabindex="-1"><a class="header-anchor" href="#flex"><span>Flex</span></a></h2><p>CSS 中的 Flexbox 是一种强大的布局模式，用于设计响应式布局和对齐元素。它能够有效地控制元素在容器中的排列方式。下面是 Flexbox 的基本使用方法：</p><h3 id="基本概念" tabindex="-1"><a class="header-anchor" href="#基本概念"><span>基本概念</span></a></h3><p>• Flex 容器：包含 Flex 子项的父元素，设置 display: flex。 • Flex 子项：直接属于 Flex 容器的子元素。</p><h3 id="基本用法" tabindex="-1"><a class="header-anchor" href="#基本用法"><span>基本用法</span></a></h3><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">container</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  display</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> flex</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 将容器设置为 Flex 容器 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常用属性" tabindex="-1"><a class="header-anchor" href="#常用属性"><span>常用属性</span></a></h3><h4 id="容器属性" tabindex="-1"><a class="header-anchor" href="#容器属性"><span>容器属性</span></a></h4><ol><li>flex-direction：定义主轴的方向（子项排列方向）。</li></ol><ul><li>row（默认）：水平从左到右排列。</li><li>row-reverse：水平从右到左排列。</li><li>column：垂直从上到下排列。</li><li>column-reverse：垂直从下到上排列。</li></ul><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">container</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  flex-direction</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> row</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 子项水平排列 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>justify-content：沿着主轴对齐子项。</li></ol><ul><li>flex-start（默认）：子项靠主轴起点对齐。</li><li>flex-end：子项靠主轴终点对齐。</li><li>center：子项居中对齐。</li><li>space-between：子项在主轴方向上均匀分布，第一个子项与起点对齐，最后一个与终点对齐。</li><li>space-around：子项在主轴方向上均匀分布，但两端留有空白。</li></ul><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">container</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  justify-content</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> space-between</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 子项均匀分布 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>align-items：沿着交叉轴（垂直于主轴）对齐子项。</li></ol><ul><li>stretch（默认）：子项被拉伸以适应容器。</li><li>flex-start：子项靠交叉轴的起点对齐。</li><li>flex-end：子项靠交叉轴的终点对齐。</li><li>center：子项在交叉轴居中对齐。</li><li>baseline：子项的基线对齐。</li></ul><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">container</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  align-items</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> center</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 子项在交叉轴居中 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>flex-wrap：控制子项是否换行。</li></ol><ul><li>nowrap（默认）：不换行，子项被压缩到一行中。</li><li>wrap：子项换行，超出容器宽度的子项会移动到新行。</li><li>wrap-reverse：换行但行的顺序颠倒。</li></ul><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">container</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  flex-wrap</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> wrap</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 子项换行 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5"><li>align-content：定义多行的对齐方式，仅在 flex-wrap 为 wrap 或 wrap-reverse 时使用。</li></ol><ul><li>flex-start：各行靠起点对齐。</li><li>flex-end：各行靠终点对齐。</li><li>center：各行在交叉轴居中对齐。</li><li>space-between：各行在交叉轴方向上均匀分布。</li><li>space-around：各行在交叉轴方向上均匀分布，但两端留有空白。</li><li>stretch（默认）：各行被拉伸以填充容器。</li></ul><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">container</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  align-content</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> space-around</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 各行均匀分布 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="子项属性" tabindex="-1"><a class="header-anchor" href="#子项属性"><span>子项属性</span></a></h4><ul><li>order：定义子项的排列顺序，数值越小越靠前，默认值为 0。</li></ul><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">item</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  order</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#2F798A;--shiki-dark:#4C9A91;"> 1</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 设置子项顺序 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>flex-grow：定义子项如何增长以填充可用空间，默认为 0，即不增长。</li></ul><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">item</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  flex-grow</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#2F798A;--shiki-dark:#4C9A91;"> 1</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 子项将均匀增长 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>flex-shrink：定义子项如何缩小以适应容器，默认为 1，即允许缩小。</li></ul><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">item</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  flex-shrink</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#2F798A;--shiki-dark:#4C9A91;"> 0</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 子项不会缩小 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>flex-basis：定义子项的默认大小，即主轴上的初始尺寸。</li></ul><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">item</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  flex-basis</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#2F798A;--shiki-dark:#4C9A91;"> 200</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">px</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 子项的初始大小 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>align-self：允许单个子项在交叉轴上与其他子项不同的对齐方式，覆盖align-items的设置。</li></ul><div class="language-css line-numbers-mode" data-ext="css" data-title="css"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">item</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">    align-self</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">:</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> flex-end</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> /* 单个子项靠交叉轴的终点对齐 */</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,34)]))}const p=i(n,[["render",t],["__file","index.html.vue"]]),r=JSON.parse(`{"path":"/Front-End-Knowledge/v6zlrfv5/","title":"Flex布局","lang":"zh-CN","frontmatter":{"title":"Flex布局","author":"GaoJ","createTime":"2024/08/29 16:30:34","permalink":"/Front-End-Knowledge/v6zlrfv5/","head":[["script",{"id":"check-dark-mode"},";(function () {const um= localStorage.getItem('vuepress-theme-appearance') || 'auto';const sm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;if (um === 'dark' || (um !== 'light' && sm)) {document.documentElement.classList.add('dark');}})();"],["script",{"id":"check-mac-os"},"document.documentElement.classList.toggle('mac', /Mac|iPhone|iPod|iPad/i.test(navigator.platform))"]]},"headers":[{"level":2,"title":"Flex","slug":"flex","link":"#flex","children":[{"level":3,"title":"基本概念","slug":"基本概念","link":"#基本概念","children":[]},{"level":3,"title":"基本用法","slug":"基本用法","link":"#基本用法","children":[]},{"level":3,"title":"常用属性","slug":"常用属性","link":"#常用属性","children":[]}]}],"readingTime":{"minutes":2.63,"words":790},"git":{"updatedTime":1724921805000,"contributors":[{"name":"GaoJ","email":"gj37604@163.com","commits":1}]},"filePathRelative":"notes/Front-End-Knowledge/Css.md"}`);export{p as comp,r as data};
