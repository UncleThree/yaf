

$(function(){

	var uid = '';
	var add = '';
	var edit = '';
	
	$("#eachuser tr").click(function(){
		if($(this).attr('class') == 'acitved'){
			uid = $(this).attr('id').split('_')[1];
		}else{
			uid = null;
		}
		
	});
	
	
	//添加和更新操作
	$("#btn_submit").click(function(){
			
			var error = 0;
			var needAth = $(".needAth");
			
			//检查必填项
			needAth.each(function(){
				if($(this).val() == ""){
					$(this).css("border" , "2px solid #f1736a");
					error--;
				}else{
					$(this).css("border" , "1px solid #abaeb5");
				}
			});

			if(error >= 0){
				
				//不是增加就是更新
				if(add == 1){
					//添加
					
                    var url = '/back/adduser';
                    var postParams = formParams($(".maskContainer"));
                    var fileIds = ['small_img', 'big_img'];

					ajaxFileUpload(url, postParams, fileIds);

				}else{
					//更新
						
						var url = '/back/ajaxupdateuser?id='+uid;
						var updateParams = formParams($('.maskContainer'));
						var fileIds = ['small_img', 'big_img'];
						
						ajaxFileUpload(url, updateParams, fileIds);
						
						/*
						$.post('/back/ajaxupdateuser?id='+uid, updateParams,function(data) {
							   		console.debug(updateParams);
							   		document.location.reload();
							 	},
							 'json'
						);
						*/
				}
				
				//ajax post 文件 以及相关参数
				//success();
			}else{
				alert("请检查基本资料和简介中必填项是否都填写完毕！")
			}
			
			return false
		});
		
	
		//弹出"添加,编辑"层
		$("#add , #edit").click(function(){
			
			clearFormValues($(".maskContainer"));
			
			if($(this).attr('id') == 'edit'){
				
				//如果当前为编辑操作
				edit = 1;
				add = 0;
				
				//编辑单条用户信息
				if((uid - 0) == 0){
					alert("先选择,再进行此操作.");
					return false;
				}
				
				$.getJSON("/back/ajaxuser?id="+uid,function(jsonData){
					
				    updateFormValues($('.maskContainer'), jsonData);
				    
				    /*
				     * *
				     * 只为了选中实体店
				     * */
					$.getJSON("/back/crmshop?city="+jsonData['cityCode'],function(r){
						
						var optionStr = optionGen(r);
						
						$('#groupId').html(optionStr);
						
						$('#groupId').val(jsonData['groupId']);
						
					});
				    
				    
				});
			}else{
				//如果当前为添加操作
				edit = 0;
				add = 1;
			}
			
			$(".mask").css("display" , "block");
			$(".mask .maskContainer").css("display" , "block");
		});
		
		//调出删除弹层
		$("#delete").click(function(){
			
			if(uid == null || uid ==''){
				alert("先选择,再进行此操作.");
				return false;
			}
			
			$(".mask").css("display" , "block");
			$(".mask .deleteConfirm").css("display" , "block");
		});
		
		
		//删除操作
		$(".closeMask").click(function(){
			
			if($(this).attr('id') == 'btn_deleteConfirm'){
				$.getJSON("/back/ajaxdeleteuser?id="+uid,function(jsonData){
					if(jsonData == false){
						alert('删除失败');
					}
				});
				
				document.location.reload(); 
			}
			
			$(".mask").css("display" , "none");
			$(".mask .maskContainer").css("display" , "none");
			$(".mask .maskAddSuccess").css("display" , "none");
			
			return false;
		});
		
		new uploadPreview({ UpBtn: "small_img",  ImgShow: "imgShow1"});
		
		new uploadPreview({ UpBtn: "big_img",  ImgShow: "imgShow2" });
		
		//根据城市code得到实体店相关信息
		$('#cityCode').change(function(){
			
			var cityCode = $(this).val();
			
			$.getJSON("/back/crmshop?city="+cityCode,function(jsonData){
				
				var optionStr = optionGen(jsonData);
				
				$('#groupId').html(optionStr);
				
			});
		});
		
		
});



	// 提交成功弹出层
	function success(){
		$(".maskContainer").css("display" , "none");
		$(".maskAddSuccess").css("display" , "block");
	}
