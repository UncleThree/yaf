<?php
/**
 * @describe:
 * @author: jichao
 * */

class ajaxdeleteuserAction extends BaseAction
{
    public function run($arg = null)
    {
            Yaf_Dispatcher::getInstance()->disableView();
        
            $id = DB::escape($_GET['id']);
        
            $data = array(
                    'deleted' => 1,
            );
            
            
            $re = UserModel::deleteUser($data, $id);
            echo json_encode($re);
    }
}

