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
                        <el-button type="success" @click="addDialogVisible = true">添加用户</el-button>
                        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close='addUserFormReset'>
                            <el-form 
                            label-width="100px" 
                            :model="addUserForm" 
                            :rules="addUserFormRul"
                            ref='addUsersFormRef'
                            class="demo-ruleForm">
                                <el-form-item label="用户名" prop='username'>
                                    <el-input v-model="addUserForm.username"></el-input>
                                </el-form-item>
                                <el-form-item label="密码" prop='password'>
                                    <el-input v-model="addUserForm.password"></el-input>
                                </el-form-item>
                                <el-form-item label="邮箱" prop='email'>
                                    <el-input v-model="addUserForm.email"></el-input>
                                </el-form-item>
                                <el-form-item label="手机号码" prop='mobile'>
                                    <el-input v-model="addUserForm.mobile"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="resetForm">重 置</el-button>
                                <el-button type="primary" @click="addUser">确 定</el-button>
                            </span>
                        </el-dialog>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="usersList" stripe border style="width: 100%">
                <el-table-column align="center" type="index" width="50" label="#">
                </el-table-column>
                <el-table-column align="center" prop="username" label="姓名">
                </el-table-column>
                <el-table-column align="center" prop="mobile" label="电话">
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
                    <template slot-scope='scope'>
                        <el-tooltip content="修改信息" :enterable="false" placement="top">
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">
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
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
                <el-form 
                label-width="100px" 
                :model="editForm" 
                :rules="editUserFormRul"
                ref='addUsersFormRef'
                class="demo-ruleForm">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop='email'>
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop='mobile'>
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUser">确 定</el-button>
                </span>
            </el-dialog>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryParams.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="totalNum" class="marginTop20">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            // 手机号验证规则
            var checkMobile = (rule, value, callback) => {
                const mobileRex = /^1(3|4|5|7|8)\d{9}$/;
                if (mobileRex.test(value)) {
                    return callback();
                }
                callback(new Error('请输入正确的手机号'));
            };
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
                addDialogVisible: false,
                editDialogVisible:false,
                labelPosition: 'right',
                addUserForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                addUserFormRul: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 5, max: 10, message: '用户名长度在 5 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 5, max: 16, message: '密码长度在 5 到 16 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                },
                editForm:{
                    id: 0,
                    username: '',
                    role_id: 0,
                    mobile: '',
                    email: ''
                },
                editUserFormRul: {
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                },
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
            addUser() {
                this.$refs.addUsersFormRef.validate(async valid => {
                    if (!valid){
                        return
                    }else{
                        const {data: res} = await this.$http.post('users',this.addUserForm)
                        console.log(res)
                        if(res.meta.status !== 201){
                            this.$message.error('用户创建失败')
                        } else{
                            this.$message.success('用户创建成功');
                            this.getUsersList();
                            this.addDialogVisible = false
                        }
                    }  
                });
            },
            addUserFormReset(){
                this.resetForm();
            },
            resetForm(){
                this.$refs.addUsersFormRef.resetFields();
            },
            async showEditDialog(id){
                const {data: res} = await this.$http.get('users/' + id)
                if(res.meta.status !== 200) return this.$message.error(res.meta.status + '查询用户信息失败！')
                this.editForm = res.data
                this.editDialogVisible = true
                console.log(res.data)
            },
            editUser(){
                // this.$http.put('users/' + id)
                this.editDialogVisible = false
            }
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