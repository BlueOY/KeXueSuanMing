package com.blueoy.kexuesuanmingsys.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class StaticClass {

    // token
    public static String access_token = null;
    // token过期时间
    public static Date expiresTime = null;

    public static void getToken(){
        String grant_type = "client_credential";
        String appid = "wx4ee992a9184632fc";
        String secret = "d4cd752d42100f8f274c1acd6f08f283";
        String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type="+grant_type+"&appid="+appid+"&secret="+secret;
        try {
            String res = HttpUtil.get(url);
            JSONObject jsonObject = JSON.parseObject(res);
            access_token = jsonObject.getString("access_token");
            int expires_in = jsonObject.getInteger("expires_in");
            Calendar c = Calendar.getInstance();
//            c.setTime(new Date());
            c.add(Calendar.SECOND, expires_in);
            expiresTime = c.getTime();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String cloudFunction(String function_name, String POSTBODY){
        String env = "test-7x7l7";
        String url = "https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env="+env+"&name="+function_name+"&POSTBODY="+POSTBODY;
        try {
            return HttpUtil.post(url, POSTBODY);
        } catch (IOException e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

}
