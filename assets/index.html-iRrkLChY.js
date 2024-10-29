import{_ as i,c as a,a as e,o as n}from"./app-BNTEi0NL.js";const l={};function t(h,s){return n(),a("div",null,s[0]||(s[0]=[e(`<h2 id="_1-安装-node-js-和-npm" tabindex="-1"><a class="header-anchor" href="#_1-安装-node-js-和-npm"><span>1. 安装 Node.js 和 npm</span></a></h2><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">node</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -v</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # 查看 Node.js 版本</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -v</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   # 查看 npm 版本</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-运行-javascript-文件" tabindex="-1"><a class="header-anchor" href="#_2-运行-javascript-文件"><span>2. 运行 JavaScript 文件</span></a></h2><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">node</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> app.js</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="_3-npm-初始化项目" tabindex="-1"><a class="header-anchor" href="#_3-npm-初始化项目"><span>3. npm 初始化项目</span></a></h2><p>使用 npm init 命令可以初始化一个新的 Node.js 项目，这将创建一个 package.json 文件，用于管理项目的元数据和依赖。</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> init</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # 逐步提示输入项目信息</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> init</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -y</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # 使用默认配置快速初始化项目</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-安装依赖包" tabindex="-1"><a class="header-anchor" href="#_4-安装依赖包"><span>4. 安装依赖包</span></a></h2><p>使用 npm install 命令可以安装项目所需的依赖包。你可以指定包名来安装特定的包。</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> package-name</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # 安装某个依赖包并添加到 dependencies</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --save-dev</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> package-name</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # 安装开发依赖并添加到 devDependencies</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # 安装 package.json 文件中列出的所有依赖包</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-卸载依赖包" tabindex="-1"><a class="header-anchor" href="#_5-卸载依赖包"><span>5. 卸载依赖包</span></a></h2><p>如果需要移除某个已安装的包，可以使用 npm uninstall 命令。</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> uninstall</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> package-name</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  #  卸载某个依赖包</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> uninstall</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --save-dev</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> package-name</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # 卸载开发依赖包</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-更新依赖包" tabindex="-1"><a class="header-anchor" href="#_6-更新依赖包"><span>6. 更新依赖包</span></a></h2><p>更新依赖包</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> update</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # 更新项目中所有依赖包</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> update</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> package-name</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # 更新特定依赖包</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-查看全局安装的包" tabindex="-1"><a class="header-anchor" href="#_7-查看全局安装的包"><span>7. 查看全局安装的包</span></a></h2><p>npm list -g 可以查看全局安装的所有包。</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> list</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -g</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --depth=0</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # 只显示全局安装包的列表</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="_8-全局安装或卸载包" tabindex="-1"><a class="header-anchor" href="#_8-全局安装或卸载包"><span>8. 全局安装或卸载包</span></a></h2><p>有时你可能需要在系统范围内安装或卸载某些工具包，如 nodemon 或 http-server。</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -g</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> package-name</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # Install a package globally</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> uninstall</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -g</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> package-name</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # Uninstall a package globally</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="查看npm镜像" tabindex="-1"><a class="header-anchor" href="#查看npm镜像"><span>查看npm镜像</span></a></h2><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 查看当前 npm 镜像源</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> config</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> get</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> registry</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">#切换 npm 镜像源</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">#淘宝镜像：https://registry.npmmirror.com/（适合国内用户，速度更快）</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> config</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> set</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> registry</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> https://registry.npmmirror.com/</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">#查看所有 npm 配置</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">npm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> config</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> list</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,24)]))}const d=i(l,[["render",t],["__file","index.html.vue"]]),r=JSON.parse(`{"path":"/Base-Command/e4p9obpq/","title":"Node基本命令","lang":"zh-CN","frontmatter":{"title":"Node基本命令","author":"GaoJ","createTime":"2024/08/30 10:22:34","permalink":"/Base-Command/e4p9obpq/","head":[["script",{"id":"check-dark-mode"},";(function () {const um= localStorage.getItem('vuepress-theme-appearance') || 'auto';const sm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;if (um === 'dark' || (um !== 'light' && sm)) {document.documentElement.classList.add('dark');}})();"],["script",{"id":"check-mac-os"},"document.documentElement.classList.toggle('mac', /Mac|iPhone|iPod|iPad/i.test(navigator.platform))"]]},"headers":[{"level":2,"title":"1. 安装 Node.js 和 npm","slug":"_1-安装-node-js-和-npm","link":"#_1-安装-node-js-和-npm","children":[]},{"level":2,"title":"2. 运行 JavaScript 文件","slug":"_2-运行-javascript-文件","link":"#_2-运行-javascript-文件","children":[]},{"level":2,"title":"3. npm 初始化项目","slug":"_3-npm-初始化项目","link":"#_3-npm-初始化项目","children":[]},{"level":2,"title":"4. 安装依赖包","slug":"_4-安装依赖包","link":"#_4-安装依赖包","children":[]},{"level":2,"title":"5. 卸载依赖包","slug":"_5-卸载依赖包","link":"#_5-卸载依赖包","children":[]},{"level":2,"title":"6. 更新依赖包","slug":"_6-更新依赖包","link":"#_6-更新依赖包","children":[]},{"level":2,"title":"7. 查看全局安装的包","slug":"_7-查看全局安装的包","link":"#_7-查看全局安装的包","children":[]},{"level":2,"title":"8. 全局安装或卸载包","slug":"_8-全局安装或卸载包","link":"#_8-全局安装或卸载包","children":[]},{"level":2,"title":"查看npm镜像","slug":"查看npm镜像","link":"#查看npm镜像","children":[]}],"readingTime":{"minutes":1.5,"words":450},"git":{"updatedTime":1724985793000,"contributors":[{"name":"GaoJ","email":"gj37604@163.com","commits":1}]},"filePathRelative":"notes/Base-Command/Node基本命令.md"}`);export{d as comp,r as data};