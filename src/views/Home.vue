<template>
        <el-container>
                <el-header class="disf disf_sb chuizhi">
                        <div class="disf chuizhi">
                                <img src="../assets/heima.png" alt="">
                                <span class="title">电商后台管理系统</span>
                        </div>
                        <el-button type="info" @click="logout">退出</el-button>
                </el-header>
                <el-container>
                        <el-aside :width="isCollapse ? '64px' : '200px'">
                                <div class="toggle-button" @click="toggleCollapse">| | |</div>
                                <el-menu router unique-opened :collapse="isCollapse" :collapse-transition='false' :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
                                        <el-submenu v-for="(item,index) in menuList" :key="item.id" :index="item.path + ''">
                                                <template slot="title">
                                                        <i :class="iconObj[index]"></i>
                                                        <span>{{item.authName}}</span>
                                                </template>
                                                <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index = "'/' + subItem.path" @click="saveNavState('/' + subItem.path)">
                                                        <template slot="title">
                                                                <i class="el-icon-menu"></i>
                                                                <span>{{subItem.authName}}</span>
                                                        </template>
                                                </el-menu-item>
                                        </el-submenu>
                                </el-menu>
                        </el-aside>
                        <el-main>
                                <router-view></router-view>
                        </el-main>
                </el-container>
        </el-container>
</template>

<script>
        export default {
                data() {
                        return {
                                menuList:[],
                                iconObj:{
                                        '0':'iconfont icon-users',
                                        '1':'iconfont icon-lock_fill',
                                        '2':'iconfont icon-shangpin',
                                        '3':'iconfont icon-danju',
                                        '4':'iconfont icon-baobiao'
                                },
                                isCollapse:false,
                                activePath:''
                        }
                },
                created() {
                        this.gitMeniList();
                        this.activePath = window.sessionStorage.getItem('activePath');
                },
                methods: {
                        async gitMeniList() {
                               const {data: res} = await this.$http.get('/menus');
                               if(res.meta.status !== 200) return this.$messages.error('请求错误');
                                this.menuList = res.data
                        },
                        logout() {
                                window.sessionStorage.clear()
                                this.$router.push('/login')
                        },
                        toggleCollapse() {
                                this.isCollapse = !this.isCollapse
                        },
                        saveNavState(activePath){
                                window.sessionStorage.setItem('activePath',activePath)
                                this.activePath = activePath
                        }
                }
        }
</script>

<style lang="less" scoped>
        .is-vertical {
                height: 100%;
        }

        .el-header {
                background-color: #363d3f;
        }

        .el-aside {
                background-color: #333744;
        }

        .el-main {
                background-color: #e9edf0;
        }

        .title {
                font-size: 20px;
                color: #ffffff;
                margin-left: 15px;
        }
        .iconfont {
                margin-right: 10px;
        }
        .el-menu{
                border-right: none
        }
        .toggle-button{
                background-color: #4a5064;
                font-size: 10px;
                color: #ffffff;
                text-align: center;
                padding: 5px 0;
                cursor: pointer;
        }
</style>