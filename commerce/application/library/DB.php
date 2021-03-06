<?php
/**
 * @describe:
 * @author: Jerry Yang(hy0kle@gmail.com)
 * */
class DB
{
    private static $_db = null;

    private static function getDb()
    {
        if (null == self::$_db)
        {
            //TMD 明明是数据库单例模式,到了13层的NB环境什么都不好用了,
            //curl 不好用,单例也不好用
            //how stupid
            // 初始化数据库
            
            $conf = Yaf_Registry::get('config')->mysql->commerce->master->toArray();
            $dsn  = "mysql:dbname={$conf['database']};host={$conf['hostname']};port={$conf['port']}";
            $db = new PDO($dsn, $conf['username'], $conf['password']);
            // 忽略掉配置的字符,强制使用 utf8
            $db->query('SET NAMES UTF8');

            self::$_db = $db;
        }

        return self::$_db;
    }

    /**
     * @brief query 屏蔽掉 $db 句柄, 执行 sql 语句的标准入口
     *
     * @param: $sql
     *
     * @return: 
     */
    public static function query($sql)
    {
        $db = self::getDb();
        return $db->query($sql, PDO::FETCH_ASSOC);
    }

    /**
     * @brief select 以数组方式返回 select 的结果集
     *
     * @param: $sql
     *
     * @return: array
     */
    public static function select($sql)
    {
        return self::query($sql);
    }
    
    
    /**
     * get一行数据
     * 
     * @param string $sql
     * @return array
     */
    public static function get($sql)
    {
        $res = self::select($sql);
        return $res->fetch();
    }
    
    /**
     * get多行数据
     * 
     * @param string $sql
     * @return array
     */
    public static function getAll($sql)
    {
        $res = self::select($sql);
        return $res->fetchAll();
    }
    
    
    /**
     * 通用insert方法
     * @param unknown $save_data
     * @param unknown $table
     * @return Ambigous <:, string>
     */
    public static function insert($save_data, $table)
    {
    
        $set = array();
        
        foreach ($save_data as $field => $value)
        {
            $value = DB::escape($value);
            $set[] = "`{$field}` = '{$value}'";
        }
        $sql = sprintf('INSERT INTO `%s` SET %s', $table, implode(', ', $set));
        
        DB::query($sql);
    
        return DB::lastInsertId();
    }

    
    /**
     * 通用update方法
     * @param unknown $save_data
     * @param unknown $table
     * @return Ambigous <:, string>
     */
    public static function update($save_data, $table, $id)
    {
    
        $set = array();
    
        foreach ($save_data as $field => $value)
        {
            $value = DB::escape($value);
            $set[] = "`{$field}` = '{$value}'";
        }
        $sql = sprintf('UPDATE `%s` SET %s WHERE id = %d', $table, implode(', ', $set), $id);

        return DB::query($sql);
    
    }
    
    /**
        * @brief lastInsertId 取最后插入的 id
        *
        * @return: int | bool
     */
    public static function lastInsertId()
    {
        $db = self::getDb();
        return $db->lastInsertId(); 
    }

    /**
        * @brief escape 防 sql 注入
        *
        * @param: $str
        *
        * @return: string
     */
    public static function escape($str)
    {
        return Util::isBinary($str) ? addslashes($str) : htmlspecialchars(trim($str), ENT_QUOTES);
    }
    
    
}
/* vi:set ts=4 sw=4 et fdm=marker: */

