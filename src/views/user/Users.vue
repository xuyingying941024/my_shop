<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="marginBtn20">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div class="marginBtn20">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-input placeholder="请输入内容" v-model='queryParams.query' clearable @clear='getUsersList'>
                            <el-button slot="append" icon="el-icon-search" @click='getUsersList'></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="success">添加用户</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="usersList" stripe border style="width: 100%">
                <el-table-column align="center" type="index" width="50" label="#">
                </el-table-column>
                <el-table-column align="center" prop="username" label="姓名">
                </el-table-column>
                <el-table-column align="center" prop="create_time" label="电话">
                </el-table-column>
                <el-table-column align="center" prop="email" label="邮箱">
                </el-table-column>
                <el-table-column align="center" prop="role_name" label="角色">
                </el-table-column>
                <el-table-column align="center" prop="mg_state" label="状态">
                    <template slot-scope='scope'>
                        <el-switch v-model="scope.row.mg_state" @change='userStateChanged(scope.row)'>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="180">
                    <template>
                        <el-tooltip content="修改信息" :enterable="false" placement="top">
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog">
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="删除用户" :enterable="false" placement="top">
                            <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                        </el-tooltip>
                        <el-tooltip content="分配角色" :enterable="false" placement="top">
                            <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryParams.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="totalNum" class="marginTop20">
            </el-pagination>
            <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%">
                <el-form :label-position="labelPosition" label-width="80px" :model="ruleForm" :rules="usersListRules">
                    <el-form-item label="用户名">
                        <el-input v-model="usersList.username"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop='email'>
                        <el-input v-model="ruleForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop='create_time'>
                        <el-input v-model="ruleForm.create_time"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                // 请求参数对象
                queryParams: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5
                },
                // 用户数据列表
                usersList: [],
                totalNum: 0,
                editDialogVisible: false,
                labelPosition: 'right',
                ruleForm:{
                    email:'',
                    create_time:''
                },
                usersListRules: {
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    create_time: [
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        created() {
            this.getUsersList();
        },
        methods: {
            // 获取用户列表
            async getUsersList() {
                const { data: res } = await this.$http.get('/users', { params: this.queryParams })
                if (res.meta.status !== 200) {
                    this.$messages.error('请求失败')
                } else {
                    this.usersList = res.data.users
                    this.totalNum = res.data.total
                }
            },
            handleSizeChange(val) {
                this.queryParams.pagesize = val
                this.getUsersList();
            },
            handleCurrentChange(val) {
                this.queryParams.pagenum = val
                this.getUsersList();
            },
            async userStateChanged(usersInfo) {
                const { data: res } = await this.$http.put(`users/${usersInfo.id}/state/${usersInfo.mg_state}`)
                if (res.meta.status !== 200) {
                    usersInfo.mg_state = !usersInfo.mg_state
                    return this.$message.error('更新用户状态失败')
                } else {
                    this.$message.success('更新用户状态成功')
                }
            },
            showEditDialog() {
                this.editDialogVisible = true
            },
        }
    }
</script>
<style lang='less' scoped>
    .marginBtn20 {
        padding-bottom: 20px;
    }

    .marginTop20 {
        padding-top: 20px;
    }

    .el-card {
        box-shadow: 0 1px 1px rgba(0, 0, 0, .15) !important;
    }
</style>