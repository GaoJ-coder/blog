import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
    // 请不要忘记设置默认语言
    head: [['link', { rel: 'icon', href: '/images/favicon.png' }]],
    lang: 'zh-CN',
    theme: plumeTheme({
        profile:{
            name: 'GaoJ',
            description: '最是人间留不住，朱颜辞镜花辞树',
            avatar: '/images/avatar.jpg',
            circle: true
        },
        social: [
            {
                icon: 'github',
                link: 'https://github.com/GaoJ-coder'
            }
        ]
    }),
    bundler: viteBundler(),
})