import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
    base:'/blog',
    // 请不要忘记设置默认语言
    head: [['link', { rel: 'icon', href: '/images/favicon.png' }]],
    lang: 'zh-CN',
    theme: plumeTheme({
        // 个人信息
        profile:{
            name: 'GaoJ',
            description: '最是人间留不住，朱颜辞镜花辞树',
            avatar: '/images/avatar.jpg',
            circle: true
        },
        // 外链
        social: [
            {
                icon: 'github',
                link: 'https://github.com/GaoJ-coder'
            }
        ],
        // 导航拦
        navbar:[
            { text: '首页', link: '/', icon: 'material-symbols:home-outline' },
            {
                text: '读书笔记',
                icon: 'material-symbols:cognition-outline',
                items: [
                    {
                        text: '多线程',
                        icon: 'material-symbols:view-timeline-outline',
                        items: [
                            {
                                text: 'Java并发编程实战',
                                link: '/Java-Concurrency-in-Practice/',
                            }
                        ]
                    },
                    {
                        text:'前端知识',
                        icon:'material-symbols:javascript',
                        items: [
                            {
                                text: '前端知识积累',
                                link: '/Front-End-Knowledge/',
                            }
                        ]
                    }
                ]
            }
        ],
        // 读书笔记
        notes:{
            dir: '/notes',
            link: '/',
            notes: [
                {
                    dir: 'Java-Concurrency-in-Practice',
                    link: '/Java-Concurrency-in-Practice/',
                    // 侧边栏
                    sidebar:[
                        {
                            text: '基础知识',
                            items:['Thread-Safety','Object-Shared']
                        },
                        {
                            text:'第二章',
                            items:[]
                        }
                    ]
                },
                {
                    dir: 'Front-End-Knowledge',
                    link:'/Front-End-Knowledge/',
                    sidebar:[
                        {
                            text: 'CSS',
                            items: ['Css']
                        }
                    ]
                }
            ]
        }
    }),
    bundler: viteBundler(),
})