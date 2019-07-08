var type="注册新用户！！！";
var $queryURL="/getAllDriver?t="+Math.random();
var $columns=[
    {checkbox:true,visible:true},
    {field:"id",visible: false},
    {field:"name",title:"姓名",sortable:true,formatter: function (value,row,index) {
            //采用拼接字符串的方式传参不能传递对象，只能转成字符串。
            return "<a href='javascript:alertModelByDetails("+JSON.stringify(row)+")'><font color='red'>"+value+"</font></a>"
        }},
    {field:"nationality",title:"国籍"},
    {field:"phone_number",title:"号码"},
    {field:"marital_status",title:"婚姻状态"},
    {field:"person_id",title:"身份证号"},
    {field:"company",title:"所属公司"},
    {field:"sex",title:"性别",sortable:true},
    {field:"foreign_language_ability",title:"外语能力"},
    //前端日期需更改格式
    {field:"birthday",title:"生日"},
    {field:"education",title:"教育程度"},
    {field:"photo",title:"图片"},
]
//用于设置表格插件属性，以及fileinput属性
$(function () {
    $("#table1").bootstrapTable("destroy");
    $("#table1").bootstrapTable(
        {
            url:$queryURL,
            method:"GET",
            striped:true,
            cache:false,
            pagination:true,//是否分页
            sortable:true,
            sortOrder:"asc",
            sidePagination:"client",
            pageNumber:1,
            pageSize:10,
            pageList:[10,20,50,100],

            search:true,
            strictSearch:false,
            showCloumns:true,
            showRefresh:true,
            clickToSelect:false,

            unniqueId:"id",
            showToggle:true,
            columns:$columns,

            toolbar:"#toolbar",
           /* onClickCell:function (field,value,row,$element) {
                if(field=="name"){
                    console.debug(row);
                    alertModelByDetails(row);
                }
            }*/
           getSelection:function (row) {
               return row;
           }

        }
    );
    $("#photo").fileinput({
        language:"zh",
        uploadUrl: "/driverImg",//上传路径
        addlwedFileExtensions:["jpg","png","gif"],
        showCaption:false,//是否显示标题
        showUpload:false,//显示上传按钮
        showRemove:false,
        showClose:false,
        borderTopWidth:{
            actionDelete:"",
        },
        browseClass:"btn btn-primary",//按钮样式
    })
})
//回调函数，用于检验数据的正确性
var checkStatus = true;
$(function () {
    $("#driverInfoForm input").change(function () {
        checkStatus = true;
        if("name" == this.name && !(/^[\xa0-\xff]{2,4}$/.test(this.value))){
            $("#messageBody")[0].innerText="请输入正确的姓名！"
            checkStatus = false;
        }
        if("phone_number" == (this.name) && !(/^1[3456789]\d{9}$/.test(this.value))){
            $("#messageBody")[0].innerText="电话号码不正确，请重新输入"
            checkStatus = false;
        }
        if("person_id" == (this.name)){
            if(!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(this.value))){
                $("#messageBody")[0].innerText="身份证号不合法！"
                checkStatus = false;
            }else {
                $.ajax({
                    url:"/personIdCheck",
                    dataType:"json",
                    data: {"person_id":this.value},
                    type:"get",
                    success:function (data) {
                        if(data==false){
                            $("#messageBody")[0].innerText="身份证号已经存在！";
                            checkStatus = false;
                        }
                    },
                    error:function () {
                        console.debug("sss");
                    },
                })
            }
        }
        if(!checkStatus){
            $("#messageModal").modal("show");
        }else{
            $("#submitChangeButton")[0].disabled="";
        }
    })
})
//编辑时回显数据
function setDiverDetails(row) {
    $("#name")[0].value=row.valueOf().name;
    $("#phone_number")[0].value=row.valueOf().phone_number;
    $("#person_id")[0].value=row.valueOf().person_id;
    $("#birthday")[0].value=row.valueOf().birthday;
    $("#nationality")[0].value=row.valueOf().nationality;
    $("#company")[0].value=row.valueOf().company;
    $("#foreign_language_ability")[0].value=row.valueOf().foreign_language_ability;
    $("#education")[0].value=row.valueOf().education;
    var status=row.valueOf().marital_status==true ? "已婚":"未婚"
    $("#marital_status").val(status);
    $("#sex").val(row.valueOf().sex);
    //$("#photo")[0].value=row.valueOf().photo;
}
function alertModelByRegister(){

    //设置注册独有的模态框属性
    $("#submitChangeButton")[0].disabled="disabled";
    $("#driverInfoForm").find("input").attr("disabled",false);
    $("#driverInfoForm").find("select").attr("disabled",false);
    $("#actionType")[0].innerText="注册新用户！！！";
    $("#idContainerDiv")[0].innerHTML="";
    $("#registerModal input").val("");
    $("#idContainerDiv")[0].innerHTML="";
}
function alertModelByEdit(){
    var row=$("#table1").bootstrapTable("getSelections",function (row) {
        return row;
    });
    if(row.length!=1){
        if(row.length>1)
            $("#messageBody")[0].innerHTML="<font color='red'>编辑操作只能选择一条记录！！！</font>"
        else
            $("#messageBody")[0].innerHTML="<font color='red'>请选择一条记录进行编辑！！！</font>"
        $("#messageModal").modal("show");
        return;
    }

    //设置独有的模态框属性
    $("#submitChangeButton")[0].disabled="disabled";
    $("#driverInfoForm").find("input").attr("disabled",false);
    $("#driverInfoForm").find("select").attr("disabled",false);
    $("#actionType")[0].innerText="编辑用户！！！"
    $("#idContainerDiv")[0].innerHTML="<input name='id' value='"+row[0].valueOf().id+"'>"
    setDiverDetails(row[0]);
    $("#registerModal").modal("show");
}
/**
 * 这是从前台直接拿数据的方法
 */
/*function alertModelByDetails(row) {
    setDiverDetails(row);
    $("#actionType")[0].innerText="详情(只读)"
    $("#submitChangeButton")[0].disabled="disabled";
    $("#registerModal").modal("show");
}*/
//详情操作重新请求后台数据
function getDetailsByAjax(id){
    $.ajax({
        url:"/getDriverDetails",
        dataType:"json",
        data: {"id":id},
        type:"get",
        success:function (data) {
            var driver=data;
            $("#name")[0].value=driver.name;
            $("#phone_number")[0].value=driver.phone_number;
            $("#person_id")[0].value=driver.person_id;
            $("#birthday")[0].value=driver.birthday;
            $("#nationality")[0].value=driver.nationality;
            $("#company")[0].value=driver.company;
            $("#foreign_language_ability")[0].value=driver.foreign_language_ability;
            $("#education")[0].value=driver.education;
            var status=driver.marital_status==true ? "已婚":"未婚"
            $("#marital_status").val(status);
            $("#sex").val(driver.sex);
            // $("#photo")[0].value=driver.photo;
        },
        error:function () {
            console.debug("sss");
        },
    })
}
function alertModelByDetails(row){
    getDetailsByAjax(row.valueOf().id);
    $("#actionType")[0].innerText="详情(只读)"
    $("#submitChangeButton")[0].disabled="disabled";
    $("#driverInfoForm").find("input").attr("disabled",true);
    $("#driverInfoForm").find("select").attr("disabled",true);
    $("#registerModal").modal("show");
}
//注册或编辑ajax提交
function submitRegisterInfoByAjax() {
    var form=new FormData($("#driverInfoForm")[0]);
    $.ajax({
        url:"/operateDriver",
        type:"post",
        data:form,
        processData:false,
        contentType:false,
        success:function (data) {
            if(data == true){
                $("#resultText")[0].innerText="操作成功！！！";
                $("#registerModal").modal("hide");
                $("#resultModal").modal("show");
            }else{
                $("#resultText")[0].innerText="操作失败请重试！！！";
                $("#resultModal").modal("show");
            }
        },
        error:function (result) {
            $("#resultText")[0].innerText="系统错误，请稍后再试！！！";
            $("#registerModal").modal("hide");
            $("#resultModal").modal("show");
        }
    })


}

